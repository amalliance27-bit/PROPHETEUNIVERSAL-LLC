import sys
content = open('components/VoiceIndicator.tsx').read()
old_str = """            <span className="text-xs font-bold">{isScrollPaused ? '▶' : '⏸'}</span>
            <span className="text-[11px] font-mono tracking-tighter">{isScrollPaused ? 'RESUME' : 'PAUSE'}</span>"""
new_str = """            <span className="text-xs font-bold px-1">{isScrollPaused ? '▶' : '⏸'}</span>"""
if old_str in content:
    open('components/VoiceIndicator.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced PAUSE/RESUME in VoiceIndicator")
else:
    print("Could not find PAUSE/RESUME string")
