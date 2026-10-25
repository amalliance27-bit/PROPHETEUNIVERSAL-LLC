import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = """                        <>
                            <span className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-teal-900 whitespace-nowrap">
                                24/7 Executive Support
                            </span>
                            <span className="text-slate-700 font-bold text-base sm:text-xl md:text-2xl mt-0.5">
                                Live AI Voice Concierge & Web Tour
                            </span>
                        </>"""

replacement = """                        <>
                            <span className="text-lg sm:text-2xl md:text-3xl font-extrabold tracking-tight text-teal-900 whitespace-nowrap">
                                24/7 Executive Support
                            </span>
                            <span className="text-slate-600 font-bold text-sm sm:text-base md:text-lg">
                                Live AI Voice Concierge
                            </span>
                        </>"""

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Ask Pandora.")
else:
    print("Could not find Ask Pandora string.")
