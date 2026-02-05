/* ============================================
   ADEM PORTFOLIO - MAIN.JS
   Animations | Particles | Interactions
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initTypingEffect();
    initScrollAnimations();
    initSmoothScroll();
});

/* ----- Particle Background ----- */
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    // Resize canvas to fill window
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.3 + 0.1;
            // 10% chance of being accent colored
            this.isAccent = Math.random() < 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            
            if (this.isAccent) {
                ctx.fillStyle = `rgba(100, 181, 246, ${this.opacity * 1.5})`;
            } else {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
            }
            
            ctx.fill();
        }
    }

    // Line class for geometric shapes
    class Line {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.length = Math.random() * 100 + 50;
            this.angle = Math.random() * Math.PI * 2;
            this.speedAngle = (Math.random() - 0.5) * 0.005;
            this.opacity = Math.random() * 0.1 + 0.05;
            this.speedY = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.angle += this.speedAngle;
            this.y += this.speedY;

            if (this.y < -100) this.y = canvas.height + 100;
            if (this.y > canvas.height + 100) this.y = -100;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            
            const gradient = ctx.createLinearGradient(-this.length / 2, 0, this.length / 2, 0);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(-this.length / 2, 0);
            ctx.lineTo(this.length / 2, 0);
            ctx.stroke();
            
            ctx.restore();
        }
    }

    // Initialize particles
    function createParticles() {
        particles = [];
        
        // Create particles - adjust count based on screen size
        const particleCount = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        
        // Create lines
        const lineCount = Math.min(15, Math.floor(canvas.width / 100));
        for (let i = 0; i < lineCount; i++) {
            particles.push(new Line());
        }
    }

    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }

    // Handle resize
    function handleResize() {
        resizeCanvas();
        createParticles();
    }

    // Initialize
    resizeCanvas();
    createParticles();
    animate();

    // Debounced resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleResize, 200);
    });

    // Pause animation when tab is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ----- Typing Effect ----- */
function initTypingEffect() {
    const heroName = document.querySelector('.hero-name');
    if (!heroName) return;

    const text = heroName.dataset.text || heroName.textContent.replace('|', '');
    const typingSpeed = 150;
    let charIndex = 0;

    // Clear the text initially
    heroName.innerHTML = '<span class="cursor">|</span>';

    function typeChar() {
        if (charIndex < text.length) {
            const currentText = text.substring(0, charIndex + 1);
            heroName.innerHTML = currentText + '<span class="cursor">|</span>';
            charIndex++;
            setTimeout(typeChar, typingSpeed);
        } else {
            // Typing complete - show tagline and social icons
            heroName.innerHTML = text + '<span class="cursor">|</span>';
            showHeroElements();
        }
    }

    function showHeroElements() {
        const tagline = document.querySelector('.hero-tagline');
        const socialIcons = document.querySelector('.hero-section .social-icons');
        
        if (tagline) {
            setTimeout(() => tagline.classList.add('visible'), 200);
        }
        
        if (socialIcons) {
            setTimeout(() => socialIcons.classList.add('visible'), 500);
        }
    }

    // Start typing after a short delay
    setTimeout(typeChar, 500);
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
    // Elements to animate
    const revealElements = document.querySelectorAll('.reveal');
    const projectCategories = document.querySelectorAll('.project-category');

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    // Observer for general reveal animations
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optionally unobserve after animation
                // revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // Observer for project categories (staggered card animation)
    const categoryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate cards within the category
                const cards = entry.target.querySelectorAll('.project-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, 100 + (index * 50));
                });
            }
        });
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    });

    projectCategories.forEach(category => categoryObserver.observe(category));
}

/* ----- Smooth Scroll ----- */
function initSmoothScroll() {
    // Handle all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ----- Horizontal Scroll Enhancement ----- */
// This is automatically handled by CSS overflow-x: auto
// But we can add touch swipe support for better mobile UX

document.querySelectorAll('.projects-row').forEach(row => {
    let isDown = false;
    let startX;
    let scrollLeft;

    row.addEventListener('mousedown', (e) => {
        isDown = true;
        row.style.cursor = 'grabbing';
        startX = e.pageX - row.offsetLeft;
        scrollLeft = row.scrollLeft;
    });

    row.addEventListener('mouseleave', () => {
        isDown = false;
        row.style.cursor = 'grab';
    });

    row.addEventListener('mouseup', () => {
        isDown = false;
        row.style.cursor = 'grab';
    });

    row.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - row.offsetLeft;
        const walk = (x - startX) * 2;
        row.scrollLeft = scrollLeft - walk;
    });

    // Set initial cursor
    row.style.cursor = 'grab';
});

/* ----- Optional: Scroll Progress Indicator ----- */
function updateScrollProgress() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (!scrollIndicator) return;

    const scrollTop = window.pageYOffset;
    
    // Hide scroll indicator after scrolling down
    if (scrollTop > 100) {
        scrollIndicator.style.opacity = '0';
    } else {
        scrollIndicator.style.opacity = '1';
    }
}

window.addEventListener('scroll', () => {
    updateScrollProgress();
}, { passive: true });

/* ----- Utility: Debounce Function ----- */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* ----- Handle reduced motion preference ----- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0ms');
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}
