import sys
content = open('App.tsx').read()
old_str = """        <div className="w-full flex justify-center">
             <VideoPanel 
               subtitle="Protecting Your Family. Preserving Your Wealth."
             />
        </div>"""
new_str = """        <div className="w-full flex justify-center">
             <VideoPanel subtitle="" />
        </div>"""
if old_str in content:
    open('App.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced in App.tsx")
else:
    print("Could not find block in App.tsx")
