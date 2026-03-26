/**
 * أسبوع الوعي بالأمن السيبراني
 * JavaScript الرئيسي - وظائف تفاعلية كاملة
 */

class CybersecurityApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTheme();
        this.initPreloader();
        this.initScrollAnimations();
        this.initNavbar();
        this.initStatsCounter();
        this.initBackToTop();
        this.updateActiveNav();
    }

    bindEvents() {
        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        
        // Mobile nav toggle
        document.getElementById('navToggle')?.addEventListener('click', () => this.toggleMobileNav());
        
        // Nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                this.closeMobileNav();
                this.setActiveNav(link);
            });
        });

        // Smooth scroll for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    initPreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    preloader.classList.add('hidden');
                }, 1000);
            });
        }
    }

    toggleTheme() {
        const body = document.body;
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update icon
        const themeToggle = document.getElementById('themeToggle');
        const icon = themeToggle.querySelector('i');
        icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }

    loadTheme() {
        const savedTheme = localStorage    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.body.setAttribute('data-theme', savedTheme);
        
        // Update icon
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            icon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    toggleMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        navMenu.classList.toggle('active');
        navToggle.querySelector('i').classList.toggle('fa-bars');
        navToggle.querySelector('i').classList.toggle('fa-times');
    }

    closeMobileNav() {
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        navMenu.classList.remove('active');
        navToggle.querySelector('i').classList.add('fa-bars');
        navToggle.querySelector('i').classList.remove('fa-times');
    }

    setActiveNav(activeLink) {
        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    updateActiveNav() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link[data-page]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const activeSection = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.toggle('active', link.getAttribute('data-page') === activeSection);
                    });
                }
            });
        }, { threshold: 0.3, rootMargin: '-20% 0px -20% 0px' });

        sections.forEach(section => observer.observe(section));
    }

    initNavbar() {
        const header = document.getElementById('header');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScrollY = currentScrollY;
        });
    }

    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    
                    // Trigger slide animations for child elements
                    const slideElements = entry.target.querySelectorAll('.animate-slide');
                    slideElements.forEach((el, index) => {
                        setTimeout(() => el.classList.add('animate'), index * 200);
                    });
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal, .animate-slide').forEach(el => observer.observe(el));
    }

    initStatsCounter() {
        const counters = document.querySelectorAll('.stat-number[data-target]');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'));
                    const increment = target / 100;
                    let current = 0;

                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.floor(current) + '+';
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + '+';
                        }
                    };
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    initBackToTop() {
        const btn = document.getElementById('backToTop');
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                btn.classList.add('show');
            } else {
                btn.classList.remove('show');
            }
        });

        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CybersecurityApp();
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('SW registered'))
            .catch(err => console.log('SW registration failed'));
    });
}
