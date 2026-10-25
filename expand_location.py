import re
with open('App.tsx', 'r') as f:
    content = f.read()

target = r"""                 <div>
                    <div className="text-center mt-1 mb-3 relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-teal-950 drop-shadow-sm tracking-tight uppercase">Office Location</h2>
                    </div>
                    
                    <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#FFF5F8] via-[#FCE8ED] to-[#FADCE5] rounded-2xl p-3 sm:p-4 shadow-sm border-2 border-rose-200/90 text-slate-800 text-left">
                       <div className="grid lg:grid-cols-12 gap-3.5 items-center">
                          {/* Interactive Google Map Embed */}
                          <div className="lg:col-span-7 h-44 sm:h-48 w-full rounded-xl overflow-hidden shadow-sm border border-rose-200/80 relative bg-rose-100/50">"""

replacement = """                 <div className="w-full">
                    <div className="text-center mt-1 mb-3 relative z-10">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-teal-950 drop-shadow-sm tracking-tight uppercase">Office Location</h2>
                    </div>
                    
                    <div className="w-full bg-gradient-to-br from-[#FFF5F8] via-[#FCE8ED] to-[#FADCE5] rounded-2xl p-4 sm:p-6 md:p-8 shadow-sm border-2 border-rose-200/90 text-slate-800 text-left">
                       <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center">
                          {/* Interactive Google Map Embed */}
                          <div className="lg:col-span-8 h-64 md:h-80 lg:h-96 w-full rounded-xl overflow-hidden shadow-sm border border-rose-200/80 relative bg-rose-100/50">"""

content = content.replace(target, replacement)
content = content.replace("lg:col-span-5 space-y-2", "lg:col-span-4 space-y-4 md:space-y-6")

# The info panel needs to be a bit larger maybe?
content = content.replace("w-7 h-7 rounded-lg", "w-10 h-10 md:w-12 md:h-12 rounded-xl")
content = content.replace("w-3.5 h-3.5", "w-5 h-5 md:w-6 md:h-6")
content = content.replace('text-[10px] uppercase font-extrabold', 'text-xs md:text-sm uppercase font-extrabold')
content = content.replace('text-xs sm:text-sm font-bold', 'text-sm md:text-base font-bold')

with open('App.tsx', 'w') as f:
    f.write(content)
