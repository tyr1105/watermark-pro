export interface WatermarkSettings {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  opacity: number;
  rotation: number;
  position: GridPosition;
  tiled: boolean;
  customX: number;
  customY: number;
  jpegQuality: number;
}

export type GridPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right'
  | 'custom';

export interface ImageItem {
  id: string;
  file: File;
  name: string;
  url: string;
  width: number;
  height: number;
}

export const DEFAULT_WATERMARK_SETTINGS: WatermarkSettings = {
  text: '水印大师',
  fontFamily: 'sans-serif',
  fontSize: 36,
  color: '#ffffff',
  opacity: 50,
  rotation: -30,
  position: 'center',
  tiled: false,
  customX: 0.5,
  customY: 0.5,
  jpegQuality: 90,
};

export const GRID_POSITIONS: { value: GridPosition; label: string }[] = [
  { value: 'top-left', label: '左上' },
  { value: 'top-center', label: '上中' },
  { value: 'top-right', label: '右上' },
  { value: 'center-left', label: '左中' },
  { value: 'center', label: '居中' },
  { value: 'center-right', label: '右中' },
  { value: 'bottom-left', label: '左下' },
  { value: 'bottom-center', label: '下中' },
  { value: 'bottom-right', label: '右下' },
];

export const FONT_OPTIONS = [
  { value: 'sans-serif', label: '无衬线体 (Sans-serif)' },
  { value: 'serif', label: '衬线体 (Serif)' },
  { value: 'monospace', label: '等宽体 (Monospace)' },
];
