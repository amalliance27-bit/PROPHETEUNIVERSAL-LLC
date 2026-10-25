import re
with open('components/SplashScreen.tsx', 'r') as f:
    content = f.read()

# Change duration
content = content.replace("const slideDuration = 6000;", "const slideDuration = 5000;")

target = r"""      {/* Center Stage - Surgically Aligned Video & Clock */}
      <div className="relative z-10 flex flex-col items-center justify-between text-center px-3 py-1 sm:py-2 max-w-4xl mx-auto w-full flex-1 min-h-0 overflow-y-auto">"""

replacement = """      {/* Center Stage - Surgically Aligned Video & Clock */}
      <div className="relative z-10 flex flex-col items-center justify-evenly gap-6 sm:gap-10 text-center px-3 py-6 sm:py-10 max-w-4xl mx-auto w-full flex-1 min-h-0 overflow-y-auto">"""

if target in content:
    content = content.replace(target, replacement)
    print("Success")
    with open('components/SplashScreen.tsx', 'w') as f:
        f.write(content)
else:
    print("Failed")
