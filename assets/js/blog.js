// Blog functionality

document.addEventListener('DOMContentLoaded', function() {
    initBlogFilters();
    initArticleShare();
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

