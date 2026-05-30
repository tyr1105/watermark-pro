export default function Footer() {
  return (
    <footer
      className="text-center py-6 text-sm"
      style={{ color: 'var(--text-secondary)' }}
    >
      <p>水印大师 WatermarkPro &copy; {new Date().getFullYear()}</p>
      <p className="mt-1 text-xs">
        纯浏览器端处理 · 无需上传服务器 · 保护您的隐私
      </p>
    </footer>
  );
}
