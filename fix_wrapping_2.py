import sys

with open("components/SplashScreen.tsx", "r") as f:
    content = f.read()

# Make the subtitle scale enough so it doesn't need ellipsis, and fits on one line.
content = content.replace('text-[3.5vw] sm:text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto leading-tight px-2 text-center max-w-[90vw] whitespace-nowrap overflow-hidden text-ellipsis"', 'text-[2.5vw] sm:text-sm md:text-lg lg:text-xl text-slate-100 font-medium max-w-full mx-auto leading-tight px-2 text-center whitespace-nowrap"')

with open("components/SplashScreen.tsx", "w") as f:
    f.write(content)

print("Wrapping subtitle fixed.")
