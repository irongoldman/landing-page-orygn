const fs = require('fs');
const path = require('path');
const https = require('https');

const DIST_DIR = path.join(__dirname, 'dist');
const PROMOTORES_FILE = path.join(__dirname, 'promotores.json');

// URL final de Google Forms CSV
const CSV_URL = process.env.PROMOTORES_CSV_URL || 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRwjrI3bIHgEWPb-8En28ttLk6l3rZO3y3enAA9N48oe4wrqjngtbf67afpanILA-lepjgspvRgTJS2/pub?gid=1668580010&single=true&output=csv';

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

function parseCSV(csvText) {
    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return [];
    
    // Función simple para manejar posibles comas dentro de comillas
    const splitLine = (line) => {
        const result = [];
        let cur = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) {
                result.push(cur.trim());
                cur = '';
            } else cur += char;
        }
        result.push(cur.trim());
        return result;
    };

    const headers = splitLine(lines[0]);
    return lines.slice(1).map(line => {
        const values = splitLine(line);
        const obj = {};
        headers.forEach((header, i) => {
            if (values[i] !== undefined) obj[header] = values[i];
        });
        return obj;
    });
}

async function fetchPromotores() {
    console.log('1. Intentando descargar datos desde Google Forms...');
    return new Promise((resolve) => {
        https.get(CSV_URL, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const list = parseCSV(data);
                    if (list.length === 0) throw new Error('CSV vacío');
                    console.log(`   ✅ Descargados ${list.length} registros desde el formulario.`);
                    resolve(list);
                } catch (e) {
                    console.error('   ❌ Error al procesar datos remotos, usando copia local.');
                    resolve(JSON.parse(fs.readFileSync(PROMOTORES_FILE, 'utf-8')));
                }
            });
        }).on('error', (err) => {
            console.error('   ❌ Error de conexión, usando copia local.');
            resolve(JSON.parse(fs.readFileSync(PROMOTORES_FILE, 'utf-8')));
        });
    });
}

async function runBuild() {
    console.log('--- Iniciando Build Automatizado (Formulario) ---');

    if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DIST_DIR);

    console.log('2. Copiando archivos base...');
    ASSETS_TO_COPY.forEach(item => {
        const src = path.join(__dirname, item);
        const dest = path.join(DIST_DIR, item);
        if (fs.existsSync(src)) copyRecursiveSync(src, dest);
    });

    const promotores = await fetchPromotores();

    console.log('3. Generando páginas replicadas...');
    const templateHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    const avisoHtml = fs.readFileSync(path.join(__dirname, 'aviso-legal.html'), 'utf-8');
    const privacidadHtml = fs.readFileSync(path.join(__dirname, 'privacidad.html'), 'utf-8');

    promotores.forEach(promotor => {
        // Ignorar si no tiene ID o es el default (que ya está en la raíz)
        if (!promotor.id || promotor.id === 'default' || promotor.id === '') return;

        console.log(`   -> Generando: /${promotor.id}/ (${promotor.nombre})`);
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
