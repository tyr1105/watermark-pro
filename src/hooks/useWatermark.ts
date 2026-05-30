import { useEffect, useRef, useCallback } from 'react';
import type { WatermarkSettings } from '../types';

function getPositionCoords(
  position: WatermarkSettings['position'],
  imgW: number,
  imgH: number,
  textW: number,
  textH: number,
  customX: number,
  customY: number,
): { x: number; y: number } {
  const pad = Math.max(imgW, imgH) * 0.03;
  switch (position) {
    case 'top-left':
      return { x: pad, y: pad + textH };
    case 'top-center':
      return { x: (imgW - textW) / 2, y: pad + textH };
    case 'top-right':
      return { x: imgW - textW - pad, y: pad + textH };
    case 'center-left':
      return { x: pad, y: (imgH + textH) / 2 };
    case 'center':
      return { x: (imgW - textW) / 2, y: (imgH + textH) / 2 };
    case 'center-right':
      return { x: imgW - textW - pad, y: (imgH + textH) / 2 };
    case 'bottom-left':
      return { x: pad, y: imgH - pad };
    case 'bottom-center':
      return { x: (imgW - textW) / 2, y: imgH - pad };
    case 'bottom-right':
      return { x: imgW - textW - pad, y: imgH - pad };
    case 'custom':
      return { x: customX * imgW - textW / 2, y: customY * imgH + textH / 2 };
    default:
      return { x: (imgW - textW) / 2, y: (imgH + textH) / 2 };
  }
}

export function useWatermark() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const renderWatermark = useCallback(
    (
      img: HTMLImageElement,
      settings: WatermarkSettings,
      targetCanvas?: HTMLCanvasElement,
    ): string | null => {
      const canvas = targetCanvas || canvasRef.current;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      ctx.drawImage(img, 0, 0);

      const { text, fontFamily, fontSize, color, opacity, rotation, tiled, position, customX, customY } = settings;

      if (!text.trim()) return canvas.toDataURL('image/png');

      const scale = Math.max(img.naturalWidth, img.naturalHeight) / 1000;
      const actualFontSize = fontSize * scale;

      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = color;
      ctx.font = `${actualFontSize}px ${fontFamily}`;
      ctx.textBaseline = 'bottom';

      const metrics = ctx.measureText(text);
      const textW = metrics.width;
      const textH = actualFontSize;

      if (tiled) {
        const angleRad = (rotation * Math.PI) / 180;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(angleRad);

        const diagonal = Math.sqrt(canvas.width ** 2 + canvas.height ** 2);
        const spacingX = textW + actualFontSize * 1.5;
        const spacingY = actualFontSize * 2.5;

        for (let y = -diagonal; y < diagonal; y += spacingY) {
          for (let x = -diagonal; x < diagonal; x += spacingX) {
            ctx.fillText(text, x, y);
          }
        }
        ctx.restore();
      } else {
        const { x, y } = getPositionCoords(position, canvas.width, canvas.height, textW, textH, customX, customY);

        const angleRad = (rotation * Math.PI) / 180;
        ctx.save();
        ctx.translate(x + textW / 2, y - textH / 2);
        ctx.rotate(angleRad);
        ctx.fillText(text, -textW / 2, textH / 2);
        ctx.restore();
      }

      ctx.globalAlpha = 1;
      return canvas.toDataURL('image/png');
    },
    [],
  );

  const downloadImage = useCallback(
    (
      img: HTMLImageElement,
      settings: WatermarkSettings,
      filename: string,
    ) => {
      const offscreen = document.createElement('canvas');
      renderWatermark(img, settings, offscreen);
      if (!offscreen) return;

      const ext = filename.toLowerCase().endsWith('.png') ? 'png' : 'jpeg';
      const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';
      const quality = ext === 'jpeg' ? settings.jpegQuality / 100 : undefined;

      offscreen.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename.replace(/\.[^.]+$/, '') + '_watermarked.' + (ext === 'jpeg' ? 'jpg' : ext);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        },
        mimeType,
        quality,
      );
    },
    [renderWatermark],
  );

  return { canvasRef, renderWatermark, downloadImage };
}
