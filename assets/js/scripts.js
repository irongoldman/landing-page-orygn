/* =========================================================================
   ORYGN triGLP & IGNYT — SCRIPTS PRINCIPALES BLINDADOS
   ========================================================================= */

// --- 1. Fuente Única de Verdad de Precios ---
window.ORYGN_PRICING = {
    singleEur: 78.00,
    singleUsd: 84.95,
    singleDistEur: 69.00,
    singleDistUsd: 74.95,
    pack2Eur: 128.40,
    pack2Usd: 139.95,
    pack2DistEur: 119.20,
    pack2DistUsd: 129.95,
    savingsEur: 27.60,
    savingsUsd: 29.95,
    discountPct: 18
};

function initApp() {

    // --- 2. Scroll Animations Observer (Fail-safe) ---
    try {
        const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        obs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px 0px', threshold: 0.01 });

            revealElements.forEach(el => observer.observe(el));
        } else {
            revealElements.forEach(el => el.classList.add('is-visible'));
        }
    } catch (e) {
        console.warn('Observer warning:', e);
    }

    // --- 3. Reproductor de Podcast de Audio ---
    try {
        const audio = document.getElementById('podcast-audio');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        const progressBar = document.getElementById('progress-bar');
        const currentTimeEl = document.getElementById('current-time');
        const totalTimeEl = document.getElementById('total-time');

        if (audio && playPauseBtn) {
            function formatTime(seconds) {
                if (isNaN(seconds) || seconds < 0) return '0:00';
                const min = Math.floor(seconds / 60);
                const sec = Math.floor(seconds % 60);
                return `${min}:${sec < 10 ? '0' : ''}${sec}`;
            }

            function updateDuration() {
                if (audio.duration && !isNaN(audio.duration)) {
                    if (totalTimeEl) totalTimeEl.textContent = formatTime(audio.duration);
                    if (progressBar) progressBar.max = Math.floor(audio.duration);
                }
            }

            audio.addEventListener('loadedmetadata', updateDuration);
            audio.addEventListener('canplay', updateDuration);
            audio.addEventListener('durationchange', updateDuration);

            playPauseBtn.addEventListener('click', () => {
                if (audio.paused) {
                    audio.play().then(() => {
                        if (playIcon) playIcon.style.display = 'none';
                        if (pauseIcon) pauseIcon.style.display = 'block';
                    }).catch(() => {});
                } else {
                    audio.pause();
                    if (playIcon) playIcon.style.display = 'block';
                    if (pauseIcon) pauseIcon.style.display = 'none';
                }
            });

            audio.addEventListener('timeupdate', () => {
                if (progressBar) progressBar.value = Math.floor(audio.currentTime);
                if (currentTimeEl) currentTimeEl.textContent = formatTime(audio.currentTime);
                if (totalTimeEl && audio.duration) {
                    const remaining = audio.duration - audio.currentTime;
                    totalTimeEl.textContent = `-${formatTime(remaining)}`;
                }
            });

            if (progressBar) {
                progressBar.addEventListener('input', () => {
                    audio.currentTime = progressBar.value;
                });
            }
        }
    } catch (e) {
        console.warn('Audio player warning:', e);
    }

    // --- 4. Masterclass Video Reset ---
    try {
        const masterVideo = document.getElementById('masterclass-video');
        if (masterVideo) {
            masterVideo.addEventListener('ended', () => {
                masterVideo.load();
            });
        }
    } catch (e) {}

    // --- 5. Calculadora Metabólica Interactiva ---
    try {
        const weightInput = document.getElementById('calc-weight');
        const ageInput = document.getElementById('calc-age');
        const weightVal = document.getElementById('weight-val');
        const ageVal = document.getElementById('age-val');

        const resTomas = document.getElementById('res-tomas');
        const resTomasDesc = document.getElementById('res-tomas-desc');
        const resDuracion = document.getElementById('res-duracion');
        const resDuracionDesc = document.getElementById('res-duracion-desc');
        const resFormato = document.getElementById('res-formato');
        const tipTitle = document.getElementById('tip-title');
        const tipDesc = document.getElementById('tip-desc');

        const recPackTitle = document.getElementById('rec-pack-title');
        const recPackPrice = document.getElementById('rec-pack-price');
        const recSavings = document.getElementById('rec-savings');
        const calcBuyBtn = document.getElementById('calc-buy-btn');
        const calcWaBtn = document.getElementById('calc-wa-btn');

        if (weightInput && ageInput) {
            const savedId = localStorage.getItem('orygn_dist_id');
            const cookieMatch = document.cookie.match(new RegExp('(?:^|; )sponsor=([^;]+)'));
            const activeSponsor = (savedId && savedId !== 'default' && savedId !== 'index.html') ? savedId : (cookieMatch ? cookieMatch[1] : null);

            let promoterShopUrl = (calcBuyBtn && calcBuyBtn.getAttribute('href') && calcBuyBtn.getAttribute('href') !== '#') 
                ? calcBuyBtn.getAttribute('href') 
                : "https://iorngoldman.orygn.co/product";

            if (activeSponsor && activeSponsor !== 'default') {
                promoterShopUrl = `https://${activeSponsor}.orygn.co/product`;
            }

            const waFloat = document.querySelector('.whatsapp-float');
            let promoterPhone = "34655404502";
            let promoterNombre = "José";
            const promotorNombreEl = document.querySelector('.promotor-nombre');
            if (promotorNombreEl && promotorNombreEl.textContent.trim()) {
                promoterNombre = promotorNombreEl.textContent.trim();
            }
            if (waFloat && waFloat.href) {
                const phoneMatch = waFloat.href.match(/phone=([0-9+]+)/);
                if (phoneMatch) promoterPhone = phoneMatch[1].replace('+', '');
            }

            function calculatePlan() {
                const objectiveRadio = document.querySelector('input[name="calc-objective"]:checked');
                const isResultados = objectiveRadio ? (objectiveRadio.value !== 'mantenimiento') : true;
                const formatRadio = document.querySelector('input[name="calc-format"]:checked');
                const selectedFormat = formatRadio ? formatRadio.value : 'duo';

                const weight = parseInt(weightInput.value) || 75;
                const age = parseInt(ageInput.value) || 40;

                if (weightVal) weightVal.textContent = weight;
                if (ageVal) ageVal.textContent = age;

                let planName = "";
                let formatText = "";

                if (selectedFormat === 'duo') {
                    formatText = "Protocolo Dúo Sinergia (Gotas + IGNYT)";
                } else if (selectedFormat === 'gotas') {
                    formatText = isResultados ? "Pack 2 Botellas triGLP (Gotas)" : "1 Botella triGLP (Gotas)";
                } else {
                    formatText = isResultados ? "Pack 2 Cajas IGNYT (Sobres)" : "1 Caja IGNYT (Sobres)";
                }

                if (resFormato) resFormato.textContent = formatText;

                if (isResultados) {
                    if (resTomas) resTomas.textContent = "2 tomas al día";
                    if (resTomasDesc) resTomasDesc.textContent = "Mañana en ayunas + Tarde";
                    if (resDuracion) resDuracion.textContent = "36 días completos";
                    if (resDuracionDesc) resDuracionDesc.textContent = "Tratamiento intensivo";

                    planName = (selectedFormat === 'duo') 
                        ? "Pack de 2 (Dúo triGLP + IGNYT) — Máximo Ahorro" 
                        : `Pack de 2 (${selectedFormat === 'gotas' ? '2 Botellas triGLP' : '2 Cajas IGNYT'}) — Máximo Ahorro`;

                    if (recPackTitle) recPackTitle.textContent = planName;
                    if (recPackPrice) recPackPrice.innerHTML = `128,40 € / $139.95 USD <span class="tax-note">(+ gastos de envío e impuestos)</span>`;
                    
                    if (recSavings) {
                        recSavings.style.display = 'inline-block';
                        recSavings.textContent = `Ahorras 27,60 € / $29.95 USD (~18%)`;
                    }

                    if (tipTitle && tipDesc) {
                        if (weight >= 85 || age >= 45) {
                            tipTitle.textContent = "Perfil Metabólico: Apoyo Doble Sincronizado";
                            tipDesc.textContent = "Recomendado 2 tomas diarias para activar saciedad y optimizar la combustión lipídica sin pérdida muscular.";
                        } else {
                            tipTitle.textContent = "Perfil Metabólico: Pérdida Activa y Control";
                            tipDesc.textContent = "Recomendado protocolo de 2 tomas al día durante 6 a 8 semanas para consolidar el control del apetito.";
                        }
                    }
                } else {
                    if (resTomas) resTomas.textContent = "1 toma al día";
                    if (resTomasDesc) resTomasDesc.textContent = "Mañana en ayunas";
                    if (resDuracion) resDuracion.textContent = "36 días completos";
                    if (resDuracionDesc) resDuracionDesc.textContent = "Mantenimiento diario";

                    planName = (selectedFormat === 'duo')
                        ? "1 Botella triGLP o 1 Caja IGNYT"
                        : (selectedFormat === 'gotas' ? "1 Botella triGLP (Gotas)" : "1 Caja IGNYT (Sobres)");

                    if (recPackTitle) recPackTitle.textContent = planName;
                    if (recPackPrice) recPackPrice.innerHTML = `78,00 € / $84.95 USD <span class="tax-note">(+ gastos de envío e impuestos)</span>`;
                    
                    if (recSavings) {
                        recSavings.style.display = 'none';
                    }

                    if (tipTitle && tipDesc) {
                        tipTitle.textContent = "Perfil Metabólico: Bienestar y Longevidad";
                        tipDesc.textContent = "1 sola toma diaria en ayunas para sostener el equilibrio hormonal, la energía celular y la salud intestinal.";
                    }
                }

                if (calcBuyBtn) {
                    calcBuyBtn.href = promoterShopUrl;
                }

                if (calcWaBtn) {
                    const objetivoStr = isResultados ? "Pérdida de Peso Activa" : "Mantenimiento / Bienestar";
                    const priceStr = isResultados ? "128,40 € / $139.95 USD" : "78,00 € / $84.95 USD";
                    const waMessage = `Hola ${promoterNombre}, he calculado mi plan en la web: peso ${weight} kg, edad ${age} años, objetivo: ${objetivoStr}, formato preferido: ${formatText}. Mi plan sugerido es ${planName} (${priceStr} + gastos de envío e impuestos). ¿Me ayudas a pedirlo con la garantía oficial de 28 días?`;
                    calcWaBtn.href = `https://api.whatsapp.com/send?phone=${promoterPhone}&text=${encodeURIComponent(waMessage)}`;
                }
            }

            weightInput.addEventListener('input', calculatePlan);
            weightInput.addEventListener('change', calculatePlan);
            ageInput.addEventListener('input', calculatePlan);
            ageInput.addEventListener('change', calculatePlan);

            document.querySelectorAll('input[name="calc-objective"]').forEach(radio => {
                radio.addEventListener('change', calculatePlan);
                radio.addEventListener('click', calculatePlan);
            });
            document.querySelectorAll('input[name="calc-format"]').forEach(radio => {
                radio.addEventListener('change', calculatePlan);
                radio.addEventListener('click', calculatePlan);
            });

            // Soporte táctil / clic en las etiquetas
            document.querySelectorAll('.segmented-control label').forEach(lbl => {
                lbl.addEventListener('click', () => {
                    setTimeout(calculatePlan, 50);
                });
            });

            // Ejecutar inicialmente
            calculatePlan();
        }
    } catch (e) {
        console.error('Calculator error:', e);
    }

    // --- 6. Menú Móvil ---
    try {
        const menuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        if (menuBtn && navMenu) {
            menuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
            });
            navMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                });
            });
        }
    } catch (e) {}

    // --- 7. Social Proof FOMO Popups ---
    try {
        const fomoNames = [
            { name: "Marta S. (Sevilla, España)", time: "hace 4 min", pack: "Pack Dúo triGLP + IGNYT (128,40 € / $139.95 USD)" },
            { name: "Carlos R. (Madrid, España)", time: "hace 7 min", pack: "Pack de 2 Gotas triGLP (128,40 € / $139.95 USD)" },
            { name: "Laura M. (Valencia, España)", time: "hace 11 min", pack: "1 Botella triGLP (78,00 € / $84.95 USD)" },
            { name: "Javier T. (Barcelona, España)", time: "hace 2 min", pack: "Pack Dúo triGLP + IGNYT (128,40 € / $139.95 USD)" },
            { name: "Ana P. (Bilbao, España)", time: "hace 9 min", pack: "Sobres IGNYT Booster (78,00 € / $84.95 USD)" }
        ];

        const fomoNotification = document.getElementById('fomo-notification');
        if (fomoNotification) {
            const fomoNameEl = document.getElementById('fomo-name');
            const fomoTimeEl = document.getElementById('fomo-time');
            const fomoPackEl = document.getElementById('fomo-pack');

            function showFOMO() {
                if (!fomoNameEl || !fomoTimeEl || !fomoPackEl) return;
                const randomFomo = fomoNames[Math.floor(Math.random() * fomoNames.length)];
                fomoNameEl.textContent = randomFomo.name;
                fomoTimeEl.textContent = randomFomo.time;
                fomoPackEl.textContent = randomFomo.pack;

                fomoNotification.classList.add('show');
                setTimeout(() => {
                    fomoNotification.classList.remove('show');
                }, 5000);
            }

            setTimeout(() => {
                showFOMO();
                setInterval(showFOMO, 25000);
            }, 12000);
        }
    } catch (e) {}

    // --- 8. Exit Intent Modal (Ultra-Receptivo) ---
    try {
        let exitModalTriggered = false;
        const exitModal = document.getElementById('exit-modal');

        if (exitModal) {
            function triggerExitModal(e) {
                if (exitModalTriggered) return;
                if ((e.clientY <= 20) || (!e.relatedTarget && !e.toElement)) {
                    exitModal.classList.add('show');
                    exitModalTriggered = true;
                }
            }

            document.addEventListener('mouseleave', triggerExitModal);
            document.addEventListener('mouseout', (e) => {
                if (!e.relatedTarget && !e.toElement && e.clientY <= 20) {
                    triggerExitModal(e);
                }
            });

            exitModal.addEventListener('click', (e) => {
                if (e.target === exitModal) {
                    exitModal.classList.remove('show');
                }
            });

            window.closeExitModal = function() {
                exitModal.classList.remove('show');
            };
        }
    } catch (e) {}

    // --- 9. FAQ Accordion Handler Seguro ---
    try {
        const faqItems = document.querySelectorAll('.faq-item');
        faqItems.forEach(item => {
            const header = item.querySelector('.faq-question, h4, .faq-header-trigger') || item;
            header.style.cursor = 'pointer';
            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    } catch (e) {}

    // --- 10. Cookie Banner ---
    try {
        const cookieBanner = document.getElementById('cookie-banner');
        const acceptCookiesBtn = document.getElementById('accept-cookies');
        if (cookieBanner && acceptCookiesBtn) {
            if (!localStorage.getItem('cookiesAccepted')) {
                setTimeout(() => {
                    cookieBanner.classList.add('show');
                }, 1500);
            }
            acceptCookiesBtn.addEventListener('click', () => {
                localStorage.setItem('cookiesAccepted', 'true');
                cookieBanner.classList.remove('show');
            });
        }
    } catch (e) {}

}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
