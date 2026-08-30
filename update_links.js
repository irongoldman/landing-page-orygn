const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const files = [
    'index.html',
    'faq.html',
    'presentacion.html',
    'estudios.html',
    'testimonios.html',
    'negocio.html',
    'sitemap.html',
    'seguimiento.html',
    'gracias.html',
    'llms.txt'
];

files.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf-8');

    // Reemplazos de URLs de compra
    content = content
        .replace(/https:\/\/iorngoldman\.orygn\.co\/product\/?/g, 'https://iorngoldman.orygn.co/product')
        .replace(/https:\/\/iorngoldman\.orygn\.co\/shop\/?/g, 'https://iorngoldman.orygn.co/product')
        .replace(/https:\/\/iorngoldman\.orygn\.co\/(?=[^a-zA-Z0-9_-])/g, 'https://iorngoldman.orygn.co/product')
        .replace(/https:\/\/iorngoldman\.orygn\.co(?=["'\s>])/g, 'https://iorngoldman.orygn.co/product');

    // Restaurar dns-prefetch a la raíz del dominio
    content = content.replace(/rel="dns-prefetch" href="https:\/\/iorngoldman\.orygn\.co\/product"/g, 'rel="dns-prefetch" href="https://iorngoldman.orygn.co"');

    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`Actualizado: ${file}`);
});
