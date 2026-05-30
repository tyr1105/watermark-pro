import { useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import type { ImageItem } from '../types';

interface ImageUploaderProps {
  onUpload: (files: ImageItem[]) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(
    async (fileList: FileList) => {
      const validTypes = ['image/png', 'image/jpeg', 'image/webp'];
      const files = Array.from(fileList).filter((f) => validTypes.includes(f.type));

      const items: ImageItem[] = await Promise.all(
        files.map(
          (file) =>
            new Promise<ImageItem>((resolve) => {
              const url = URL.createObjectURL(file);
              const img = new Image();
              img.onload = () => {
                resolve({
                  id: crypto.randomUUID(),
                  file,
                  name: file.name,
                  url,
                  width: img.naturalWidth,
                  height: img.naturalHeight,
                });
              };
              img.onerror = () => {
                resolve({
                  id: crypto.randomUUID(),
                  file,
                  name: file.name,
                  url,
                  width: 0,
                  height: 0,
                });
              };
              img.src = url;
            }),
        ),
      );

      if (items.length > 0) {
        onUpload(items);
      }
    },
    [onUpload],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={() => inputRef.current?.click()}
      className="border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 hover:border-indigo-400"
      style={{
        borderColor: 'var(--border-color)',
        backgroundColor: 'var(--bg-secondary)',
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            processFiles(e.target.files);
          }
          e.target.value = '';
        }}
      />
      <div className="text-5xl mb-4">📁</div>
      <p className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
        拖拽图片到此处，或点击上传
      </p>
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
        支持 PNG、JPG、WebP 格式，可同时上传多张图片
      </p>
    </motion.div>
  );
}
