const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');

// Title check
const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
if (titleMatch) {
    const title = titleMatch[1].trim();
    console.log(`Title (${title.length} chars): "${title}"`);
    if (title.length >= 40 && title.length <= 65) {
        console.log('✅ Title length is OPTIMAL (40-65 chars).');
    } else {
        console.log('⚠️ Title length warning');
    }
}

// Meta description check
const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
if (descMatch) {
    const desc = descMatch[1].trim();
    console.log(`Description (${desc.length} chars): "${desc}"`);
    if (desc.length >= 50 && desc.length <= 160) {
        console.log('✅ Description length is OPTIMAL (50-160 chars).');
    } else {
        console.log('⚠️ Description length warning');
    }
}

// Schemas check
const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
let match;
let i = 1;
let errors = 0;
while ((match = regex.exec(html)) !== null) {
    try {
        const json = JSON.parse(match[1]);
        console.log(`✅ Schema ${i}: ${json['@type']} es válido.`);
        if (json['@type'] === 'FAQPage') {
            console.log(`   -> FAQPage tiene ${json.mainEntity ? json.mainEntity.length : 0} preguntas.`);
        }
    } catch (e) {
        console.error(`❌ Error en Schema ${i}: ${e.message}`);
        errors++;
    }
    i++;
}

if (errors === 0) {
    console.log('🎉 TODOS LOS SCHEMAS JSON-LD SON 100% VÁLIDOS!');
} else {
    process.exit(1);
}
