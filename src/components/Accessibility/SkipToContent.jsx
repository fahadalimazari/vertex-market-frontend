const SkipToContent = () => {
  return (
    <a 
      href="#main-content" 
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-[9999] bg-[#ff6a00] text-white px-6 py-3 rounded-xl font-bold shadow-2xl outline-none ring-4 ring-orange-500/50"
    >
      Skip to main content
    </a>
  );
};

export default SkipToContent;
