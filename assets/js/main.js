// ========================================
// CYBERSECURITY AWARENESS WEEK - main.js
// التحكم العام + الرسوم المتحركة + LocalStorage
// مدرسة صلالة الشرقية للتعليم الأساسي 2026
// ========================================

class CyberSite {
    constructor() {
        this.init();
        this.particlesCount = 60;
        this.isMobileMenuOpen = false;
    }

    // 🚀 التهيئة الرئيسية
    init() {
        this.initNavigation();
        this.initParticles();
        this.initScrollEffects();
        this.initAnimations();
        this.loadSavedData();
        this.initPWA();
        this.preloader();
        
        console.log('🚀 CyberSite محمل بنجاح!');
        console.log('🛡️ جرب: Password Checker + Quiz + LocalStorage');
    }

    // 📱 التنقل (Navigation)
    initNavigation() {
        // Mobile Menu Toggle
        const mobileBtn = document.querySelector('#mobileMenuBtn, .mobile-menu-btn');
        const mobileMenu = document.querySelector('#mobileMenu, .mobile-menu');
        
        if (mobileBtn && mobileMenu) {
            mobileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
            
            // Close on outside click
            document.addEventListener('click', () => {
                if (this.isMobileMenuOpen) {
                    this.closeMobileMenu();
                }
            });
        }

        // Smooth Scrolling لكل الروابط
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                
                if (target) {
                    target.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start' 
                    });
                    this.closeMobileMenu(); // إغلاق القائمة
                }
            });
        });

        // Active Nav Link
        window.addEventListener('scroll', () => {
            this.updateActiveNav();
        });
    }

    toggleMobileMenu() {
        const mobileMenu = document.querySelector('#mobileMenu, .mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            this.isMobileMenuOpen = !this.isMobileMenuOpen;
        }
    }

    closeMobileMenu() {
        const mobileMenu = document.querySelector('#mobileMenu, .mobile-menu');
        if (mobileMenu && this.isMobileMenuOpen) {
            mobileMenu.classList.add('hidden');
            mobileMenu.classList.remove('active');
            this.isMobileMenuOpen = false;
        }
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('nav a[href^="#"]');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ✨ نظام الجسيمات المتحركة
    initParticles() {
        const particlesContainer = document.getElementById('particles') || 
                                  document.querySelector('.floating-particles');
        
        if (particlesContainer) {
            this.createParticles(particlesContainer, this.particlesCount);
        }
    }

    createParticles(container, count) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // مواقع عشوائية
            particle.style.left = Math.random() * 100 + '%';
            particle.style.top = Math.random() * 100 + '%';
            particle.style.width = Math.random() * 6 + 2 + 'px';
            particle.style.height = particle.style.width;
            
            // تأخير وسرعة عشوائية
            particle.style.animationDelay = Math.random() * 10 + 's';
            particle.style.animationDuration = (Math.random() * 5 + 8) + 's';
            
            // لون عشوائي من Neon palette
            const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            particle.style.background = `radial-gradient(circle, ${color}80 0%, transparent 70%)`;
            
            container.appendChild(particle);
        }
    }

    // 🎬 تأثيرات التمرير
    initScrollEffects() {
        // Navbar background
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const navbar = document.querySelector('nav');
            
            // Navbar شفافة/معتمدة
            if (scrolled > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }

            // Parallax للـ Hero Character
            const heroChar = document.querySelector('.hero-character, .cyber-guide');
            if (heroChar) {
                heroChar.style.transform = `translateY(${scrolled * 0.4}px)`;
            }

            // Reveal animations
            this.revealOnScroll();
        });
    }

    revealOnScroll() {
        const reveals = document.querySelectorAll('.animate-on-scroll, .cyber-card');
        reveals.forEach((el, index) => {
            const windowHeight = window.innerHeight;
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;

            if (elementTop < windowHeight - elementVisible) {
                el.classList.add('animate__animated', 'animate__fadeInUp');
                el.style.animationDelay = `${index * 0.1}s`;
            }
        });
    }

    // ⚡ نظام الرسوم المتحركة المتقدم
    initAnimations() {
        // Intersection Observer للعناصر
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate__animated', 'animate__fadeInUp');
                }
            });
        }, observerOptions);

        // مراقبة كل العناصر المتحركة
        document.querySelectorAll('.animate-fadeInUp, .cyber-card, section').forEach(el => {
            observer.observe(el);
        });

        // Mouse Tilt للبطاقات 3D
        document.querySelectorAll('.cyber-card[data-tilt]').forEach(card => {
            this.initTiltEffect(card);
        });
    }

    initTiltEffect(card) {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }

    // 💾 LocalStorage Manager
    loadSavedData() {
        // أفضل نتيجة اختبار
        const bestScore = localStorage.getItem('bestQuizScore');
        const bestScoreEl = document.querySelector('.best-quiz-score');
        if (bestScore && bestScoreEl) {
            bestScoreEl.textContent = `${bestScore}/100`;
            bestScoreEl.classList.add('animate__animated', 'animate__pulse');
        }

        // أفضل كلمة مرور
        const bestPassword = localStorage.getItem('bestPassword');
        if (bestPassword) {
            const data = JSON.parse(bestPassword);
            console.log('🏆 أفضل كلمة مرور:', data.password, `(${data.strength * 100}%)`);
        }

        // سجل الاختبارات
        const quizHistory = JSON.parse(localStorage.getItem('quizResults') || '[]');
        if (quizHistory.length > 0) {
            console.log('📊 آخر الاختبارات:', quizHistory.slice(0, 3));
        }
    }

    // 📱 PWA Support
    initPWA() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('PWA Service Worker جاهز'))
                .catch(err => console.log('PWA غير مدعوم'));
        }

        // Install prompt
        let deferredPrompt;
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            
            // Show install button
            const installBtn = document.querySelector('.install-pwa');
            if (installBtn) {
                installBtn.classList.remove('hidden');
                installBtn.addEventListener('click', () => {
                    deferredPrompt.prompt();
                });
            }
        });
    }

    // ⏳ Preloader
    preloader() {
        const preloader = document.querySelector('.preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                preloader.style.opacity = '0';
                setTimeout(() => {
                    preloader.style.display = 'none';
                    document.body.classList.add('loaded');
                }, 500);
            });
        }
    }

    // 🎯 Copy to Clipboard Utility
    copyToClipboard(text, successMsg = 'تم النسخ!') {
        navigator.clipboard.writeText(text).then(() => {
            // Feedback
            const feedback = document.createElement('div');
            feedback.textContent = successMsg;
            feedback.className = 'fixed top-4 right-4 bg-neon-emerald text-white px-6 py-3 rounded-2xl shadow-2xl neon-glow-emerald z-50 animate-fadeInUp';
            document.body.appendChild(feedback);
            
            setTimeout(() => {
                feedback.remove();
            }, 3000);
        });
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Typing Effect
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Counter Animation
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function update() {
        start += increment;
        if (start < target) {
            element.textContent = Math.ceil(start);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    update();
}

// Random Neon Color
function getNeonColor() {
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// ========================================
// INITIALIZE ON LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    window.cyberSite = new CyberSite();
    
    // Global event listeners
    document.addEventListener('copy', (e) => {
        console.log('📋 تم نسخ:', e.clipboardData.getData('text'));
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'p': // Ctrl+P = Print certificate
                    e.preventDefault();
                    window.print();
                    break;
            }
        }
    });
});

// ========================================
// SERVICE WORKER (PWA - اختياري)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
}

// ========================================
// DEBUG MODE (F12 Console)
// ========================================
console.log(`
🛡️ CYBERSITE LOADED ✅

📱 Mobile Menu: Active
✨ Particles: ${window.cyberSite?.particlesCount}
🎬 Animations: IntersectionObserver
💾 LocalStorage: Ready
📱 PWA: Supported

🎯 جرب:
- Password Checker (LocalStorage)
- Cyber Quiz (Certificate PNG)
- Share buttons (Social)
`);
