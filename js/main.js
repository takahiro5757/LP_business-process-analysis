// Main JavaScript for DX診断サービス LP

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Header scroll effect
    initHeaderScrollEffect();
    
    // Intersection Observer for animations
    initScrollAnimations();
    
    // Mobile menu toggle
    initMobileMenu();
    
    // Dashboard animation
    initDashboardAnimation();
    
    // Statistics counter animation
    initStatsCounter();
    
    // Enhanced scroll effects
    initEnhancedScrollEffects();
    
    // Data particles
    initDataParticles();
    
    // Parallax effects
    initParallaxEffects();
    
    // Count up animations
    initCountUpAnimations();
});

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Header scroll effect
function initHeaderScrollEffect() {
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.problem-card, .step-card, .reason-card, .deliverable-card, .case-study, .flow-item');
    const imageElements = document.querySelectorAll('.problems-image, .service-image, .why-image, .deliverables-image, .company-image');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                imageObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    imageElements.forEach(element => {
        imageObserver.observe(element);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    // Add mobile menu button if not exists and on mobile
    function addMobileMenuButton() {
        if (window.innerWidth <= 1023 && !document.querySelector('.mobile-menu-btn')) {
            const menuBtn = document.createElement('button');
            menuBtn.className = 'mobile-menu-btn';
            menuBtn.innerHTML = '<span></span><span></span><span></span>';
            menuBtn.setAttribute('aria-label', 'メニューを開く');
            
            const headerContent = document.querySelector('.header-content');
            headerContent.appendChild(menuBtn);
            
            const nav = document.querySelector('.nav');
            
            menuBtn.addEventListener('click', function() {
                const isActive = nav.classList.contains('active');
                nav.classList.toggle('active');
                menuBtn.classList.toggle('active');
                document.body.classList.toggle('menu-open');
                
                // Update aria-label
                menuBtn.setAttribute('aria-label', isActive ? 'メニューを開く' : 'メニューを閉じる');
            });
            
            // Close menu when clicking on links
            const navLinks = document.querySelectorAll('.nav a');
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    nav.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuBtn.setAttribute('aria-label', 'メニューを開く');
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!header.contains(e.target) && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    menuBtn.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    menuBtn.setAttribute('aria-label', 'メニューを開く');
                }
            });
        } else if (window.innerWidth > 1023) {
            // Remove mobile menu button on desktop
            const menuBtn = document.querySelector('.mobile-menu-btn');
            if (menuBtn) {
                menuBtn.remove();
            }
            const nav = document.querySelector('.nav');
            nav.classList.remove('active');
            document.body.classList.remove('menu-open');
        }
    }
    
    const header = document.querySelector('.header');
    addMobileMenuButton();
    
    // Handle window resize
    window.addEventListener('resize', addMobileMenuButton);
}

// Dashboard animation in hero section
function initDashboardAnimation() {
    const dashboardMetrics = document.querySelectorAll('.dashboard-metric');
    
    const dashboardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = Array.from(dashboardMetrics).indexOf(entry.target) * 200;
                setTimeout(() => {
                    entry.target.style.transform = 'translateX(0)';
                    entry.target.style.opacity = '1';
                }, delay);
                dashboardObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    dashboardMetrics.forEach(metric => {
        metric.style.transform = 'translateX(-20px)';
        metric.style.opacity = '0';
        metric.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.6s ease';
        dashboardObserver.observe(metric);
    });
}

// Statistics counter animation
function initStatsCounter() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

function animateCounter(element) {
    const target = element.textContent;
    const isPercentage = target.includes('%');
    const number = parseInt(target.replace(/[^\d]/g, ''));
    let current = 0;
    const increment = number / 50; // Animation duration control
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            current = number;
            clearInterval(timer);
        }
        
        element.textContent = Math.floor(current) + (isPercentage ? '%' : '');
    }, 20);
}

// Lazy loading for images (if any are added later)
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Scroll to top functionality
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.innerHTML = '↑';
    scrollBtn.setAttribute('aria-label', 'ページトップへ戻る');
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top button
document.addEventListener('DOMContentLoaded', function() {
    initScrollToTop();
});

// Parallax effect for hero section
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Performance optimization: throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(function() {
    // Scroll event handlers here
}, 16)); // ~60fps

// Accessibility improvements
function initAccessibility() {
    // Keyboard navigation for custom elements
    const customButtons = document.querySelectorAll('.radio-label, .checkbox-label');
    customButtons.forEach(label => {
        label.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const input = this.querySelector('input');
                if (input) {
                    input.click();
                }
            }
        });
        label.setAttribute('tabindex', '0');
    });
}

// Initialize accessibility features
document.addEventListener('DOMContentLoaded', initAccessibility);

// Error handling for all async operations
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// Service Worker registration for caching (if needed)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Register service worker here if needed
    });
}

// Analytics tracking (placeholder)
function trackEvent(eventName, eventData) {
    // Analytics implementation would go here
    console.log('Event:', eventName, eventData);
}

// Track CTA clicks
document.addEventListener('click', function(e) {
    if (e.target.matches('.btn-primary')) {
        trackEvent('cta_click', {
            button_text: e.target.textContent,
            section: e.target.closest('section')?.className || 'unknown'
        });
    }
});

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\-\(\)\+\s]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 10;
}

// ===== ENHANCED SCROLL EFFECTS =====

// Enhanced scroll effects initialization
function initEnhancedScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    // Stagger animation observer
    const staggerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * 200);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Fade slide observer
    const fadeSlideObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                fadeSlideObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Scale pop observer
    const scalePopObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                scalePopObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply observers
    document.querySelectorAll('.stagger-container').forEach(container => {
        staggerObserver.observe(container);
    });

    document.querySelectorAll('.fade-slide-left, .fade-slide-right').forEach(element => {
        fadeSlideObserver.observe(element);
    });

    document.querySelectorAll('.scale-pop, .rotate-fade').forEach(element => {
        scalePopObserver.observe(element);
    });
}

// Data particles animation
function initDataParticles() {
    const particlesContainer = document.getElementById('dataParticles');
    if (!particlesContainer) return;

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random horizontal position
        const xPos = Math.random() * 100;
        particle.style.left = xPos + '%';
        
        // Random drift distance
        const drift = (Math.random() - 0.5) * 200;
        particle.style.setProperty('--particle-drift', drift + 'px');
        
        // Random delay
        const delay = Math.random() * 5;
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 8000 + delay * 1000);
    }

    // Create particles periodically
    setInterval(createParticle, 800);
    
    // Create initial particles
    for (let i = 0; i < 10; i++) {
        setTimeout(createParticle, i * 300);
    }
}

// Enhanced parallax effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + scrolled;
            const elementHeight = rect.height;
            const windowHeight = window.innerHeight;
            
            // Only apply parallax when element is in viewport
            if (rect.top < windowHeight && rect.bottom > 0) {
                const rate = (scrolled - elementTop + windowHeight) / (windowHeight + elementHeight);
                const yPos = rate * 50; // Adjust multiplier for intensity
                element.style.transform = `translateY(${yPos}px)`;
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Count up animations
function initCountUpAnimations() {
    const countElements = document.querySelectorAll('.count-up[data-target]');
    
    const countObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCountUp(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    countElements.forEach(element => {
        countObserver.observe(element);
    });
}

function animateCountUp(element) {
    const target = parseInt(element.dataset.target);
    const suffix = element.textContent.includes('%') ? '%' : '';
    let current = 0;
    const increment = target / 60; // 60 frames for 1 second at 60fps
    
    function updateCount() {
        current += increment;
        if (current >= target) {
            current = target;
            element.textContent = Math.round(current) + suffix;
            return;
        }
        element.textContent = Math.round(current) + suffix;
        requestAnimationFrame(updateCount);
    }
    
    updateCount();
}

// Success particles for results section
function initSuccessParticles() {
    const successContainer = document.getElementById('successParticles');
    if (!successContainer) return;
    
    function createSuccessParticle() {
        const particle = document.createElement('div');
        particle.className = 'success-particle';
        
        const xPos = Math.random() * 100;
        const yPos = Math.random() * 100;
        particle.style.left = xPos + '%';
        particle.style.top = yPos + '%';
        
        successContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 1000);
    }
    
    // Trigger success particles when results section is viewed
    const resultsSection = document.querySelector('.results');
    if (resultsSection) {
        const resultsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    for (let i = 0; i < 20; i++) {
                        setTimeout(() => createSuccessParticle(), i * 100);
                    }
                    resultsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        resultsObserver.observe(resultsSection);
    }
}

// Progress bar animations for service section
function initProgressBarAnimations() {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    const progressObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressFill = entry.target.querySelector('.progress-fill');
                if (progressFill) {
                    progressFill.style.animationPlayState = 'running';
                }
                progressObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        const progressFill = bar.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.animationPlayState = 'paused';
        }
        progressObserver.observe(bar);
    });
}

// Mouse tracking for enhanced interactivity
function initMouseTracking() {
    const enhancedElements = document.querySelectorAll('.enhanced-hover');
    
    enhancedElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            this.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// Mobile detection and optimization
function isMobile() {
    return window.innerWidth <= 768;
}

function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

// Mobile-optimized data particles
function initMobileOptimizedParticles() {
    if (!isMobile()) {
        return initDataParticles(); // Use full version on desktop
    }

    const particlesContainer = document.getElementById('dataParticles');
    if (!particlesContainer) return;

    function createMobileParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const xPos = Math.random() * 100;
        particle.style.left = xPos + '%';
        
        const drift = (Math.random() - 0.5) * 100; // Reduced drift
        particle.style.setProperty('--particle-drift', drift + 'px');
        
        const delay = Math.random() * 3; // Shorter delay
        particle.style.animationDelay = delay + 's';
        
        particlesContainer.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.parentNode.removeChild(particle);
            }
        }, 6000 + delay * 1000); // Shorter lifetime
    }

    // Reduced frequency for mobile
    setInterval(createMobileParticle, 1500);
    
    // Fewer initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createMobileParticle, i * 500);
    }
}

// Mobile-optimized parallax
function initMobileOptimizedParallax() {
    if (isMobile()) {
        // Disable parallax on mobile for performance
        return;
    }
    
    return initParallaxEffects();
}

// Touch-optimized hover effects
function initTouchOptimizedEffects() {
    if (!isTouchDevice()) {
        return initMouseTracking(); // Use mouse tracking on desktop
    }

    // Simple tap effects for touch devices
    const enhancedElements = document.querySelectorAll('.enhanced-hover');
    
    enhancedElements.forEach(element => {
        element.addEventListener('touchstart', function(e) {
            this.style.transform = 'translateY(-3px) scale(1.02)';
            this.style.transition = 'transform 0.1s ease';
        });
        
        element.addEventListener('touchend', function(e) {
            setTimeout(() => {
                this.style.transform = '';
                this.style.transition = '';
            }, 150);
        });
    });
}

// Mobile-optimized stagger animations
function initMobileOptimizedStagger() {
    const observerOptions = {
        threshold: isMobile() ? 0.05 : 0.1, // Lower threshold for mobile
        rootMargin: isMobile() ? '0px 0px -20px 0px' : '0px 0px -50px 0px'
    };

    const staggerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const staggerItems = entry.target.querySelectorAll('.stagger-item');
                const delay = isMobile() ? 100 : 200; // Faster on mobile
                
                staggerItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('animate');
                    }, index * delay);
                });
                staggerObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.stagger-container').forEach(container => {
        staggerObserver.observe(container);
    });
}

// Performance monitoring for mobile
function initPerformanceOptimization() {
    if (!isMobile()) return;

    // Reduce animation frequency on slow devices
    const isSlowDevice = navigator.hardwareConcurrency <= 2 || 
                        navigator.deviceMemory <= 2;
    
    if (isSlowDevice) {
        // Disable heavy animations
        const style = document.createElement('style');
        style.textContent = `
            .data-particles,
            .success-particles-container,
            .parallax-element {
                display: none !important;
            }
            .enhanced-hover:hover {
                transform: none !important;
            }
            .typewriter {
                animation: none !important;
                border-right: none !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// iOS Safari specific optimizations
function initIOSOptimizations() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    
    if (isIOS) {
        // Fix viewport height issues
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', () => {
            setTimeout(setVH, 100);
        });

        // Prevent zoom on input focus
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('focusin', function() {
                if (input.style.fontSize !== '16px') {
                    input.style.fontSize = '16px';
                }
            });
        });

        // Smooth scrolling fix for iOS
        document.body.style.webkitOverflowScrolling = 'touch';
    }
}

// Initialize additional effects with mobile optimization
document.addEventListener('DOMContentLoaded', function() {
    initSuccessParticles();
    initProgressBarAnimations();
    
    // Mobile-optimized initializations
    initPerformanceOptimization();
    initIOSOptimizations();
    initTouchOptimizedEffects();
    initMobileOptimizedStagger();
    
    // Override original functions with mobile-optimized versions
    if (isMobile()) {
        initMobileOptimizedParticles();
        initMobileOptimizedParallax();
    } else {
        initMouseTracking();
    }
});

// Expose useful functions globally
window.DXDiagnosisLP = {
    trackEvent,
    validateEmail,
    validatePhone,
    initEnhancedScrollEffects,
    initDataParticles,
    initParallaxEffects
};