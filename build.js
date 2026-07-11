const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PROMOTORES_FILE = path.join(__dirname, 'promotores.json');

const ASSETS_TO_COPY = [
    'assets',
    'index.html',
    'aviso-legal.html',
    'privacidad.html',
    'testimonios.html',
    'negocio.html',
    'robots.txt',
    'sitemap.xml',
    'sitemap.html',
    'favicon.svg',
    'testiminios_triGLP',
    'admin',
    '404.html',
    '500.html'
];

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

function customizeHtml(html, promotor, isSubfolder = true) {
    let output = html
        .replace(new RegExp(`https://${DEFAULT_USERNAME}\\.orygn\\.co`, 'g'), `https://${promotor.orygnUsername}.orygn.co`)
        .replace(new RegExp(`phone=${DEFAULT_WHATSAPP}`, 'g'), `phone=${promotor.whatsapp}`)
        .replace(new RegExp('Jos%C3%A9', 'g'), encodeURIComponent(promotor.nombre || ''));

    if (isSubfolder) {
        output = output
            .replace(/href="assets\//g, 'href="../assets/')
            .replace(/src="assets\//g, 'src="../assets/')
            .replace(/poster="assets\//g, 'poster="../assets/')
            .replace(/url\(['"]?assets\//g, 'url(\'../assets/')
            .replace(/href="index\.html"/g, 'href="./"')
            .replace(/href="testimonios\.html"/g, 'href="testimonios"')
            .replace(/href="negocio\.html"/g, 'href="negocio"')
            .replace(/src="testiminios_triGLP\//g, 'src="../testiminios_triGLP/')
            .replace(/href="favicon\.svg"/g, 'href="../favicon.svg"');
            
        // Reemplazar PDFs por versiones genéricas en subcarpetas
        output = output
            .replace(/https:\/\/technoeconomia\.com\/docu-orygn\/ORYGN_Presentation_\(SP\)\.pdf/g, 'https://technoeconomia.com/docu-orygn-genericos/ORYGN_Presentation_%28SP%29_gener.pdf')
            .replace(/https:\/\/technoeconomia\.com\/docu-orygn\/ORYGN_Comp_Plan_\(ES\)\.pdf/g, 'https://technoeconomia.com/docu-orygn-genericos/ORYGN-Comp-Plan-%28ES%29-gener.pdf');

        // Inyectar script de retención anti-bypass (Cookie 48h)
        const antiBypassScript = `
    <script>
        // Sistema de retención (Anti-Bypass) 48h
        (function() {
            var d = new Date();
            d.setTime(d.getTime() + (48*60*60*1000));
            document.cookie = "sponsor=${promotor.id}; expires=" + d.toUTCString() + "; path=/";
        })();
    </script>
</head>`;
        output = output.replace('</head>', antiBypassScript);
    }
    return output;
}

function runBuild() {
    console.log('--- Iniciando Build Mejorado ---');

    if (fs.existsSync(DIST_DIR)) fs.rmSync(DIST_DIR, { recursive: true, force: true });
    fs.mkdirSync(DIST_DIR);

    console.log('1. Copiando archivos base...');
    ASSETS_TO_COPY.forEach(item => {
        const src = path.join(__dirname, item);
        const dest = path.join(DIST_DIR, item);
        if (fs.existsSync(src)) copyRecursiveSync(src, dest);
    });

    if (!fs.existsSync(PROMOTORES_FILE)) {
        console.error('ERROR: No se encontró promotores.json');
        process.exit(1);
    }
    let promotores = JSON.parse(fs.readFileSync(PROMOTORES_FILE, 'utf-8'));
    if (promotores && !Array.isArray(promotores) && promotores.promotores) {
        promotores = promotores.promotores;
    }

    const templateHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    const avisoHtml = fs.readFileSync(path.join(__dirname, 'aviso-legal.html'), 'utf-8');
    const privacidadHtml = fs.readFileSync(path.join(__dirname, 'privacidad.html'), 'utf-8');
    const testimoniosHtml = fs.readFileSync(path.join(__dirname, 'testimonios.html'), 'utf-8');
    const negocioHtml = fs.readFileSync(path.join(__dirname, 'negocio.html'), 'utf-8');
    const sitemapHtml = fs.readFileSync(path.join(__dirname, 'sitemap.html'), 'utf-8');

    // 2. Actualizar la RAÍZ (index.html principal) con los datos de "default"
    const defaultData = promotores.find(p => p.id === 'default');
    if (defaultData) {
        console.log('2. Actualizando página principal (raíz) con datos default...');
        const rootHtml = customizeHtml(templateHtml, defaultData, false);
        const rootTestimoniosHtml = customizeHtml(testimoniosHtml, defaultData, false);
        const rootNegocioHtml = customizeHtml(negocioHtml, defaultData, false);
        const rootSitemapHtml = customizeHtml(sitemapHtml, defaultData, false);
        fs.writeFileSync(path.join(DIST_DIR, 'index.html'), rootHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'testimonios.html'), rootTestimoniosHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'negocio.html'), rootNegocioHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'sitemap.html'), rootSitemapHtml);
    }

    // 3. Generar subcarpetas para todos los que NO sean "default"
    console.log('3. Generando subcarpetas de promotores...');
    promotores.forEach(promotor => {
        if (!promotor.id || promotor.id === 'default') return;

        console.log(`   -> Carpeta: /${promotor.id}/ (${promotor.nombre})`);
        const promotorDir = path.join(DIST_DIR, promotor.id);
        if (!fs.existsSync(promotorDir)) fs.mkdirSync(promotorDir, { recursive: true });

        fs.writeFileSync(path.join(promotorDir, 'index.html'), customizeHtml(templateHtml, promotor, true));
        fs.writeFileSync(path.join(promotorDir, 'testimonios.html'), customizeHtml(testimoniosHtml, promotor, true));
        fs.writeFileSync(path.join(promotorDir, 'negocio.html'), customizeHtml(negocioHtml, promotor, true));
        fs.writeFileSync(path.join(promotorDir, 'sitemap.html'), customizeHtml(sitemapHtml, promotor, true));
        fs.writeFileSync(path.join(promotorDir, 'aviso-legal.html'), avisoHtml.replace(/href="assets\//g, 'href="../assets/'));
        fs.writeFileSync(path.join(promotorDir, 'privacidad.html'), privacidadHtml.replace(/href="assets\//g, 'href="../assets/'));

    });

    console.log('--- Build completado con éxito ---');
}

runBuild();
