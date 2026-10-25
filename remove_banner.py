import re
with open('App.tsx', 'r') as f:
    content = f.read()

target = """                 {/* Banner Image - Placed Here after Office Location was moved */}
                 <div className="pt-2 pb-1 flex justify-center">
                    <img 
                      src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/373d76b3b2e07d937a142e8921aa638a6d249581/PU%20banner%20black.png" 
                      alt="Prophete Universal - Protecting Your Family Is Our #1 Priority" 
                      className="w-full max-w-4xl rounded-xl shadow-md border border-slate-800 object-cover" 
                    />
                 </div>"""

new_content = content.replace(target, "")
if new_content != content:
    with open('App.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Replacement failed")
