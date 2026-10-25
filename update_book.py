import sys
content = open('App.tsx').read()
content = content.replace('BOOK CONSULTATION', 'SCHEDULE CONSULTATION')
content = content.replace('Book Consultation', 'Schedule Consultation')
open('App.tsx', 'w').write(content)
print("Updated all book consultation texts.")
