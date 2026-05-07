html = open('index.html', encoding='utf-8').read()

# Update JSON-LD FAQ price text
old = 'TryGLP cuesta $55 USD por botella (110 gotas) o $129.95 USD el Triple Pack.'
new = 'TryGLP cuesta 47\u20ac / $55 USD por botella (110 gotas) o 112\u20ac / $129.95 USD el Triple Pack.'
html = html.replace(old, new)

old2 = '$10-$20 USD con entrega en 3-10'
new2 = '10\u20ac-20\u20ac / $10-$20 USD con entrega en 3-10'
html = html.replace(old2, new2)

open('index.html', 'w', encoding='utf-8').write(html)
print('OK')
