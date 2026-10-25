import sys
content = open('App.tsx').read()
old_str = """                 <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse font-mono tracking-widest">THE ARCADE LOUNGE</h2>
                 <p className="text-xl md:text-2xl text-blue-200 mb-8 font-mono">Wait time: ~10 mins • Play while you wait!</p>
                 <div className="w-full flex justify-center mb-12">
                     <VideoPanel subtitle="" />
                 </div>"""
new_str = """                 <div className="w-full flex justify-center mb-6">
                     <VideoPanel subtitle="" />
                 </div>
                 <h2 className="text-4xl md:text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 animate-pulse font-mono tracking-widest">THE ARCADE LOUNGE</h2>
                 <p className="text-xl md:text-2xl text-blue-200 mb-12 font-mono">Wait time: ~10 mins • Play while you wait!</p>"""

if old_str in content:
    open('App.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced Arcade Lounge order.")
else:
    print("Arcade Lounge string not found.")
