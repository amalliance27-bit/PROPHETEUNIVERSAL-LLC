import sys

with open("components/VoiceIndicator.tsx", "r") as f:
    content = f.read()

target = 'className="bg-yellow-400 border-2 border-teal-950 px-3 py-1.5 sm:px-4 sm:py-2 text-teal-950 font-black text-[10px] sm:text-xs uppercase tracking-wide rounded-full shadow-2xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] whitespace-nowrap"'
replacement = 'className="bg-yellow-400 border-2 border-teal-950 px-4 py-2 sm:px-5 sm:py-2.5 text-teal-950 font-black text-xs md:text-sm uppercase tracking-wide rounded-full shadow-2xl hover:bg-yellow-300 transition-all duration-300 transform hover:scale-[1.02] whitespace-nowrap"'

if target in content:
    with open("components/VoiceIndicator.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Reverted to original size.")
else:
    print("Could not find target.")
