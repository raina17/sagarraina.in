document.addEventListener('DOMContentLoaded', () => {

    const runWhenIdle = (callback) => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(callback, { timeout: 1500 });
        } else {
            setTimeout(callback, 300);
        }
    };

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (anchorLinks.length > 0) {
        anchorLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const targetElement = document.querySelector(this.getAttribute('href'));
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // --- INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS ---
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
    if (elementsToAnimate.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        elementsToAnimate.forEach((el) => observer.observe(el));
    }

    // --- LIGHTWEIGHT YOUTUBE EMBEDS ---
    const videoEmbeds = document.querySelectorAll('.video-embed');
    if (videoEmbeds.length > 0) {
        videoEmbeds.forEach((embed) => {
            const button = embed.querySelector('.video-embed__button');
            if (!button) return;

            button.addEventListener('click', () => {
                const videoId = embed.getAttribute('data-video-id');
                const title = embed.getAttribute('data-video-title') || 'YouTube video player';
                if (!videoId) return;

                const iframe = document.createElement('iframe');
                iframe.setAttribute('width', '560');
                iframe.setAttribute('height', '315');
                iframe.setAttribute('title', title);
                iframe.setAttribute('frameborder', '0');
                iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share');
                iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
                iframe.setAttribute('allowfullscreen', '');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;

                embed.innerHTML = '';
                embed.appendChild(iframe);
            }, { once: true });
        });
    }


    // --- SWIPER.JS INITIALIZATION SCRIPT ---
    runWhenIdle(() => {
        if (typeof Swiper !== 'undefined') {
            const swiper = new Swiper('.swiper', {
                slidesPerView: 'auto',
                spaceBetween: 20,
                loop: true,
                freeMode: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                speed: 5000,
            });
        }
    });


    // --- PARTICLE.JS CONFIGURATIONS AND INITIALIZATION ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const shouldSkipParticles = prefersReducedMotion || saveData;

    runWhenIdle(() => {
        if (shouldSkipParticles) {
            return;
        }

        if (typeof particlesJS !== 'undefined') {
        
        // Config for Hero, Performances, and Contact sections
        const mainParticlesConfig = { particles: { number: { value: 80, density: { enable: true, value_area: 800 } }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.5, random: false }, size: { value: 3, random: true }, line_linked: { enable: true, distance: 150, color: "#ffffff", opacity: 0.4, width: 1 }, move: { enable: true, speed: 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 4 }, remove: { particles_nb: 2 } } }, retina_detect: true };
        
        // Config for About Me and Services sections
        const subtleParticlesConfig = { particles: { number: { value: 60, density: { enable: true, value_area: 800 } }, color: { value: ["#FFFFFF", "#00F2EA", "#6F42C1"] }, shape: { type: "star", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } }, opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, size: { value: 4, random: true, anim: { enable: false } }, line_linked: { enable: false }, move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "bubble" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { bubble: { distance: 250, size: 8, duration: 2, opacity: 0.8 }, push: { particles_nb: 4 } } }, retina_detect: true };
        
        // Load all the particle animations
            if (document.getElementById('hero-particles')) {
                particlesJS('hero-particles', mainParticlesConfig);
            }
            if (document.getElementById('about-particles')) {
                particlesJS('about-particles', subtleParticlesConfig);
            }
            if (document.getElementById('portfolio-particles')) {
                particlesJS('portfolio-particles', mainParticlesConfig);
            }
            if (document.getElementById('services-particles')) {
                particlesJS('services-particles', subtleParticlesConfig);
            }
            if (document.getElementById('contact-particles')) {
                particlesJS('contact-particles', mainParticlesConfig);
            }
        } else {
            console.error('particles.js library not loaded.');
        }
    });

});
