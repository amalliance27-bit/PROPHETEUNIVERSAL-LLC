import re
with open('App.tsx', 'r') as f:
    content = f.read()

target = """Thanks for visiting our website!
                         </p>
                    </div>

                </div>
             </ContentRoom>"""

replacement = """Thanks for visiting our website!
                         </p>
                    </div>

                    {/* Flyer Banner Image */}
                    <div className="pt-8 pb-4 flex justify-center w-full relative z-20">
                       <img 
                         src="https://raw.githubusercontent.com/amalliance27-bit/Rolin-prophete-universal/373d76b3b2e07d937a142e8921aa638a6d249581/PU%20banner%20black.png" 
                         alt="Prophete Universal - Protecting Your Family Is Our #1 Priority" 
                         className="w-full max-w-4xl rounded-xl shadow-md border border-slate-800 object-cover" 
                       />
                    </div>
                </div>
             </ContentRoom>"""

new_content = content.replace(target, replacement)
if new_content != content:
    with open('App.tsx', 'w') as f:
        f.write(new_content)
    print("Success")
else:
    print("Replacement failed")
