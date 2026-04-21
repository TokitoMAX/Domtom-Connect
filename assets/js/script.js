/**
 * Domtom Connect v3.0+ 
 * Core Script - Minimalist & Professional
 */

// Configuration Formspree
const FORMSFREE_ENDPOINT = 'https://formspree.io/f/myzbqepy';

/**
 * Newsletter Submission
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const email = form.email.value;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    submitButton.disabled = true;
    submitButton.textContent = 'Inscription...';

    const formData = new FormData();
    formData.append('email', email);
    formData.append('newsletter', 'yes');
    formData.append('_subject', 'Nouvelle inscription newsletter - L\'Écho Ultramarin');
    formData.append('_to', 'domtomconnect@gmail.com');

    fetch(FORMSFREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            if (response.ok) {
                submitButton.textContent = 'Inscrit';
                submitButton.style.background = '#10b981';
                form.reset();

                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.textContent = originalText;
                    submitButton.style.background = '';
                }, 3000);
            } else {
                throw new Error('Erreur');
            }
        })
        .catch(error => {
            console.error('Erreur:', error);
            submitButton.textContent = 'Erreur';
            submitButton.style.background = '#ef4444';

            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
                submitButton.style.background = '';
            }, 3000);
        });
}

/**
 * Scroll Animations (Intersection Observer)
 */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.feature-card, .service-card, .faq-item, .hero-card, .dash-card');
    animatedElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

/**
 * FAQ Toggle Logic
 */
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        if (question) {
            question.addEventListener('click', () => {
                item.classList.toggle('active');
            });
        }
    });
}

/**
 * Mobile Menu Toggle Logic
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navContent = document.querySelector('.nav-content');

    if (navToggle && navContent) {
        navToggle.onclick = (e) => {
            e.stopPropagation();
            navToggle.classList.toggle('active');
            navContent.classList.toggle('active');
            
            // Prevent scrolling when menu is open
            if (navContent.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        };

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navContent.classList.contains('active') && !navContent.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navContent.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        navContent.querySelectorAll('a').forEach(link => {
            link.onclick = () => {
                navToggle.classList.remove('active');
                navContent.classList.remove('active');
                document.body.style.overflow = '';
            };
        });
    }
}

/**
 * Initialize all components
 */
function init() {
    initScrollAnimations();
    initFAQ();
    initMobileMenu();
    console.log('Domtom Connect v3.0+ initialized');
}

// Global initialization
document.addEventListener('DOMContentLoaded', init);
