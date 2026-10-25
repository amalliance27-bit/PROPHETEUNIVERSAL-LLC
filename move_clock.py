import sys
content = open('App.tsx').read()
old_str = """        <div className="w-full flex flex-col items-center justify-center">
             <VideoPanel 
               subtitle="Protecting Your Family. Preserving Your Wealth."
             />
             <div className="mt-4">
                 <AnalogueClock />
             </div>
        </div>"""
new_str = """        <div className="w-full flex justify-center">
             <VideoPanel 
               subtitle="Protecting Your Family. Preserving Your Wealth."
             />
        </div>"""
if old_str in content:
    open('App.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced in App.tsx")
else:
    print("Could not find block in App.tsx")

# And remove import from App.tsx
import_str = "import { AnalogueClock } from './components/AnalogueClock';\n"
content = open('App.tsx').read()
if import_str in content:
    open('App.tsx', 'w').write(content.replace(import_str, ""))
    print("Removed import from App.tsx")
