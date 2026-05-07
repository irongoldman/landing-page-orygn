const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PROMOTORES_FILE = path.join(__dirname, 'promotores.json');

// Files and directories to copy to root of dist
const ASSETS_TO_COPY = [
    'assets',
    'index.html',
    'aviso-legal.html',
    'privacidad.html',
    'robots.txt',
    'sitemap.xml'
];

// Default values in the current index.html
const DEFAULT_USERNAME = 'iorngoldman';
const DEFAULT_WHATSAPP = '34655404502';

function copyRecursiveSync(src, dest) {
    const exists = fs.existsSync(src);
    const stats = exists && fs.statSync(src);
    const isDirectory = exists && stats.isDirectory();
    if (isDirectory) {
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(function(childItemName) {
            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
        });
    } else {
        if (exists) {
            fs.copyFileSync(src, dest);
        }
    }
}

console.log('--- Iniciando Build de ORYGN Landing Page ---');

// 1. Clean and create dist directory
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);

// 2. Copy base assets to dist root
console.log('1. Copiando archivos base a /dist...');
ASSETS_TO_COPY.forEach(item => {
    const src = path.join(__dirname, item);
    const dest = path.join(DIST_DIR, item);
    if (fs.existsSync(src)) {
        copyRecursiveSync(src, dest);
    }
});

// 3. Read promotores.json
if (!fs.existsSync(PROMOTORES_FILE)) {
    console.error('ERROR: No se encontró el archivo promotores.json');
    process.exit(1);
}

const promotores = JSON.parse(fs.readFileSync(PROMOTORES_FILE, 'utf-8'));

// 4. Generate a folder for each promoter
const templateHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
const avisoHtml = fs.readFileSync(path.join(__dirname, 'aviso-legal.html'), 'utf-8');
const privacidadHtml = fs.readFileSync(path.join(__dirname, 'privacidad.html'), 'utf-8');

console.log('2. Generando páginas replicadas...');

promotores.forEach(promotor => {
    if (promotor.id === 'default') {
        // Skip default as it's already copied
        return;
    }

    console.log(`   -> Generando subcarpeta para: ${promotor.id} (ORYGN: ${promotor.orygnUsername}, WA: ${promotor.whatsapp})`);
    const promotorDir = path.join(DIST_DIR, promotor.id);
    
    if (!fs.existsSync(promotorDir)) {
        fs.mkdirSync(promotorDir, { recursive: true });
    }

    // Process index.html
    const usernameRegex = new RegExp(`https://${DEFAULT_USERNAME}\\.orygn\\.co`, 'g');
    let customizedHtml = templateHtml.replace(usernameRegex, `https://${promotor.orygnUsername}.orygn.co`);

    const waRegex = new RegExp(`phone=${DEFAULT_WHATSAPP}`, 'g');
    customizedHtml = customizedHtml.replace(waRegex, `phone=${promotor.whatsapp}`);

    // Replace the name in the WhatsApp message text
    const nameRegex = new RegExp('Jos%C3%A9', 'g');
    const encodedName = encodeURIComponent(promotor.nombre || '');
    customizedHtml = customizedHtml.replace(nameRegex, encodedName);

    // Adjust relative asset paths for index.html
    customizedHtml = customizedHtml.replace(/href="assets\//g, 'href="../assets/');
    customizedHtml = customizedHtml.replace(/src="assets\//g, 'src="../assets/');
    
    fs.writeFileSync(path.join(promotorDir, 'index.html'), customizedHtml);

    // Provide localized legal pages so they redirect properly within the subfolder if opened directly
    let customAviso = avisoHtml.replace(/href="assets\//g, 'href="../assets/');
    fs.writeFileSync(path.join(promotorDir, 'aviso-legal.html'), customAviso);
    
    let customPrivacidad = privacidadHtml.replace(/href="assets\//g, 'href="../assets/');
    fs.writeFileSync(path.join(promotorDir, 'privacidad.html'), customPrivacidad);
});

console.log('--- Build completado con éxito ---');
