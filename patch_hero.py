import sys

with open("App.tsx", "r") as f:
    content = f.read()

target = """        <div className="flex flex-col items-center text-center max-w-4xl pt-1">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-2 drop-shadow-lg text-yellow-300 leading-tight uppercase">
            PROPHETE UNIVERSAL <span className="text-2xl sm:text-4xl opacity-80">LLC</span>
          </h1>
          <p className="mt-1 text-2xl sm:text-4xl text-teal-100 leading-relaxed font-normal tracking-wide">
            A one-stop location for Life Insurance, Professional Tax Services, Home & Auto.
            <br />
            <span className="font-semibold text-yellow-300 mt-3 block">We prioritize your family needs above everything else.</span>
          </p>"""

replacement = """        <div className="flex flex-col items-center text-center max-w-4xl pt-1">
          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
             <div className="h-px w-6 sm:w-10 bg-yellow-400/50"></div>
             <span className="uppercase tracking-[0.2em] text-[10px] sm:text-sm font-bold text-yellow-400 drop-shadow-sm">Serving South Florida Since 2014</span>
             <div className="h-px w-6 sm:w-10 bg-yellow-400/50"></div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-2 drop-shadow-lg text-yellow-300 leading-tight uppercase">
            PROPHETE UNIVERSAL <span className="text-2xl sm:text-4xl opacity-80">LLC</span>
          </h1>
          <p className="mt-1 text-2xl sm:text-4xl text-teal-100 leading-relaxed font-normal tracking-wide">
            A one-stop destination for Life Insurance, Professional Tax Services, Home & Auto.
            <br />
            <span className="font-semibold text-yellow-300 mt-3 block">We prioritize your family needs above everything else.</span>
          </p>"""

if target in content:
    with open("App.tsx", "w") as f:
        f.write(content.replace(target, replacement))
    print("Patched Hero.")
else:
    print("Could not find Hero string.")
