import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = '<span className="uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base font-bold text-black whitespace-nowrap">Serving South Florida Since 2014</span>'
replacement = '<span className="uppercase tracking-widest text-xs sm:text-sm md:text-base font-bold text-black bg-yellow-400 px-3 py-1 rounded-full whitespace-nowrap">Serving South Florida Since 2014</span>'

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Font BG.")
else:
    print("Could not find target.")
