document.addEventListener('DOMContentLoaded', () => {

    const runWhenIdle = (callback) => {
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(callback, { timeout: 1500 });
        } else {
            setTimeout(callback, 300);
        }
    };

    const loadScript = (src) => new Promise((resolve, reject) => {
        const existing = document.querySelector(`script[src="${src}"]`);
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', reject);
            if (existing.getAttribute('data-loaded') === 'true') {
                resolve();
            }
            return;
        }
        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.onload = () => {
            script.setAttribute('data-loaded', 'true');
            resolve();
        };
        script.onerror = reject;
        document.body.appendChild(script);
    });

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

    // --- COUNTER ANIMATION FOR STATS ---
    const statNumbers = document.querySelectorAll('.stat-number');
    if (statNumbers.length > 0) {
        const animateCounter = (element) => {
            const target = parseInt(element.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;
            
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    element.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target;
                }
            };
            
            updateCounter();
        };

        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.5
        });

        statNumbers.forEach((stat) => statsObserver.observe(stat));
    }


    // --- SWIPER.JS INITIALIZATION SCRIPT ---
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    // Enable Swiper on mobile, but respect reduced motion and save data
    const shouldSkipSwiper = prefersReducedMotion || saveData;

    if (!shouldSkipSwiper && document.querySelector('.swiper')) {
        // Delay Swiper initialization slightly to prioritize critical content
        const initSwiper = () => {
            loadScript('https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js')
                .then(() => {
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
                            speed: isMobile ? 3000 : 5000, // Faster on mobile for better UX
                            lazy: {
                                loadPrevNext: true,
                                loadPrevNextAmount: 2
                            }
                        });
                    }
                })
                .catch(() => {
                    console.warn('Swiper failed to load.');
                });
        };
        
        // Initialize after a small delay to prioritize hero section
        setTimeout(() => runWhenIdle(initSwiper), 1000);
    }


    // --- PARTICLE.JS CONFIGURATIONS AND INITIALIZATION ---
    // Enable particles on mobile, but respect reduced motion and save data preferences
    const particlesPrefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particlesSaveData = navigator.connection && navigator.connection.saveData;
    const shouldSkipParticles = particlesPrefersReducedMotion || particlesSaveData;

    if (!shouldSkipParticles) {
        // Delay particles even more to prioritize main content
        const initParticles = () => {
            loadScript('https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js')
                .then(() => {
                    if (typeof particlesJS !== 'undefined') {
        
        // Config for Hero, Performances, and Contact sections
        const isMobileDevice = window.matchMedia('(max-width: 768px)').matches;
        const mainParticlesConfig = { particles: { number: { value: isMobileDevice ? 30 : 80, density: { enable: true, value_area: 800 } }, color: { value: "#ffffff" }, shape: { type: "circle" }, opacity: { value: 0.5, random: false }, size: { value: 3, random: true }, line_linked: { enable: true, distance: isMobileDevice ? 100 : 150, color: "#ffffff", opacity: 0.4, width: 1 }, move: { enable: true, speed: isMobileDevice ? 3 : 6, direction: "none", random: false, straight: false, out_mode: "out", bounce: false } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: !isMobileDevice, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { grab: { distance: 400, line_linked: { opacity: 1 } }, bubble: { distance: 400, size: 40, duration: 2, opacity: 8, speed: 3 }, repulse: { distance: 200, duration: 0.4 }, push: { particles_nb: 2 }, remove: { particles_nb: 2 } } }, retina_detect: true };
        
        // Config for About Me and Services sections
        const subtleParticlesConfig = { particles: { number: { value: isMobileDevice ? 20 : 60, density: { enable: true, value_area: 800 } }, color: { value: ["#FFFFFF", "#00F2EA", "#6F42C1"] }, shape: { type: "star", stroke: { width: 0, color: "#000000" }, polygon: { nb_sides: 5 } }, opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } }, size: { value: 4, random: true, anim: { enable: false } }, line_linked: { enable: false }, move: { enable: true, speed: isMobileDevice ? 1 : 2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false } }, interactivity: { detect_on: "canvas", events: { onhover: { enable: !isMobileDevice, mode: "bubble" }, onclick: { enable: true, mode: "push" }, resize: true }, modes: { bubble: { distance: 250, size: 8, duration: 2, opacity: 0.8 }, push: { particles_nb: 2 } } }, retina_detect: true };
        
        // Load all the particle animations
                        if (document.getElementById('hero-particles')) {
                            particlesJS('hero-particles', mainParticlesConfig);
                        }
                        if (document.getElementById('about-particles')) {
                            particlesJS('about-particles', subtleParticlesConfig);
                        }
                        if (document.getElementById('stats-particles')) {
                            particlesJS('stats-particles', mainParticlesConfig);
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
                        if (document.getElementById('faq-particles')) {
                            particlesJS('faq-particles', subtleParticlesConfig);
                        }
                        if (document.getElementById('testimonials-particles')) {
                            particlesJS('testimonials-particles', mainParticlesConfig);
                        }
                    } else {
                        console.error('particles.js library not loaded.');
                    }
                })
                .catch(() => {
                    console.warn('particles.js failed to load.');
                });
        };
        
        // Initialize particles after hero is loaded and user has interacted or 2 seconds passed
        let particlesInitialized = false;
        const startParticles = () => {
            if (!particlesInitialized) {
                particlesInitialized = true;
                runWhenIdle(initParticles);
            }
        };
        
        setTimeout(startParticles, 2000);
        ['scroll', 'click', 'touchstart'].forEach(event => {
            window.addEventListener(event, startParticles, { once: true });
        });
    }

    // --- FAQ ACCORDION FUNCTIONALITY ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => {
                    // Close other items
                    const wasActive = item.classList.contains('active');
                    faqItems.forEach(otherItem => {
                        otherItem.classList.remove('active');
                    });
                    // Toggle current item
                    if (!wasActive) {
                        item.classList.add('active');
                    }
                });
            }
        });
    }

});
