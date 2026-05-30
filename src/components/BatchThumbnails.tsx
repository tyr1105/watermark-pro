import { motion } from 'framer-motion';
import type { ImageItem } from '../types';

interface BatchThumbnailsProps {
  images: ImageItem[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
}

export default function BatchThumbnails({ images, activeId, onSelect, onRemove }: BatchThumbnailsProps) {
  if (images.length <= 1) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="rounded-2xl p-3"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
          📸 批量图片 ({images.length})
        </span>
        <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
          点击选择
        </span>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => onSelect(img.id)}
            className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 group ${
              activeId === img.id ? 'ring-2 ring-indigo-500 ring-offset-2' : 'hover:ring-2 hover:ring-indigo-300'
            }`}
            style={{}}
          >
            <img
              src={img.url}
              alt={img.name}
              className="w-full h-full object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove(img.id);
              }}
              className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
