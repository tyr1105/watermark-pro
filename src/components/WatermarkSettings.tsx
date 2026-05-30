import type { WatermarkSettings as WSSettings, GridPosition } from '../types';
import { GRID_POSITIONS, FONT_OPTIONS } from '../types';

interface WatermarkSettingsProps {
  settings: WSSettings;
  onChange: (settings: WSSettings) => void;
  hasImages: boolean;
}

export default function WatermarkSettings({ settings, onChange, hasImages }: WatermarkSettingsProps) {
  const update = <K extends keyof WSSettings>(key: K, value: WSSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  return (
    <div
      className="rounded-2xl p-5 space-y-5 overflow-y-auto"
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
      }}
    >
      <h2 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
        ⚙️ 水印设置
      </h2>

      {!hasImages && (
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          请先上传图片
        </p>
      )}

      {/* Text */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          水印文字
        </label>
        <input
          type="text"
          value={settings.text}
          onChange={(e) => update('text', e.target.value)}
          placeholder="输入水印文字"
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 focus:ring-2 focus:ring-indigo-400"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}
        />
      </div>

      {/* Font Family */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          字体
        </label>
        <select
          value={settings.fontFamily}
          onChange={(e) => update('fontFamily', e.target.value)}
          className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all duration-200 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
          }}
        >
          {FONT_OPTIONS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          字体大小: <span className="font-bold" style={{ color: 'var(--accent)' }}>{settings.fontSize}px</span>
        </label>
        <input
          type="range"
          min={12}
          max={120}
          value={settings.fontSize}
          onChange={(e) => update('fontSize', Number(e.target.value))}
        />
      </div>

      {/* Color */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          颜色
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={settings.color}
            onChange={(e) => update('color', e.target.value)}
            className="w-10 h-10 rounded-lg cursor-pointer border-0 p-0"
          />
          <span className="text-sm font-mono" style={{ color: 'var(--text-primary)' }}>
            {settings.color}
          </span>
        </div>
      </div>

      {/* Opacity */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          透明度: <span className="font-bold" style={{ color: 'var(--accent)' }}>{settings.opacity}%</span>
        </label>
        <input
          type="range"
          min={1}
          max={100}
          value={settings.opacity}
          onChange={(e) => update('opacity', Number(e.target.value))}
        />
      </div>

      {/* Rotation */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          旋转角度: <span className="font-bold" style={{ color: 'var(--accent)' }}>{settings.rotation}°</span>
        </label>
        <input
          type="range"
          min={-180}
          max={180}
          value={settings.rotation}
          onChange={(e) => update('rotation', Number(e.target.value))}
        />
      </div>

      {/* Tiled Mode */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => update('tiled', !settings.tiled)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
            settings.tiled ? 'bg-indigo-500' : ''
          }`}
          style={{ backgroundColor: settings.tiled ? undefined : 'var(--border-color)' }}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
              settings.tiled ? 'translate-x-6' : ''
            }`}
          />
        </button>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          平铺水印
        </span>
      </div>

      {/* Position Grid */}
      {!settings.tiled && (
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
            水印位置
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {GRID_POSITIONS.map((pos) => (
              <button
                key={pos.value}
                onClick={() => update('position', pos.value)}
                className="py-1.5 px-1 text-xs rounded-lg transition-all duration-150 cursor-pointer font-medium"
                style={{
                  backgroundColor:
                    settings.position === pos.value ? 'var(--accent)' : 'var(--bg-secondary)',
                  color: settings.position === pos.value ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                {pos.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* JPEG Quality */}
      <div>
        <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--text-secondary)' }}>
          导出质量 (JPEG): <span className="font-bold" style={{ color: 'var(--accent)' }}>{settings.jpegQuality}%</span>
        </label>
        <input
          type="range"
          min={10}
          max={100}
          value={settings.jpegQuality}
          onChange={(e) => update('jpegQuality', Number(e.target.value))}
        />
      </div>
    </div>
  );
}
