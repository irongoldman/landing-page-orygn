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
    const recSavings = document.getElementById('rec-savings');

    if(weightInput && ageInput) {
        function calculatePlan() {
            const isResultados = document.querySelector('input[name="calc-objective"]:checked').value === 'resultados';
            const weight = parseInt(weightInput.value);
            const age = parseInt(ageInput.value);

            weightVal.textContent = weight;
            ageVal.textContent = age;

            if (isResultados) {
                resTomas.textContent = "2 tomas al día";
                resTomasDesc.textContent = "Repartido en mañana y tarde";
                resDuracion.textContent = "18 días";
                
                // Si pesa más de 90kg o es mayor de 45 años, damos un consejo dinámico
                if (weight > 90 || age > 45) {
                    recPackTitle.textContent = "Pack de 2 Botellas (18 mL) - Plan Recomendado";
                    recPackDesc.textContent = "Cubre 36 días completos. Recomendado especialmente para metabolismos que requieren un apoyo más constante y sostenido.";
                } else {
                    recPackTitle.textContent = "Pack de 2 Botellas (18 mL)";
                    recPackDesc.textContent = "Cubre 36 días completos. Ideal para alcanzar los primeros resultados clínicos visibles de 6 a 8 semanas.";
                }
                recPackPrice.textContent = "113,60€ / $129,95";
                calcBuyBtn.href = "https://iorngoldman.orygn.co/";
                calcBuyBtn.textContent = "Pedir Pack de 2 Botellas";
                if(recSavings) recSavings.style.display = 'block';
            } else {
                resTomas.textContent = "1 toma al día";
                resTomasDesc.textContent = "En una sola toma (por la mañana)";
                resDuracion.textContent = "36 días";
                
                recPackTitle.textContent = "1 Botella Individual (9 mL)";
                if (age > 50) {
                    recPackDesc.textContent = "Cubre 36 días completos. Excelente para mantenimiento y vitalidad diaria en la madurez metabólica.";
                } else {
                    recPackDesc.textContent = "Cubre 36 días completos. Diseñado para mantener de forma duradera tus resultados y tu bienestar.";
                }
                recPackPrice.textContent = "64€ / $75";
                calcBuyBtn.href = "https://iorngoldman.orygn.co/";
                calcBuyBtn.textContent = "Pedir 1 Botella de Mantenimiento";
                if(recSavings) recSavings.style.display = 'none';
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
    // 1. Social Proof FOMO Notifications
    const fomoNames = [
        { name: "Mar�a C. (Madrid)", time: "hace 2 min", pack: "Pack de 2 Botellas" },
        { name: "Carlos R. (Barcelona)", time: "hace 5 min", pack: "1 Botella Individual" },
        { name: "Laura M. (Valencia)", time: "hace 12 min", pack: "Pack de 2 Botellas" },
        { name: "Javier T. (Sevilla)", time: "hace 1 min", pack: "Pack de 2 Botellas" },
        { name: "Ana P. (M�laga)", time: "hace 8 min", pack: "1 Botella Individual" },
        { name: "Luis F. (Bilbao)", time: "hace 15 min", pack: "Pack de 2 Botellas" },
        { name: "Carmen G. (Zaragoza)", time: "hace 3 min", pack: "1 Botella Individual" }
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
});
