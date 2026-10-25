import sys
content = open('App.tsx').read()

old_str = """const ServiceCard = ({ title, desc, onClick, gradient, textAccent, image, borderColor, descColor = "text-slate-800", roomLabel }: { title: string, desc: string, onClick: () => void, gradient: string, textAccent: string, image?: string, borderColor: string, descColor?: string, roomLabel?: string }) => (
  <div 
    onClick={onClick}
    className={`${gradient} rounded-2xl shadow-md border-4 ${borderColor} cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden h-full flex flex-col`}
  >
    {image && (
        <div className="h-48 w-full overflow-hidden relative">
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
        </div>
    )}

    <div className="p-8 flex flex-col flex-grow">
        <h3 className={`text-2xl md:text-3xl font-bold mb-4 relative z-10 ${textAccent}`}>{title}</h3>
        <p className={`${descColor} text-lg leading-relaxed relative z-10 font-medium mb-6 flex-grow`}>{desc}</p>
        <div className={`mt-auto flex items-center justify-between font-bold text-base md:text-lg tracking-wider relative z-10 uppercase pt-4 border-t border-black/10 ${textAccent}`}>
          <span>{roomLabel || "EXPLORE ROOM"}</span>
          <span className="text-2xl transform group-hover:translate-x-3 transition-transform duration-300 font-black">➔</span>
        </div>
    </div>
  </div>
);"""

new_str = """const ServiceCard = ({ title, desc, onClick, gradient, textAccent, image, borderColor, descColor = "text-slate-800", roomLabel }: { title: string, desc: string, onClick: () => void, gradient: string, textAccent: string, image?: string, borderColor: string, descColor?: string, roomLabel?: string }) => {
  const [isInView, setIsInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );
    
    if (cardRef.current) {
      observer.observe(cardRef.current);
    }
    
    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div 
      ref={cardRef}
      onClick={onClick}
      className={`${gradient} rounded-2xl shadow-md border-4 ${borderColor} cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group relative overflow-hidden h-full flex flex-col`}
    >
      {image && (
          <div className="h-48 w-full overflow-hidden relative">
               <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
              <img src={image} alt={title} className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" />
          </div>
      )}

      <div className="p-8 flex flex-col flex-grow">
          <h3 className={`text-2xl md:text-3xl font-bold mb-4 relative z-10 ${textAccent}`}>{title}</h3>
          <p className={`${descColor} text-lg leading-relaxed relative z-10 font-medium mb-6 flex-grow`}>{desc}</p>
          <div className={`mt-auto flex items-center justify-between font-bold text-base md:text-lg tracking-wider relative z-10 uppercase pt-4 border-t border-black/10 ${textAccent}`}>
            <span>{roomLabel || "EXPLORE ROOM"}</span>
            <div className="relative flex h-6 w-6 items-center justify-center transform group-hover:scale-125 transition-transform duration-300">
               <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 transition-colors duration-700 ${isInView ? 'bg-green-500' : 'bg-blue-500'}`}></span>
               <span className={`relative inline-flex rounded-full h-3 w-3 transition-colors duration-700 ${isInView ? 'bg-green-500' : 'bg-blue-500'}`}></span>
            </div>
          </div>
      </div>
    </div>
  );
};"""

if old_str in content:
    open('App.tsx', 'w').write(content.replace(old_str, new_str))
    print("Successfully replaced ServiceCard in App.tsx")
else:
    print("Could not find ServiceCard in App.tsx. Checking for differences...")
    print(content[16800:17000])
