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
});
