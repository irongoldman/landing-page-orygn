import os, re

base = r'F:\ENTORNO-DESARROLLO\ORYGN\Landing_Page'
files = ['index.html', 'robots.txt', 'sitemap.xml',
         'assets/css/styles.css', 'assets/js/scripts.js']

print('=== ARCHIVOS ===')
for f in files:
    path = os.path.join(base, f)
    if os.path.exists(path):
        print(f'  {f:35s} {os.path.getsize(path):>8,d} bytes')
    else:
        print(f'  {f:35s} MISSING!')

print()

html = open(os.path.join(base, 'index.html'), encoding='utf-8').read()

print('=== SEO CHECKLIST ===')
checks = [
    ('Title tag', '<title>' in html, 'posiciona la keyword principal'),
    ('Meta description', 'name="description"' in html, '160 chars optimizado'),
    ('Meta keywords', 'name="keywords"' in html, 'palabras clave semánticas'),
    ('Canonical URL', 'canonical' in html, 'evita duplicate content'),
    ('Robots meta', 'name="robots"' in html, 'index,follow configurado'),
    ('OG: title', 'og:title' in html, 'compartir en redes'),
    ('OG: description', 'og:description' in html, 'compartir en redes'),
    ('OG: image', 'og:image' in html, 'imagen al compartir'),
    ('OG: locale', 'og:locale' in html, 'idioma español'),
    ('Twitter card', 'twitter:card' in html, 'summary_large_image'),
    ('Twitter title', 'twitter:title' in html, 'X/Twitter'),
    ('Twitter image', 'twitter:image' in html, 'imagen para X'),
    ('Hreflang tags', 'hreflang' in html, 'alternate idiomas'),
    ('Theme color', 'theme-color' in html, 'color de navegador movil'),
    ('Apple meta', 'apple-mobile-web-app' in html, 'web app movil'),
    ('Favicon', 'rel="icon"' in html, 'icono en pestana'),
    ('Apple icon', 'apple-touch-icon' in html, 'icono iOS'),
    ('Preconnect', 'preconnect' in html, 'optimizacion fuentes'),
    ('DNS Prefetch', 'dns-prefetch' in html, 'resolucion DNS anticipada'),
    ('Font loading', 'media="print"' in html, 'carga asincrona de fuentes'),
    ('rel=noopener', 'noopener' in html, 'seguridad enlaces externos'),
]

for label, ok, desc in checks:
    status = 'OK' if ok else 'MISSING'
    print(f'  [{status:7s}] {label:25s} ({desc})')

print()
print('=== JSON-LD SCHEMAS ===')
schemas = re.findall(r'"@type":\s*"(\w+)"', html)
for s in schemas:
    print(f'  Schema: {s}')

print()

# Count specific technologies
print('=== ESTADISTICAS ===')
ld_re = r"application/ld\+json"
og_re = r'property="og:'
tw_re = r'name="twitter:'
print(f'  Meta tags totales:       {len(re.findall(r"<meta", html))}')
print(f'  JSON-LD bloques (script): {len(re.findall(ld_re, html))}')
print(f'  OG properties:           {len(re.findall(og_re, html))}')
print(f'  Twitter names:           {len(re.findall(tw_re, html))}')
alt_re = r'alt="'
print(f'  Imagenes con alt:        {len(re.findall(alt_re, html))}')
print(f'  Hreflang alternates:     {len(re.findall(r"hreflang", html))}')
print(f'  Lineas HTML totales:     {len(html.splitlines())}')
print(f'  Tamaño HTML:             {len(html):,d} bytes')

print()
print('=== ARCHIVOS SEO ===')
for f in ['robots.txt', 'sitemap.xml']:
    path = os.path.join(base, f)
    print(f'  {f}: {"EXISTS" if os.path.exists(path) else "MISSING"}')
