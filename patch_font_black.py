import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = 'uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base font-black text-black [text-shadow:-1px_-1px_0_#facc15,1px_-1px_0_#facc15,-1px_1px_0_#facc15,1px_1px_0_#facc15,2px_2px_0_#ca8a04,3px_3px_0_#a16207,4px_4px_4px_rgba(0,0,0,0.5)] whitespace-nowrap'
replacement = 'uppercase tracking-[0.1em] sm:tracking-[0.2em] text-xs sm:text-sm md:text-base font-bold text-black whitespace-nowrap'

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Font Black.")
else:
    print("Could not find target.")
