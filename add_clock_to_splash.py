import sys
content = open('components/SplashScreen.tsx').read()
old_str = """        {/* Video Panel - Exact 1:1 position and size alignment */}
        <div className="w-full flex justify-center flex-shrink-0 pt-1">
          <VideoPanel subtitle="Protecting Your Family. Preserving Your Wealth." />
        </div>"""
new_str = """        {/* Video Panel - Exact 1:1 position and size alignment */}
        <div className="w-full flex flex-col items-center justify-center flex-shrink-0 pt-1">
          <VideoPanel subtitle="Protecting Your Family. Preserving Your Wealth." />
          <div className="mt-4 scale-75 sm:scale-90 transform origin-top">
            <AnalogueClock />
          </div>
        </div>"""
if old_str in content:
    open('components/SplashScreen.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced in SplashScreen.tsx")
else:
    print("Could not find block in SplashScreen.tsx")

# Add import
import_str = "import { AnalogueClock } from './AnalogueClock';\n"
content = open('components/SplashScreen.tsx').read()
if import_str not in content:
    import_idx = content.find("import { VideoPanel }")
    if import_idx != -1:
        new_content = content[:import_idx] + import_str + content[import_idx:]
        open('components/SplashScreen.tsx', 'w').write(new_content)
        print("Added import to SplashScreen.tsx")
