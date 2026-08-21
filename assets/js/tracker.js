/**
 * ORYGN Real-Time Visitor Analytics Tracker
 * Captura y registra la procedencia del tráfico, el promotor y el dispositivo en tiempo real.
 * Incluye detección avanzada de Inteligencia Artificial (ChatGPT, Perplexity, Gemini, Claude, Copilot).
 */

(function () {
    // 1. Obtener el ID del Promotor
    var path = window.location.pathname;
    var pathParts = path.split('/').filter(p => p !== "");
    var internalPaths = ['estudios', 'negocio', 'testimonios', 'presentacion', 'privacidad', 'aviso-legal', 'sitemap', 'faq', 'seguimiento', 'gracias', 'admin', 'assets'];

    var promotorId = 'default';
    if (pathParts.length > 0 && !pathParts[0].includes('.html') && !internalPaths.includes(pathParts[0])) {
        promotorId = pathParts[0];
    } else {
        promotorId = localStorage.getItem('orygn_dist_id') || 'default';
    }

    // 2. Normalizar la procedencia del tráfico (Referrer)
    var ref = document.referrer ? document.referrer.toLowerCase() : '';
    var currentHost = window.location.hostname.toLowerCase();
    var isInternal = false;

    if (!ref || ref === '') {
        isInternal = true;
    } else {
        try {
            var refHost = new URL(ref).hostname.toLowerCase();
            if (refHost === currentHost || 
                refHost.endsWith('gotas-triglp.com') || 
                refHost.endsWith('netlify.app') || 
                refHost.endsWith('orygn.co') || 
                refHost === 'localhost' || 
                refHost === '127.0.0.1') {
                isInternal = true;
            }
        } catch (e) {
            isInternal = true;
        }
    }

    var fuente = 'Directo / Enlace Compartido';

    if (!isInternal) {
        // 🤖 MOTORES DE INTELIGENCIA ARTIFICIAL (AEO / GEO)
        if (ref.includes('chatgpt.com') || ref.includes('chat.openai.com')) fuente = 'ChatGPT (IA)';
        else if (ref.includes('perplexity.ai')) fuente = 'Perplexity (IA)';
        else if (ref.includes('claude.ai')) fuente = 'Claude (IA)';
        else if (ref.includes('gemini.google.com') || ref.includes('bard.google.com')) fuente = 'Google Gemini (IA)';
        else if (ref.includes('copilot.microsoft.com')) fuente = 'Microsoft Copilot (IA)';
        else if (ref.includes('poe.com') || ref.includes('phind.com') || ref.includes('you.com')) fuente = 'Otras IAs';

        // 🔍 BUSCADORES TRADICIONALES (SEO)
        else if (ref.includes('google.')) fuente = 'Google Search';
        else if (ref.includes('bing.')) fuente = 'Bing';
        else if (ref.includes('yahoo.')) fuente = 'Yahoo';
        else if (ref.includes('duckduckgo.') || ref.includes('ddg.gg')) fuente = 'DuckDuckGo';
        else if (ref.includes('ecosia.')) fuente = 'Ecosia';

        // 📱 REDES SOCIALES Y MENSAJERÍA
        else if (ref.includes('facebook.') || ref.includes('fb.com')) fuente = 'Facebook';
        else if (ref.includes('instagram.')) fuente = 'Instagram';
        else if (ref.includes('tiktok.')) fuente = 'TikTok';
        else if (ref.includes('t.co') || ref.includes('twitter.') || ref.includes('x.com')) fuente = 'Twitter/X';
        else if (ref.includes('whatsapp') || ref.includes('wa.me')) fuente = 'WhatsApp';
        else if (ref.includes('youtube.')) fuente = 'YouTube';
        else if (ref.includes('telegram') || ref.includes('t.me')) fuente = 'Telegram';
        else if (ref.includes('linkedin.')) fuente = 'LinkedIn';
        else {
            try {
                var urlObj = new URL(ref);
                fuente = urlObj.hostname.replace('www.', '');
            } catch (e) {
                fuente = 'Otros';
            }
        }
    }

    // 3. Detectar Dispositivo
    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    var dispositivo = isMobile ? 'Móvil' : 'Escritorio';

    // 4. Estructura del evento de visita
    var visitEvent = {
        promotorId: promotorId,
        fuente: fuente,
        path: path || '/',
        dispositivo: dispositivo,
        fecha: new Date().toISOString(),
        timestamp: Date.now()
    };

    // 5. Obtener instancia de base de datos con soporte Multi-Región (EE.UU. y Europa)
    function getDatabaseInstance() {
        if (!firebase.apps.length) {
            firebase.initializeApp(window.firebaseConfig);
        }
        var app = firebase.app();
        try {
            return app.database();
        } catch (e) {
            var euUrl = "https://" + window.firebaseConfig.projectId + "-default-rtdb.europe-west1.firebasedatabase.app";
            return app.database(euUrl);
        }
    }

    function recordVisit() {
        if (window.firebase && window.firebaseConfig && window.firebaseConfig.apiKey) {
            try {
                var db = getDatabaseInstance();
                db.ref('visitas').push(visitEvent).catch(function(err) {
                    console.warn('ORYGN Tracker: Error enviando a Firebase (verificar Reglas .write: true):', err);
                    saveLocalFallback(visitEvent);
                });
            } catch (err) {
                console.warn('ORYGN Tracker Info:', err);
                saveLocalFallback(visitEvent);
            }
        } else {
            saveLocalFallback(visitEvent);
        }
    }

    function saveLocalFallback(event) {
        try {
            var localVisits = JSON.parse(localStorage.getItem('orygn_local_visits') || '[]');
            localVisits.unshift(event);
            if (localVisits.length > 200) localVisits = localVisits.slice(0, 200);
            localStorage.setItem('orygn_local_visits', JSON.stringify(localVisits));
        } catch (e) {}
    }

    if (document.readyState === 'complete') {
        recordVisit();
    } else {
        window.addEventListener('load', recordVisit);
    }
})();
