import sys

with open("components/SplashScreen.tsx", "r") as f:
    content = f.read()

# I added whitespace-nowrap to the subtitle previously. Let's make it line-clamp-2 again but smaller so it doesn't wrap as much, OR just leave it as whitespace-nowrap but make the text smaller.
content = content.replace('leading-tight px-2 text-center whitespace-nowrap"', 'leading-tight px-2 text-center max-w-[90vw] whitespace-nowrap overflow-hidden text-ellipsis"')

# Let's adjust title to not wrap and scale down on tiny screens.
content = content.replace('text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${s.gradientText} drop-shadow-[0_0_25px_rgba(56,189,248,0.3)] uppercase leading-none mb-1.5 sm:mb-2 font-sans text-center whitespace-nowrap`}', 'text-[8vw] sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${s.gradientText} drop-shadow-[0_0_25px_rgba(56,189,248,0.3)] uppercase leading-none mb-1.5 sm:mb-2 font-sans text-center whitespace-nowrap`}')

# And the tagline
content = content.replace('text-sm sm:text-base md:text-xl font-mono tracking-[0.18em] text-yellow-400 uppercase font-bold mb-1 sm:mb-1.5 whitespace-nowrap px-2 text-center', 'text-[3vw] sm:text-base md:text-xl font-mono tracking-[0.18em] text-yellow-400 uppercase font-bold mb-1 sm:mb-1.5 whitespace-nowrap px-2 text-center')

# Subtitle scaling to fit
content = content.replace('text-base sm:text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto', 'text-[3.5vw] sm:text-xl md:text-2xl text-slate-100 font-medium max-w-2xl mx-auto')

with open("components/SplashScreen.tsx", "w") as f:
    f.write(content)

with open("components/EmbossedDigitalClock.tsx", "r") as f:
    content = f.read()

content = content.replace('inline-flex flex-wrap items-center', 'inline-flex flex-nowrap whitespace-nowrap items-center')

with open("components/EmbossedDigitalClock.tsx", "w") as f:
    f.write(content)

print("Wrapping fixed.")
