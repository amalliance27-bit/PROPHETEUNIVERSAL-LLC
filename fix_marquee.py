import sys
content = open('components/LiveHeaderBar.tsx').read()
old_str = "AFTER HOURS ASSISTANCE AVAILABLE 24/7 • {COMPANY_INFO.phone} • AFTER HOURS ASSISTANCE AVAILABLE 24/7 • {COMPANY_INFO.phone} • AFTER HOURS ASSISTANCE AVAILABLE 24/7 • {COMPANY_INFO.phone} •"
new_str = "{Array(10).fill(`AFTER HOURS ASSISTANCE AVAILABLE 24/7 • ${COMPANY_INFO.phone} • `).join('')}"
open('components/LiveHeaderBar.tsx', 'w').write(content.replace(old_str, new_str))
