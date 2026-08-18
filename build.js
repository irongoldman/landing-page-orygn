const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, 'dist');
const PROMOTORES_FILE = path.join(__dirname, 'promotores.json');

const ASSETS_TO_COPY = [
    'assets',
    'documents',
    'index.html',
    'estudios.html',
    'aviso-legal.html',
    'privacidad.html',
    'testimonios.html',
    'negocio.html',
    'presentacion.html',
    'robots.txt',
    'sitemap.xml',
    'sitemap.html',
    'favicon.svg',
    'testiminios_triGLP',
    'admin',
    'video',
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
            .replace(/href="assets\//g, 'href="/assets/')
            .replace(/src="assets\//g, 'src="/assets/')
            .replace(/src="video\//g, 'src="/video/')
            .replace(/poster="assets\//g, 'poster="/assets/')
            .replace(/url\(['"]?assets\//g, 'url(\'/assets/')
            .replace(/href="documents\//g, 'href="/documents/')
            .replace(/href="index\.html"/g, 'href="./"')
            .replace(/href="estudios\.html"/g, 'href="estudios"')
            .replace(/href="testimonios\.html"/g, 'href="testimonios"')
            .replace(/href="negocio\.html"/g, 'href="negocio"')
            .replace(/href="presentacion\.html"/g, 'href="presentacion"')
            .replace(/src="testiminios_triGLP\//g, 'src="/testiminios_triGLP/')
            .replace(/href="favicon\.svg"/g, 'href="/favicon.svg"');

            
        // Reemplazar PDFs por versiones genéricas en subcarpetas
        output = output
            .replace(/https:\/\/technoeconomia\.com\/docu-orygn\/ORYGN_Presentation_\(SP\)\.pdf/g, 'https://technoeconomia.com/docu-orygn-genericos/ORYGN_Presentation_%28SP%29_gener.pdf')
            .replace(/https:\/\/technoeconomia\.com\/docu-orygn\/ORYGN_Comp_Plan_\(ES\)\.pdf/g, 'https://technoeconomia.com/docu-orygn-genericos/ORYGN-Comp-Plan-%28ES%29-gener.pdf');

        // Inyectar script de retención anti-bypass (Cookie 48h + localStorage)
        const antiBypassScript = `
    <script>
        // Sistema de retención (Anti-Bypass) 48h
        (function() {
            var d = new Date();
            d.setTime(d.getTime() + (48*60*60*1000));
            var host = window.location.hostname;
            var domainAttr = host.includes('gotas-triglp.com') ? '; domain=.gotas-triglp.com' : '';
            document.cookie = "sponsor=${promotor.id}; expires=" + d.toUTCString() + "; path=/" + domainAttr;
            try { localStorage.setItem('orygn_dist_id', '${promotor.id}'); } catch(e){}
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
    const estudiosHtml = fs.readFileSync(path.join(__dirname, 'estudios.html'), 'utf-8');
    const avisoHtml = fs.readFileSync(path.join(__dirname, 'aviso-legal.html'), 'utf-8');
    const privacidadHtml = fs.readFileSync(path.join(__dirname, 'privacidad.html'), 'utf-8');
    const testimoniosHtml = fs.readFileSync(path.join(__dirname, 'testimonios.html'), 'utf-8');
    const negocioHtml = fs.readFileSync(path.join(__dirname, 'negocio.html'), 'utf-8');
    const presentacionHtml = fs.readFileSync(path.join(__dirname, 'presentacion.html'), 'utf-8');
    const sitemapHtml = fs.readFileSync(path.join(__dirname, 'sitemap.html'), 'utf-8');

    // 2. Actualizar la RAÍZ (index.html principal) con los datos de "default"
    const defaultData = promotores.find(p => p.id === 'default');
    if (defaultData) {
        console.log('2. Actualizando página principal (raíz) con datos default...');
        const rootHtml = customizeHtml(templateHtml, defaultData, false);
        const rootEstudiosHtml = customizeHtml(estudiosHtml, defaultData, false);
        const rootTestimoniosHtml = customizeHtml(testimoniosHtml, defaultData, false);
        const rootNegocioHtml = customizeHtml(negocioHtml, defaultData, false);
        const rootPresentacionHtml = customizeHtml(presentacionHtml, defaultData, false);
        const rootSitemapHtml = customizeHtml(sitemapHtml, defaultData, false);
        fs.writeFileSync(path.join(DIST_DIR, 'index.html'), rootHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'estudios.html'), rootEstudiosHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'testimonios.html'), rootTestimoniosHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'negocio.html'), rootNegocioHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'presentacion.html'), rootPresentacionHtml);
        fs.writeFileSync(path.join(DIST_DIR, 'sitemap.html'), rootSitemapHtml);
    }

    // 3. Generar archivos de promotores (en _p/ para subdominios limpios, y en /id/ para retrocompatibilidad)
    console.log('3. Generando archivos de promotores...');
    const pDir = path.join(DIST_DIR, '_p');
    if (!fs.existsSync(pDir)) fs.mkdirSync(pDir, { recursive: true });

    promotores.forEach(promotor => {
        if (!promotor.id || promotor.id === 'default') return;

        console.log(`   -> Promotor: ${promotor.id} (${promotor.nombre})`);
        const promotorDir = path.join(DIST_DIR, promotor.id);
        if (!fs.existsSync(promotorDir)) fs.mkdirSync(promotorDir, { recursive: true });

        const pIndex = customizeHtml(templateHtml, promotor, true);
        const pEstudios = customizeHtml(estudiosHtml, promotor, true);
        const pTestimonios = customizeHtml(testimoniosHtml, promotor, true);
        const pNegocio = customizeHtml(negocioHtml, promotor, true);
        const pPresentacion = customizeHtml(presentacionHtml, promotor, true);
        const pSitemap = customizeHtml(sitemapHtml, promotor, true);
        const pAviso = avisoHtml.replace(/href="assets\//g, 'href="/assets/');
        const pPrivacidad = privacidadHtml.replace(/href="assets\//g, 'href="/assets/');

        // Archivos para subdominio (evitan que Netlify agregue /id/ a la URL)
        fs.writeFileSync(path.join(pDir, `${promotor.id}_index.html`), pIndex);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_estudios.html`), pEstudios);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_testimonios.html`), pTestimonios);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_negocio.html`), pNegocio);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_presentacion.html`), pPresentacion);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_sitemap.html`), pSitemap);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_aviso-legal.html`), pAviso);
        fs.writeFileSync(path.join(pDir, `${promotor.id}_privacidad.html`), pPrivacidad);

        // Archivos para subcarpetas (retrocompatibilidad)
        fs.writeFileSync(path.join(promotorDir, 'index.html'), pIndex);
        fs.writeFileSync(path.join(promotorDir, 'estudios.html'), pEstudios);
        fs.writeFileSync(path.join(promotorDir, 'testimonios.html'), pTestimonios);
        fs.writeFileSync(path.join(promotorDir, 'negocio.html'), pNegocio);
        fs.writeFileSync(path.join(promotorDir, 'presentacion.html'), pPresentacion);
        fs.writeFileSync(path.join(promotorDir, 'sitemap.html'), pSitemap);
        fs.writeFileSync(path.join(promotorDir, 'aviso-legal.html'), pAviso);
        fs.writeFileSync(path.join(promotorDir, 'privacidad.html'), pPrivacidad);
    });

    // 4. Generar archivo _redirects dinámico para Netlify
    console.log('4. Generando reglas de redirección Netlify (_redirects)...');
    let redirectsContent = `# Dynamic Netlify Redirects for Subdomains & Legacy Subfolders\n\n`;

    promotores.forEach(promotor => {
        if (!promotor.id || promotor.id === 'default') return;

        const sub = promotor.id;
        // Assets por subdominio
        redirectsContent += `https://${sub}.gotas-triglp.com/assets/*  /assets/:splat  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/video/*  /video/:splat  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/documents/*  /documents/:splat  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/testiminios_triGLP/*  /testiminios_triGLP/:splat  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/favicon.svg  /favicon.svg  200!\n`;

        // Redirección 301 de URLs antiguas en dominio principal
        redirectsContent += `https://gotas-triglp.com/${sub}/*  https://${sub}.gotas-triglp.com/:splat  301!\n`;
        redirectsContent += `https://gotas-triglp.com/${sub}  https://${sub}.gotas-triglp.com/  301!\n`;

        // Enrutamiento directo forzado (200!) sin duplicación de carpetas
        redirectsContent += `https://${sub}.gotas-triglp.com/  /_p/${sub}_index.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/index.html  /_p/${sub}_index.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/estudios  /_p/${sub}_estudios.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/testimonios  /_p/${sub}_testimonios.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/negocio  /_p/${sub}_negocio.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/presentacion  /_p/${sub}_presentacion.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/sitemap  /_p/${sub}_sitemap.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/aviso-legal  /_p/${sub}_aviso-legal.html  200!\n`;
        redirectsContent += `https://${sub}.gotas-triglp.com/privacidad  /_p/${sub}_privacidad.html  200!\n\n`;
    });

    fs.writeFileSync(path.join(DIST_DIR, '_redirects'), redirectsContent);

    console.log('--- Build completado con éxito ---');
}

runBuild();
