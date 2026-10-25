import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = """          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
             <div className="h-px w-6 sm:w-10 bg-yellow-400/50"></div>
             <span className="uppercase tracking-widest text-xs sm:text-sm md:text-base font-bold text-black bg-yellow-400 px-3 py-1 rounded-full whitespace-nowrap">Serving South Florida Since 2014</span>
             <div className="h-px w-6 sm:w-10 bg-yellow-400/50"></div>
          </div>"""

replacement = """          <div className="flex items-center justify-center mb-4">
             <span className="uppercase tracking-[0.1em] text-xs sm:text-sm md:text-base font-semibold text-black bg-yellow-400 px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">Serving South Florida Since 2014</span>
          </div>"""

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Font BG 2.")
else:
    print("Could not find target.")
