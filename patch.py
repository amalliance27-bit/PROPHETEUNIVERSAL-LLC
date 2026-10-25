import sys

with open("App.tsx", "r") as f:
    lines = f.readlines()

# find start and end of flyer block
start_idx = -1
for i, line in enumerate(lines):
    if "{/* Official Executive Flyer & Core Services Cards */}" in line:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx+1, len(lines)):
    if "Welcome to Prophete Universal" in lines[i]:
        # The div before it closes the Flyer block.
        # It's at 1210: <div className="px-1 sm:px-2 space-y-3"> 
        # and 1211 is Welcome to Prophete... 
        end_idx = i - 1
        break

print(f"Start: {start_idx}, End: {end_idx}")

if start_idx != -1 and end_idx != -1:
    with open("flyer.txt", "r") as f2:
        flyer_lines = f2.readlines()
        
    # delete original block
    del lines[start_idx:end_idx]
    
    # find where to insert
    # look for {/* Flyer Banner Image */}
    insert_idx = -1
    for i, line in enumerate(lines):
        if "{/* Flyer Banner Image */}" in line:
            insert_idx = i
            break
            
    if insert_idx != -1:
        # insert before the banner image
        lines[insert_idx:insert_idx] = flyer_lines
        
        with open("App.tsx", "w") as f:
            f.writelines(lines)
        print("Success!")
    else:
        print("Insert index not found")
else:
    print("Start or end not found")
