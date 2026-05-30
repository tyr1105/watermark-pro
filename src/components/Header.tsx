import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeaderProps {
  darkMode: boolean;
  onToggleDark: () => void;
}

export default function Header({ darkMode, onToggleDark }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg' : ''
      }`}
      style={{
        backgroundColor: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
      }}
    >
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
            W
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
              水印大师
            </h1>
            <p className="text-xs hidden sm:block" style={{ color: 'var(--text-secondary)' }}>
              在线免费图片水印工具
            </p>
          </div>
        </div>

        <button
          onClick={onToggleDark}
          className="w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 hover:opacity-80 cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
          }}
          aria-label="切换深色模式"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </motion.header>
  );
}
