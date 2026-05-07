const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PROMOTORES_FILE = path.join(__dirname, 'promotores.json');

// Archivos y carpetas base a copiar a /dist
const ASSETS_TO_COPY = [
    'assets',
    'index.html',
    'aviso-legal.html',
    'privacidad.html',
    'robots.txt',
    'sitemap.xml',
    'favicon.svg'
];

// Valores por defecto en index.html original
const DEFAULT_USERNAME = 'iorngoldman';
const DEFAULT_WHATSAPP = '34655404502';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => copyRecursiveSync(path.join(src, child), path.join(dest, child)));
    } else if (exists) {
        fs.copyFileSync(src, dest);
    }
}

function runBuild() {
    console.log('--- Iniciando Build Local (promotores.json) ---');

    // 1. Limpiar dist
    if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DIST_DIR);

    // 2. Copiar base
    console.log('1. Copiando archivos base a /dist...');
    ASSETS_TO_COPY.forEach(item => {
        const src = path.join(__dirname, item);
        const dest = path.join(DIST_DIR, item);
        if (fs.existsSync(src)) copyRecursiveSync(src, dest);
    });

    // 3. Leer promotores locales
    if (!fs.existsSync(PROMOTORES_FILE)) {
        console.error('ERROR: No se encontró promotores.json');
        process.exit(1);
    }
    const promotores = JSON.parse(fs.readFileSync(PROMOTORES_FILE, 'utf-8'));

    // 4. Generar páginas
    console.log('2. Generando páginas replicadas...');
    const templateHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    const avisoHtml = fs.readFileSync(path.join(__dirname, 'aviso-legal.html'), 'utf-8');
    const privacidadHtml = fs.readFileSync(path.join(__dirname, 'privacidad.html'), 'utf-8');

    promotores.forEach(promotor => {
        if (!promotor.id || promotor.id === 'default') return;

        console.log(`   -> Generando subcarpeta para: ${promotor.id} (${promotor.nombre})`);
        const promotorDir = path.join(DIST_DIR, promotor.id);
        if (!fs.existsSync(promotorDir)) fs.mkdirSync(promotorDir, { recursive: true });

        // Personalizar index.html
        let customHtml = templateHtml
            .replace(new RegExp(`https://${DEFAULT_USERNAME}\\.orygn\\.co`, 'g'), `https://${promotor.orygnUsername}.orygn.co`)
            .replace(new RegExp(`phone=${DEFAULT_WHATSAPP}`, 'g'), `phone=${promotor.whatsapp}`)
            .replace(new RegExp('Jos%C3%A9', 'g'), encodeURIComponent(promotor.nombre || ''))
            .replace(/href="assets\//g, 'href="../assets/')
            .replace(/src="assets\//g, 'src="../assets/')
            .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"');

        fs.writeFileSync(path.join(promotorDir, 'index.html'), customHtml);

        // Legales
        fs.writeFileSync(path.join(promotorDir, 'aviso-legal.html'), avisoHtml.replace(/href="assets\//g, 'href="../assets/'));
        fs.writeFileSync(path.join(promotorDir, 'privacidad.html'), privacidadHtml.replace(/href="assets\//g, 'href="../assets/'));
    });

    console.log('--- Build completado con éxito ---');
}

runBuild();
