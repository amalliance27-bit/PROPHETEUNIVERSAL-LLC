import sys
content = open('components/TourSimulator.tsx').read()
idx = content.find('  return (')
if idx != -1:
    new_content = content[:idx] + """  return (
    <div className="fixed bottom-32 right-6 sm:bottom-8 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] animate-fade-in pointer-events-none flex flex-col items-center">
      <button 
        onClick={handleClose}
        className="pointer-events-auto px-6 py-2.5 bg-black/20 hover:bg-black/60 text-white/80 hover:text-white font-bold text-[10px] md:text-xs rounded-full backdrop-blur-sm transition-all flex items-center gap-2 uppercase tracking-widest border border-white/10 hover:border-white/30"
      >
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </div>
        Stop
      </button>
    </div>
  );
};
"""
    open('components/TourSimulator.tsx', 'w').write(new_content)
    print("Success")
else:
    print("Not found")
