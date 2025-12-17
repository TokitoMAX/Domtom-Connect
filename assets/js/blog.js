// Blog functionality

document.addEventListener('DOMContentLoaded', function() {
    initBlogFilters();
    initArticleShare();
    initArticlesCarousel();
    sortArticlesByDate();
});

// Blog filters functionality
function initBlogFilters() {
    const filterButtons = document.querySelectorAll('.blog-filter-btn');
    const blogCards = document.querySelectorAll('.blog-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter articles
            blogCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (category === 'all' || cardCategory === category) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Article share functionality
function initArticleShare() {
    const shareButtons = document.querySelectorAll('.share-button');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const platform = this.dataset.platform;
            const url = encodeURIComponent(window.location.href);
            const title = encodeURIComponent(document.title);
            
            let shareUrl = '';
            
            switch(platform) {
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
                    break;
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${title}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
                    break;
                case 'whatsapp':
                    shareUrl = `https://wa.me/?text=${title}%20${url}`;
                    break;
                case 'email':
                    shareUrl = `mailto:?subject=${title}&body=${url}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Scroll animations for blog cards
function initBlogAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });
    
    document.querySelectorAll('.blog-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations if on blog page
if (document.querySelector('.blog-section')) {
    initBlogAnimations();
}

// Articles Carousel functionality
function initArticlesCarousel() {
    const carousel = document.querySelector('.articles-carousel-track');
    const cards = document.querySelectorAll('.carousel-card');
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    if (!carousel || cards.length === 0) return;
    
    let currentIndex = 0;
    const totalCards = cards.length;
    
    // Create indicators
    if (indicatorsContainer) {
        cards.forEach((_, index) => {
            const indicator = document.createElement('button');
            indicator.classList.add('carousel-indicator');
            if (index === 0) indicator.classList.add('active');
            indicator.setAttribute('aria-label', `Aller à l'article ${index + 1}`);
            indicator.addEventListener('click', () => goToSlide(index));
            indicatorsContainer.appendChild(indicator);
        });
    }
    
    const indicators = document.querySelectorAll('.carousel-indicator');
    
    // Set initial active card
    updateCarousel();
    
    // Previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            updateCarousel();
        });
    }
    
    // Next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (document.querySelector('.articles-carousel-wrapper')) {
            if (e.key === 'ArrowLeft') {
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
                updateCarousel();
            } else if (e.key === 'ArrowRight') {
                currentIndex = (currentIndex + 1) % totalCards;
                updateCarousel();
            }
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                // Swipe left - next
                currentIndex = (currentIndex + 1) % totalCards;
            } else {
                // Swipe right - previous
                currentIndex = (currentIndex - 1 + totalCards) % totalCards;
            }
            updateCarousel();
        }
    });
    
    // Auto-play (optional - can be disabled)
    let autoPlayInterval = null;
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % totalCards;
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }
    
    // Pause on hover
    const carouselWrapper = document.querySelector('.articles-carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', stopAutoPlay);
        carouselWrapper.addEventListener('mouseleave', startAutoPlay);
        // Start auto-play after 3 seconds
        setTimeout(startAutoPlay, 3000);
    }
    
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }
    
    function updateCarousel() {
        // Update transform
        const translateX = -currentIndex * 100;
        carousel.style.transform = `translateX(${translateX}%)`;
        
        // Update active card
        cards.forEach((card, index) => {
            if (index === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
        
        // Update button states
        if (prevBtn) {
            prevBtn.disabled = currentIndex === 0 && totalCards <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = currentIndex === totalCards - 1 && totalCards <= 1;
        }
    }
}

// Sort articles by date (most recent first)
function sortArticlesByDate() {
    const blogGrid = document.querySelector('.blog-grid');
    if (!blogGrid) return;
    
    const articles = Array.from(blogGrid.querySelectorAll('.blog-card'));
    
    // Sort by data-date attribute (most recent first)
    articles.sort((a, b) => {
        const dateA = a.getAttribute('data-date');
        const dateB = b.getAttribute('data-date');
        
        if (!dateA || !dateB) return 0;
        
        return new Date(dateB) - new Date(dateA);
    });
    
    // Re-append sorted articles
    articles.forEach(article => {
        blogGrid.appendChild(article);
    });
}

