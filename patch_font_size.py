import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = 'uppercase tracking-[0.2em] text-[10px] sm:text-sm font-bold text-yellow-400 drop-shadow-sm'
replacement = 'uppercase tracking-[0.2em] text-xs sm:text-base md:text-lg font-bold text-yellow-400 drop-shadow-sm'

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Font Size.")
else:
    print("Could not find target.")
