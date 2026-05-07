import re
html = open(r'F:\ENTORNO-DESARROLLO\ORYGN\Landing_Page\index.html', encoding='utf-8').read()
sections = re.findall(r'id="([^"]+)"', html)
print('IDs encontrados:')
for s in sections:
    print(f'  #{s}')
print()
h2s = re.findall(r'<h2>(.*?)</h2>', html)
print('H2s:')
for h in h2s:
    print(f'  {h}')
print()
print(f'Total lineas: {len(html.splitlines())}')
