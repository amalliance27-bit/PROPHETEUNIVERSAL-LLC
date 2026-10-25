import sys
content = open('components/TourSimulator.tsx').read()
idx = content.find('  if (!isOpen) return null;')
if idx != -1:
    new_content = content[:idx] + """  useEffect(() => {
    if (isOpen && !isPlaying && !isCompleted) {
      startShowcase();
    }
  }, [isOpen, isPlaying, isCompleted]);

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-24 right-6 sm:bottom-8 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 z-[70] animate-fade-in pointer-events-none flex flex-col items-center gap-2">
      {isPlaying && (
        <div className="bg-teal-950/80 backdrop-blur-md px-4 py-2 rounded-full border border-yellow-400/30 text-yellow-300 font-bold text-xs uppercase tracking-widest shadow-xl flex items-center gap-2">
           <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
          </div>
          Pandora Tour: {SHOWCASE_STEPS[currentStepIndex]?.roomName || "In Progress"}
        </div>
      )}
      <button 
        onClick={handleClose}
        className="pointer-events-auto px-6 py-2 bg-teal-950/40 hover:bg-teal-950/90 text-white font-bold text-xs rounded-full shadow-lg border border-teal-500/30 backdrop-blur-sm transition-all flex items-center gap-2 uppercase tracking-wider hover:text-yellow-400 hover:border-yellow-400/50"
      >
        Stop Pandora Tour
      </button>
    </div>
  );
};
"""
    open('components/TourSimulator.tsx', 'w').write(new_content)
    print("Success")
else:
    print("Not found")
