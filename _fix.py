import re

html = open(r'index.html', encoding='utf-8').read()
count = 0

def add_rel(match):
    global count
    tag = match.group(0)
    if 'rel=' in tag:
        return tag  # already has it
    count += 1
    # insert rel before >
    tag = tag.replace('target="_blank"', 'target="_blank" rel="noopener noreferrer"')
    return tag

# Fix all <a> tags pointing to orygn.co with target=_blank
html = re.sub(r'<a\s[^>]*href="https://irongoldman\.orygn\.co/[^"]*"[^>]*>', add_rel, html)

open(r'index.html', 'w', encoding='utf-8').write(html)
print(f'Fixed {count} links')
