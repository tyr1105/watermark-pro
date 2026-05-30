import { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import type { ImageItem, WatermarkSettings as WSSettings } from '../types';

interface ImagePreviewProps {
  image: ImageItem | null;
  settings: WSSettings;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  renderWatermark: (
    img: HTMLImageElement,
    settings: WSSettings,
    targetCanvas?: HTMLCanvasElement,
  ) => string | null;
  onDownloadSingle: () => void;
  onDownloadAll: () => void;
  imageCount: number;
  onCustomDrag: (x: number, y: number) => void;
}

export default function ImagePreview({
  image,
  settings,
  canvasRef,
  renderWatermark,
  onDownloadSingle,
  onDownloadAll,
  imageCount,
  onCustomDrag,
}: ImagePreviewProps) {
  const imgRef = useRef<HTMLImageElement | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const isDragging = useRef(false);

  const updatePreview = useCallback(() => {
    if (!image) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      const result = renderWatermark(img, settings, previewCanvasRef.current || undefined);
      if (result) setPreviewUrl(result);
    };
    img.src = image.url;
  }, [image, settings, renderWatermark]);

  useEffect(() => {
    updatePreview();
  }, [updatePreview]);

  const handleMouseDown = useCallback(() => {
    if (settings.position === 'custom' && !settings.tiled) {
      isDragging.current = true;
    }
  }, [settings.position, settings.tiled]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
      onCustomDrag(x, y);
    },
    [onCustomDrag],
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  if (!image) {
    return (
      <div
        className="flex-1 flex items-center justify-center rounded-2xl min-h-[400px]"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>
            上传图片后即可预览水印效果
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-3 min-w-0">
      <div
        ref={containerRef}
        className="flex-1 flex items-center justify-center rounded-2xl overflow-hidden relative min-h-[400px]"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {previewUrl && (
          <motion.img
            key={previewUrl}
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 1 }}
            src={previewUrl}
            alt="水印预览"
            className="max-w-full max-h-[600px] object-contain"
            style={{ userSelect: 'none', pointerEvents: 'none' }}
          />
        )}
        {settings.position === 'custom' && !settings.tiled && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-xs px-3 py-1 rounded-full bg-black/30 text-white">
              拖拽调整位置
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={onDownloadSingle}
          className="px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
        >
          📥 下载当前图片
        </button>
        {imageCount > 1 && (
          <button
            onClick={onDownloadAll}
            className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-90 cursor-pointer"
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}
          >
            📦 批量下载 (ZIP)
          </button>
        )}
      </div>

      <canvas ref={previewCanvasRef} className="hidden" />
    </div>
  );
}
