import sys

with open("components/RadioPlayer.tsx", "r") as f:
    content = f.read()

content = content.replace("isWaitingRoomRef.current = (isHomePage || isWaitingRoom);", "isWaitingRoomRef.current = isWaitingRoom;")

with open("components/RadioPlayer.tsx", "w") as f:
    f.write(content)
print("Radio fixed.")
