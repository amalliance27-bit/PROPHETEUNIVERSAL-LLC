import sys
content = open('App.tsx').read()
old_str = """          <div className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
            <button onClick={onCta} className="px-10 py-5 border border-transparent text-2xl font-bold rounded-md text-teal-900 bg-yellow-400 hover:bg-yellow-300 transition-all hover:scale-105 shadow-xl uppercase tracking-wide">
              BOOK CONSULTATION
            </button>
            <button onClick={onSecondary} className="px-10 py-5 border-2 border-white text-2xl font-bold rounded-md text-white hover:bg-white/10 transition-transform hover:scale-105 uppercase tracking-wide">
              Client Wishlist
            </button>
          </div>"""
new_str = """          <div className="mt-12 flex flex-col sm:flex-row gap-6 w-full sm:w-auto justify-center">
            <button onClick={onCta} className="flex-1 sm:flex-none px-6 py-4 sm:px-8 sm:py-5 border border-transparent text-lg sm:text-xl font-bold rounded-md text-teal-900 bg-yellow-400 hover:bg-yellow-300 transition-all hover:scale-105 shadow-md uppercase tracking-wide text-center">
              Schedule Consultation
            </button>
            <button onClick={onSecondary} className="flex-1 sm:flex-none px-6 py-4 sm:px-8 sm:py-5 border-2 border-white text-lg sm:text-xl font-bold rounded-md text-white hover:bg-white/10 transition-transform hover:scale-105 uppercase tracking-wide text-center">
              Client Wishlist
            </button>
          </div>"""
if old_str in content:
    open('App.tsx', 'w').write(content.replace(old_str, new_str))
    print("Replaced Hero buttons.")
else:
    print("Hero buttons not found.")
