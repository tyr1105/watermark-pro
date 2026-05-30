import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import JSZip from 'jszip';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import WatermarkSettings from './components/WatermarkSettings';
import ImagePreview from './components/ImagePreview';
import BatchThumbnails from './components/BatchThumbnails';
import Footer from './components/Footer';
import { useWatermark } from './hooks/useWatermark';
import type { ImageItem, WatermarkSettings as WSSettings } from './types';
import { DEFAULT_WATERMARK_SETTINGS } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeImageId, setActiveImageId] = useState<string | null>(null);
  const [settings, setSettings] = useState<WSSettings>(DEFAULT_WATERMARK_SETTINGS);
  const loadedImagesRef = useRef<Map<string, HTMLImageElement>>(new Map());

  const { canvasRef, renderWatermark, downloadImage } = useWatermark();

  const activeImage = images.find((img) => img.id === activeImageId) || null;

  const handleUpload = useCallback((newFiles: ImageItem[]) => {
    setImages((prev) => {
      const updated = [...prev, ...newFiles];
      if (!prev.length) {
        setActiveImageId(newFiles[0]!.id);
      }
      return updated;
    });
  }, []);

  const handleRemoveImage = useCallback(
    (id: string) => {
      setImages((prev) => {
        const idx = prev.findIndex((i) => i.id === id);
        const item = prev.find((i) => i.id === id);
        if (item) URL.revokeObjectURL(item.url);
        const updated = prev.filter((i) => i.id !== id);
        if (activeImageId === id) {
          if (updated.length > 0) {
            const newIdx = Math.min(idx, updated.length - 1);
            setActiveImageId(updated[newIdx]!.id);
          } else {
            setActiveImageId(null);
          }
        }
        return updated;
      });
    },
    [activeImageId],
  );

  const getLoadedImage = useCallback(
    (imgItem: ImageItem): Promise<HTMLImageElement> => {
      const cached = loadedImagesRef.current.get(imgItem.id);
      if (cached) return Promise.resolve(cached);
      return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          loadedImagesRef.current.set(imgItem.id, img);
          resolve(img);
        };
        img.onerror = () => resolve(img);
        img.src = imgItem.url;
      });
    },
    [],
  );

  const handleDownloadSingle = useCallback(async () => {
    if (!activeImage) return;
    const img = await getLoadedImage(activeImage);
    downloadImage(img, settings, activeImage.name);
  }, [activeImage, settings, downloadImage, getLoadedImage]);

  const handleDownloadAll = useCallback(async () => {
    if (images.length === 0) return;

    const zip = new JSZip();

    for (const imageItem of images) {
      const img = await getLoadedImage(imageItem);

      const offscreen = document.createElement('canvas');
      renderWatermark(img, settings, offscreen);

      const ext = imageItem.name.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
      const quality = ext === 'jpeg' ? settings.jpegQuality / 100 : undefined;

      const dataUrl = offscreen.toDataURL(mimeType, quality);
      const base64 = dataUrl.split(',')[1];
      if (base64) {
        const outName = imageItem.name.replace(/\.[^.]+$/, '') + '_watermarked.' + (ext === 'jpeg' ? 'jpg' : ext);
        zip.file(outName, base64, { base64: true });
      }
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'watermarked_images.zip';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [images, settings, renderWatermark, getLoadedImage]);

  const handleCustomDrag = useCallback((x: number, y: number) => {
    setSettings((prev) => ({ ...prev, customX: x, customY: y, position: 'custom' }));
  }, []);

  return (
    <div data-theme={darkMode ? 'dark' : 'light'} className="min-h-screen flex flex-col">
      <Header darkMode={darkMode} onToggleDark={() => setDarkMode((d) => !d)} />

      <main className="flex-1 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-6">
        <AnimatePresence>
          {images.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6"
            >
              <ImageUploader onUpload={handleUpload} />
            </motion.div>
          )}
        </AnimatePresence>

        {images.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col lg:flex-row gap-4"
          >
            {/* Left Panel */}
            <div className="w-full lg:w-80 flex-shrink-0 space-y-4">
              <ImageUploader onUpload={handleUpload} />
              <WatermarkSettings
                settings={settings}
                onChange={setSettings}
                hasImages={images.length > 0}
              />
            </div>

            {/* Right / Main */}
            <ImagePreview
              image={activeImage}
              settings={settings}
              canvasRef={canvasRef}
              renderWatermark={renderWatermark}
              onDownloadSingle={handleDownloadSingle}
              onDownloadAll={handleDownloadAll}
              imageCount={images.length}
              onCustomDrag={handleCustomDrag}
            />
          </motion.div>
        )}

        <BatchThumbnails
          images={images}
          activeId={activeImageId}
          onSelect={setActiveImageId}
          onRemove={handleRemoveImage}
        />
      </main>

      <Footer />
    </div>
  );
}
