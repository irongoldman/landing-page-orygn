/* Reemplazar scripts o agregar nuevo en assets/js/scripts.js */
document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Animations Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-left, .reveal-right');
    revealElements.forEach(el => observer.observe(el));

    // --- Audio Player Controls ---
    const audio = document.getElementById('podcast-audio');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.querySelector('.play-icon');
    const pauseIcon = document.querySelector('.pause-icon');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');

    if(audio && playPauseBtn) {
        function formatTime(seconds) {
            const min = Math.floor(seconds / 60);
            const sec = Math.floor(seconds % 60);
            return `${min}:${sec < 10 ? '0' : ''}${sec}`;
        }

        audio.addEventListener('loadedmetadata', () => {
            totalTimeEl.textContent = formatTime(audio.duration);
            progressBar.max = Math.floor(audio.duration);
        });

        playPauseBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        });

        audio.addEventListener('timeupdate', () => {
            progressBar.value = Math.floor(audio.currentTime);
            currentTimeEl.textContent = formatTime(audio.currentTime);
            
            const remaining = audio.duration - audio.currentTime;
            totalTimeEl.textContent = `-${formatTime(remaining)}`;
        });

        progressBar.addEventListener('input', () => {
            audio.currentTime = progressBar.value;
        });
    }

    // --- Video Audio Control ---
    const video = document.getElementById('promo-video');
    const unmuteBtn = document.getElementById('unmute-btn');
    const videoOverlay = document.getElementById('video-end-overlay');

    if(video) {
        // Autoplay programmatically (avoids HTML attribute lint)
        video.play().catch(() => { /* Browser may block autoplay; fail silently */ });
        if(unmuteBtn) {
            let hasStartedListening = false;
            unmuteBtn.addEventListener('click', () => {
                if (video.muted) {
                    // First time: restart from beginning; after that: resume
                    if (!hasStartedListening) {
                        video.currentTime = 0;
                        hasStartedListening = true;
                    }
                    video.muted = false;
                    video.play();
                    unmuteBtn.innerHTML = '<span class="icon">🔇</span> Silenciar';
                } else {
                    // Mute: pause the video
                    video.muted = true;
                    video.pause();
                    unmuteBtn.innerHTML = '<span class="icon">🔊</span> Haz clic para escuchar';
                }
            });
        }

        video.addEventListener('ended', () => {
            if (videoOverlay) {
                videoOverlay.style.display = 'flex';
                if(unmuteBtn) unmuteBtn.style.display = 'none';
            }
        });
    }

    // --- Masterclass Video End Logic ---
    const masterVideo = document.getElementById('masterclass-video');
    if (masterVideo) {
        masterVideo.addEventListener('ended', () => {
            masterVideo.load(); // Reset to poster
        });
    }

    // --- Year for Footer ---
    const yearEl = document.getElementById('current-year');
    if(yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // --- Cookie Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookiesBtn = document.getElementById('accept-cookies');
    
    if (cookieBanner && acceptCookiesBtn) {
        if (!localStorage.getItem('cookiesAccepted')) {
            setTimeout(() => {
                cookieBanner.classList.add('show');
            }, 1000);
        }
        
        acceptCookiesBtn.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieBanner.classList.remove('show');
        });
    }

    // --- Fuente Única de Verdad de Precios ---
    window.ORYGN_PRICING = {
        singleEur: 92.15,
        pack2Eur: 151.81,
        savingsEur: 32.49,
        discountPct: 18
    };

    // --- Calculadora Metabólica Interactiva ---
    const objResultados = document.getElementById('obj-resultados');
    const objMantenimiento = document.getElementById('obj-mantenimiento');
    const weightInput = document.getElementById('calc-weight');
    const ageInput = document.getElementById('calc-age');
    const weightVal = document.getElementById('weight-val');
    const ageVal = document.getElementById('age-val');

    const resTomas = document.getElementById('res-tomas');
    const resTomasDesc = document.getElementById('res-tomas-desc');
    const resDuracion = document.getElementById('res-duracion');
    const recPackTitle = document.getElementById('rec-pack-title');
    const recPackDesc = document.getElementById('rec-pack-desc');
    const recPackPrice = document.getElementById('rec-pack-price');
    const calcBuyBtn = document.getElementById('calc-buy-btn');
    const calcWaBtn = document.getElementById('calc-wa-btn');
    const recSavings = document.getElementById('rec-savings');

    if(weightInput && ageInput) {
        // Obtener datos del promotor activo
        const savedId = localStorage.getItem('orygn_dist_id');
        var cookieMatch = document.cookie.match(new RegExp('(?:^|; )sponsor=([^;]+)'));
        var activeSponsor = (savedId && savedId !== 'default' && savedId !== 'index.html') ? savedId : (cookieMatch ? cookieMatch[1] : null);

        let promoterShopUrl = (calcBuyBtn && calcBuyBtn.getAttribute('href') && calcBuyBtn.getAttribute('href') !== '#') 
            ? calcBuyBtn.getAttribute('href') 
            : null;

        if (activeSponsor && activeSponsor !== 'default' && (!promoterShopUrl || promoterShopUrl.includes('iorngoldman.orygn.co'))) {
            promoterShopUrl = `https://${activeSponsor}.orygn.co/`;
        } else if (!promoterShopUrl) {
            promoterShopUrl = "https://iorngoldman.orygn.co/";
        }

        // Obtener teléfono de WhatsApp del promotor si está en el DOM
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
            const isResultados = document.querySelector('input[name="calc-objective"]:checked').value === 'resultados';
            const weight = parseInt(weightInput.value);
            const age = parseInt(ageInput.value);

            weightVal.textContent = weight;
            ageVal.textContent = age;

            let planName = "";
            let planDesc = "";

            if (isResultados) {
                resTomas.textContent = "2 tomas al día";
                resTomasDesc.textContent = "Repartido en mañana y tarde";
                resDuracion.textContent = "18 a 36 días";
                
                if (weight > 90 || age > 45) {
                    planName = "Pack de 2 (Dúo triGLP + IGNYT o 2 Botellas) - Plan Recomendado";
                    planDesc = "Cubre 36 días completos. Recomendado especialmente para metabolismos que requieren un apoyo más constante y sinérgico.";
                } else {
                    planName = "Pack de 2 (Dúo triGLP + IGNYT o 2 Botellas)";
                    planDesc = "Cubre 36 días completos. Ideal para alcanzar los primeros resultados metabólicos visibles de 6 a 8 semanas.";
                }
                recPackTitle.textContent = planName;
                recPackDesc.textContent = planDesc;
                recPackPrice.textContent = `${window.ORYGN_PRICING.pack2Eur.toFixed(2).replace('.', ',')} € (+ envío e impuestos)`;
                if (calcBuyBtn) {
                    calcBuyBtn.href = promoterShopUrl;
                    calcBuyBtn.textContent = "Comprar Pack de 2 en Tienda Oficial";
                }
                if(recSavings) {
                    recSavings.style.display = 'block';
                    recSavings.textContent = `🔥 Ahorra ${window.ORYGN_PRICING.savingsEur.toFixed(2).replace('.', ',')} € (~${window.ORYGN_PRICING.discountPct}%) con respecto a la compra individual`;
                }
            } else {
                resTomas.textContent = "1 toma al día";
                resTomasDesc.textContent = "En una sola toma (por la mañana o tarde)";
                resDuracion.textContent = "36 días";
                
                planName = "1 Botella Individual o 1 Paquete IGNYT";
                if (age > 50) {
                    planDesc = "Cubre 36 días completos. Excelente para mantenimiento y vitalidad diaria en la madurez metabólica.";
                } else {
                    planDesc = "Cubre 36 días completos. Diseñado para mantener de forma duradera tus resultados y tu bienestar.";
                }
                recPackTitle.textContent = planName;
                recPackDesc.textContent = planDesc;
                recPackPrice.textContent = `${window.ORYGN_PRICING.singleEur.toFixed(2).replace('.', ',')} € (+ envío e impuestos)`;
                if (calcBuyBtn) {
                    calcBuyBtn.href = promoterShopUrl;
                    calcBuyBtn.textContent = "Comprar 1 Botella / Paquete en Tienda Oficial";
                }
                if(recSavings) recSavings.style.display = 'none';
            }

            // Actualizar botón de WhatsApp interactivo
            if (calcWaBtn) {
                const objetivoStr = isResultados ? "Pérdida de Peso Activa" : "Mantenimiento / Bienestar";
                const waMessage = `Hola ${promoterNombre}, he calculado mi plan en la web: peso ${weight} kg, edad ${age} años, objetivo: ${objetivoStr}. Mi plan sugerido es ${planName}. ¿Me ayudas a pedirlo con la garantía oficial de 28 días?`;
                calcWaBtn.href = `https://api.whatsapp.com/send?phone=${promoterPhone}&text=${encodeURIComponent(waMessage)}`;
            }
        }

        weightInput.addEventListener('input', calculatePlan);
        ageInput.addEventListener('input', calculatePlan);
        document.querySelectorAll('input[name="calc-objective"]').forEach(radio => {
            radio.addEventListener('change', calculatePlan);
        });

        // Ejecutar inicialmente
        calculatePlan();
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    if(menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
});

// =========================================================
// CRO & CONVERSION OPTIMIZATIONS
// =========================================================

document.addEventListener('DOMContentLoaded', function() {
    // 1. Social Proof FOMO Notifications con datos territoriales y packs reales
    const fomoNames = [
        { name: "Marta S. (Sevilla, España)", time: "hace 4 min", pack: "Pack Dúo triGLP + IGNYT (151,81 €)" },
        { name: "Carlos R. (Madrid, España)", time: "hace 7 min", pack: "Pack de 2 Gotas triGLP (151,81 €)" },
        { name: "Laura M. (Valencia, España)", time: "hace 11 min", pack: "1 Botella triGLP (92,15 €)" },
        { name: "Javier T. (Barcelona, España)", time: "hace 2 min", pack: "Pack Dúo triGLP + IGNYT (151,81 €)" },
        { name: "Ana P. (Bilbao, España)", time: "hace 9 min", pack: "Sobres IGNYT Booster (92,15 €)" },
        { name: "David L. (Málaga, España)", time: "hace 15 min", pack: "Pack de 2 Gotas triGLP (151,81 €)" },
        { name: "Elena S. (Zaragoza, España)", time: "hace 6 min", pack: "Pack Dúo triGLP + IGNYT (151,81 €)" },
        { name: "Sergio V. (Alicante, España)", time: "hace 13 min", pack: "1 Botella triGLP (92,15 €)" },
        { name: "Paula N. (Murcia, España)", time: "hace 8 min", pack: "Pack Dúo triGLP + IGNYT (151,81 €)" },
        { name: "Antonio W. (Granada, España)", time: "hace 18 min", pack: "Pack de 2 Gotas triGLP (151,81 €)" }
    ];
    
    const fomoNotification = document.getElementById('fomo-notification');
    if (fomoNotification) {
        const fomoNameEl = document.getElementById('fomo-name');
        const fomoTimeEl = document.getElementById('fomo-time');
        const fomoPackEl = document.getElementById('fomo-pack');
        
        function showFOMO() {
            const randomFomo = fomoNames[Math.floor(Math.random() * fomoNames.length)];
            fomoNameEl.textContent = randomFomo.name;
            fomoTimeEl.textContent = randomFomo.time;
            fomoPackEl.textContent = randomFomo.pack;
            
            fomoNotification.classList.add('show');
            
            setTimeout(() => {
                fomoNotification.classList.remove('show');
            }, 5000); // Show for 5 seconds
        }

        // Trigger first notification after 15 seconds, then randomly every 20-35 seconds
        setTimeout(() => {
            showFOMO();
            setInterval(showFOMO, Math.floor(Math.random() * 15000) + 20000);
        }, 15000);
    }

    // 2. Exit Intent Modal
    let exitModalTriggered = false;
    const exitModal = document.getElementById('exit-modal');

    document.addEventListener('mouseleave', (e) => {
        // Only trigger if mouse leaves through the top of the viewport
        if (e.clientY < 0 && !exitModalTriggered && exitModal) {
            exitModal.classList.add('show');
            exitModalTriggered = true;
        }
    });

    // Make closeExitModal available globally
    window.closeExitModal = function() {
        if (exitModal) {
            exitModal.classList.remove('show');
        }
    };

    // 3. Tab System for Studies Explorer & Pathways
    const studyTabBtns = document.querySelectorAll('.study-tab-btn');
    const studyCards = document.querySelectorAll('.study-card-item');

    if (studyTabBtns.length > 0) {
        studyTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                studyTabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');
                studyCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        card.classList.add('is-visible');
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // 4. Interactive Metabolic Simulator
    const simSlider = document.getElementById('sim-weeks-slider');
    const simWeeksVal = document.getElementById('sim-weeks-val');
    const simBmiVal = document.getElementById('sim-bmi-val');
    const simFatVal = document.getElementById('sim-fat-val');
    const simEnergyVal = document.getElementById('sim-energy-val');
    const simIl6Val = document.getElementById('sim-il6-val');
    const simHmoxVal = document.getElementById('sim-hmox-val');

    if (simSlider && simWeeksVal) {
        function updateSimulator() {
            const weeks = parseInt(simSlider.value);
            simWeeksVal.textContent = weeks;

            let bmi, fat, energy, il6, hmox;
            if (weeks <= 2) {
                bmi = "-2.5%";
                fat = "-3.0%";
                energy = "+35%";
                il6 = "-5.0%";
                hmox = "+150%";
            } else if (weeks <= 6) {
                bmi = "-6.0%";
                fat = "-7.5%";
                energy = "+65%";
                il6 = "-15.0%";
                hmox = "+320%";
            } else if (weeks <= 8) {
                bmi = "-7.0%";
                fat = "-10.0%";
                energy = "+85%";
                il6 = "-18.5%";
                hmox = "+420%";
            } else {
                bmi = "-9.5%";
                fat = "-13.5%";
                energy = "+95%";
                il6 = "-22.0%";
                hmox = "+420%";
            }

            if (simBmiVal) simBmiVal.textContent = bmi;
            if (simFatVal) simFatVal.textContent = fat;
            if (simEnergyVal) simEnergyVal.textContent = energy;
            if (simIl6Val) simIl6Val.textContent = il6;
            if (simHmoxVal) simHmoxVal.textContent = hmox;
        }

        simSlider.addEventListener('input', updateSimulator);
        updateSimulator();
    }

    // 5. FAQ Accordion Handler
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(i => i.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }
});

// 6. Dynamic Top Bar Promoter Update
(function updateTopBarPromotor() {
    const promotorMap = {
        'default': 'José',
        'iorngoldman': 'José',
        'gotasdesalud': 'Joaquin',
        'agbnetwork': 'Felix',
        'marce': 'Marcelino',
        'raulct': 'Raul',
        'etc313': 'Esther',
        'elilete': 'Eli',
        'marga': 'Marga'
    };
    
    document.addEventListener('DOMContentLoaded', () => {
        const pathParts = window.location.pathname.split('/').filter(p => p !== "");
        const internalPaths = ['estudios', 'negocio', 'testimonios', 'presentacion', 'privacidad', 'aviso-legal', 'sitemap', 'faq', 'seguimiento', 'gracias', 'admin', 'assets'];
        
        let distId = null;
        if (pathParts.length > 0 && !pathParts[0].includes('.html') && !internalPaths.includes(pathParts[0])) {
            distId = pathParts[0];
        } else {
            distId = localStorage.getItem('orygn_dist_id');
        }
        
        if (distId && promotorMap[distId]) {
            document.querySelectorAll('.promotor-nombre').forEach(el => {
                el.textContent = promotorMap[distId];
            });
        }
    });
})();

