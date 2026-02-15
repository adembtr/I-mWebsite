/* ============================================
   5G ROAD SAFETY PROJECT PAGE - JAVASCRIPT
   Animations | Interactions | Pipeline Diagram
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initHeroCanvas();
    initScrollAnimations();
    initPipelineAnimation();
    
    initCodeTabs();
    initCopyButtons();
    initStatCounters();
});

/* ----- Hero Canvas Background ----- */
function initHeroCanvas() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let connections = [];
    let animationId;
    
    function resize() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        createNetwork();
    }
    
    class Node {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.radius = Math.random() * 2 + 1;
            this.pulsePhase = Math.random() * Math.PI * 2;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            
            this.pulsePhase += 0.02;
        }
        
        draw() {
            const pulse = Math.sin(this.pulsePhase) * 0.5 + 0.5;
            const radius = this.radius + pulse;
            
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(218, 165, 32, ${0.3 + pulse * 0.3})`;
            ctx.fill();
        }
    }
    
    function createNetwork() {
        nodes = [];
        connections = [];
        
        const nodeCount = Math.floor((canvas.width * canvas.height) / 20000);
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push(new Node(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            ));
        }
    }
    
    function drawConnections() {
        const maxDistance = 150;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const dx = nodes[i].x - nodes[j].x;
                const dy = nodes[i].y - nodes[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < maxDistance) {
                    const opacity = (1 - distance / maxDistance) * 0.2;
                    ctx.beginPath();
                    ctx.moveTo(nodes[i].x, nodes[i].y);
                    ctx.lineTo(nodes[j].x, nodes[j].y);
                    ctx.strokeStyle = `rgba(218, 165, 32, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawConnections();
        
        nodes.forEach(node => {
            node.update();
            node.draw();
        });
        
        animationId = requestAnimationFrame(animate);
    }
    
    resize();
    animate();
    
    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        resize();
        animate();
    });
    
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            cancelAnimationFrame(animationId);
        } else {
            animate();
        }
    });
}

/* ----- Scroll Animations ----- */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');
    const learnedCards = document.querySelectorAll('.learned-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    revealElements.forEach(el => observer.observe(el));
    
    // Staggered animation for learned cards
    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    learnedCards.forEach(card => cardObserver.observe(card));
}

/* ----- Pipeline Animation ----- */
function initPipelineAnimation() {
    const pipelines = document.querySelectorAll('.pipeline');
    
    pipelines.forEach(pipeline => {
        const arrows = pipeline.querySelectorAll('.step-arrow');
        
        arrows.forEach((arrow, index) => {
            // Create animated particle
            const particle = document.createElement('div');
            particle.className = 'data-particle';
            particle.style.animationDelay = `${index * 0.5}s`;
            arrow.querySelector('.arrow-line').appendChild(particle);
        });
    });
    
    // Animate steps on hover
    const steps = document.querySelectorAll('.step-box');
    steps.forEach(step => {
        step.addEventListener('mouseenter', () => {
            step.classList.add('active');
        });
        
        step.addEventListener('mouseleave', () => {
            step.classList.remove('active');
        });
    });
}

/* ----- Chunking Demo ----- */
/* ----- Code Tabs ----- */
function initCodeTabs() {
    const tabs = document.querySelectorAll('.code-tab');
    const blocks = document.querySelectorAll('.code-block');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            
            // Update tabs
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update blocks
            blocks.forEach(block => {
                block.classList.remove('active');
                if (block.id === target) {
                    block.classList.add('active');
                }
            });
        });
    });
}

/* ----- Copy Buttons ----- */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('.copy-btn');
    
    copyBtns.forEach(btn => {
        btn.addEventListener('click', async () => {
            const codeBlock = btn.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                btn.classList.add('copied');
                btn.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Copied!
                `;
                
                setTimeout(() => {
                    btn.classList.remove('copied');
                    btn.innerHTML = `
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                        Copy
                    `;
                }, 2000);
            } catch (err) {
                console.error('Failed to copy:', err);
            }
        });
    });
}

/* ----- Stat Counters ----- */
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.dataset.value);
                const suffix = target.dataset.suffix || '';
                
                animateCounter(target, finalValue, suffix);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target, suffix) {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function (ease out cubic)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (target - start) * easeOut);
        element.textContent = current + suffix;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

/* ----- Smooth Scroll ----- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const target = document.querySelector(targetId);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ----- Reduced Motion Support ----- */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--transition-normal', '0ms');
    document.documentElement.style.setProperty('--transition-slow', '0ms');
}