// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('section');
const navbar = document.querySelector('.navbar');

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeScrollEffects();
    initializeMobileMenu();
    initializeProjectFilters();
    initializeSocialCards();
    initializePlatformIcons();
});

// Mobile Menu Toggle
function initializeMobileMenu() {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Animate hamburger bars
        const bars = hamburger.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            bar.style.transform = hamburger.classList.contains('active') 
                ? `rotate(${index === 0 ? 45 : index === 2 ? -45 : 0}deg) translateY(${index === 0 ? 6 : index === 2 ? -6 : 0}px)`
                : 'none';
            if (index === 1) {
                bar.style.opacity = hamburger.classList.contains('active') ? '0' : '1';
            }
        });
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Reset hamburger animation
            const bars = hamburger.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            });
        });
    });
}

// Smooth Scrolling for Navigation Links
function initializeScrollEffects() {
    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(10, 25, 47, 0.98)';
        } else {
            navbar.style.background = 'rgba(10, 25, 47, 0.95)';
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
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
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.about-card, .project-card, .social-card').forEach(el => {
        el.classList.add('loading');
        observer.observe(el);
    });
}

// Project Filters
function initializeProjectFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            projectCards.forEach(card => {
                const categories = card.getAttribute('data-category');
                
                if (filter === 'all' || categories.includes(filter)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease-out';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
}

function initializeAnimations() {
    // Parallax effect for hero section - fixed
    let ticking = false;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        const heroContent = document.querySelector('.hero-content');
        const heroVisual = document.querySelector('.hero-visual');
        
        if (hero && scrolled <= hero.offsetHeight) {
            // Apply parallax only when hero is visible
            requestAnimationFrame(() => {
                if (heroContent) {
                    heroContent.style.transform = `translateY(${scrolled * 0.2}px)`;
                }
                if (heroVisual) {
                    heroVisual.style.transform = `translateY(${scrolled * -0.1}px)`;
                }
                // Subtle background movement
                hero.style.backgroundPosition = `center ${scrolled * 0.1}px`;
            });
        }
        ticking = false;
    }
    
    function requestParallax() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestParallax);

    // Typing animation for hero elements
    const heroName = document.querySelector('.hero-name-main');
    const nameGreeting = document.querySelector('.name-greeting');
    const nameTitle = document.querySelector('.name-title');
    const subtitleLines = document.querySelectorAll('.subtitle-line');
    
    if (heroName) {
        // Add typing effect to name
        const nameText = heroName.textContent;
        heroName.textContent = '';
        let i = 0;
        
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (i < nameText.length) {
                    heroName.textContent += nameText.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 100);
        }, 600);
    }
    
    if (subtitleLines) {
        subtitleLines.forEach((line, index) => {
            line.style.animationDelay = `${0.8 + index * 0.2}s`;
        });
    }

    // Floating animation for game icons
    const gameIcons = document.querySelectorAll('.icon-item');
    gameIcons.forEach((icon, index) => {
        icon.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.2) rotate(10deg)';
        });
        
        icon.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Gentle floating animation
        let animationId;
        function floatIcon() {
            let start = null;
            function animate(timestamp) {
                if (!start) start = timestamp;
                const progress = timestamp - start;
                
                const y = Math.sin(progress * 0.001 + index) * 5;
                const x = Math.cos(progress * 0.0008 + index) * 3;
                
                icon.style.transform = `translate(${x}px, ${y}px)`;
                
                animationId = requestAnimationFrame(animate);
            }
            animationId = requestAnimationFrame(animate);
        }
        
        // Start floating animation with delay
        setTimeout(() => {
            floatIcon();
        }, index * 200);
    });
}

// Social Cards Interaction
function initializeSocialCards() {
    const socialCards = document.querySelectorAll('.social-card');
    
    socialCards.forEach(card => {
        const icon = card.querySelector('.social-icon');
        
        card.addEventListener('mouseenter', () => {
            icon.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', () => {
            icon.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Add click animation
        card.addEventListener('click', (e) => {
            // Create ripple effect
            const rect = card.getBoundingClientRect();
            const ripple = document.createElement('div');
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: ripple 0.6s linear;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                pointer-events: none;
                z-index: 1;
            `;
            
            card.style.position = 'relative';
            card.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'var(--gradient-secondary)' : 'var(--gradient-primary)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Project Card Hover Effects
document.querySelectorAll('.project-card').forEach(card => {
    const image = card.querySelector('.project-image img');
    
    card.addEventListener('mouseenter', () => {
        if (image) {
            image.style.transform = 'scale(1.1)';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        if (image) {
            image.style.transform = 'scale(1)';
        }
    });
});

// Loading Animation for Page Load
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate elements with delay
    const animatedElements = document.querySelectorAll('.loading');
    animatedElements.forEach((el, index) => {
        setTimeout(() => {
            el.classList.add('loaded');
        }, index * 100);
    });
});

// Performance optimization: Throttle scroll events
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

// Apply throttling to scroll events for better performance
const throttledScroll = throttle(() => {
    // Navbar background and active link updates are handled in initializeScrollEffects
}, 16); // ~60fps

window.addEventListener('scroll', throttledScroll);

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu if open
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Accessibility improvements
document.querySelectorAll('button, .btn, .filter-btn').forEach(button => {
    button.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            button.click();
        }
    });
});

// Console Easter Egg
console.log(`
╔══════════════════════════════════════╗
║        Game Developer Portfolio      ║
║                                      ║
║     Создано с любовью к играм! 🎮    ║
║                                      ║
║  Если вы видите это сообщение,       ║
║  значит вы тоже разработчик! 👨‍💻      ║
╚══════════════════════════════════════╝
`);

// Add some fun interactions
let clickCount = 0;
document.querySelector('.logo-text').addEventListener('click', () => {
    clickCount++;
    if (clickCount === 5) {
        showNotification('🎉 Секретное достижение разблокировано: "Любопытный кликер"!', 'success');
        // Add some confetti effect
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                createConfetti();
            }, i * 50);
        }
        clickCount = 0;
    }
});

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        background: ${['#03045E', '#023E8A', '#0077B6', '#48CAE4'][Math.floor(Math.random() * 4)]};
        top: -10px;
        left: ${Math.random() * 100}vw;
        z-index: 10000;
        pointer-events: none;
        border-radius: 50%;
    `;
    
    document.body.appendChild(confetti);
    
    confetti.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
    ], {
        duration: 3000,
        easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }).addEventListener('finish', () => {
        document.body.removeChild(confetti);
    });
}

// Initialize Platform Icons
function initializePlatformIcons() {
    const projectLinks = document.querySelectorAll('.project-link');
    
    projectLinks.forEach(link => {
        const href = link.getAttribute('href');
        const icon = link.querySelector('i');
        
        if (href && icon) {
            // Remove existing classes
            link.classList.remove('itch-link', 'steam-link');
            icon.classList.remove('fab', 'fa-itch-io', 'fa-steam', 'fas', 'fa-external-link-alt');
            
            if (href.includes('itch.io')) {
                link.classList.add('itch-link');
                icon.classList.add('fab', 'fa-itch-io');
            } else if (href.includes('steam')) {
                link.classList.add('steam-link');
                icon.classList.add('fab', 'fa-steam');
            } else {
                // Fallback to generic external link icon
                icon.classList.add('fas', 'fa-external-link-alt');
            }
        }
    });
}