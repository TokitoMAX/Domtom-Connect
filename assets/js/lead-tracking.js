// Lead Tracking System

window.trackLead = function(data) {
    // Store in localStorage for analytics
    const trackingData = {
        ...data,
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent
    };
    
    // Get existing leads or initialize
    let leads = JSON.parse(localStorage.getItem('domtom_leads') || '[]');
    leads.push(trackingData);
    
    // Keep only last 100 leads
    if (leads.length > 100) {
        leads = leads.slice(-100);
    }
    
    localStorage.setItem('domtom_leads', JSON.stringify(leads));
    
    // Log to console for debugging
    console.log('Lead tracked:', trackingData);
    
    // Send to analytics endpoint (if you have one)
    // You can integrate with Google Analytics, Facebook Pixel, etc.
    sendToAnalytics(trackingData);
};

function sendToAnalytics(data) {
    // Example: Send to Google Analytics (if configured)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'lead_generated', {
            'event_category': data.source,
            'event_label': data.type || data.action,
            'value': data.score || 0
        });
    }
    
    // Example: Send to Facebook Pixel (if configured)
    if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
            content_name: data.source,
            content_category: data.type || 'general'
        });
    }
    
    // You can add more analytics platforms here
}

// Track page views
document.addEventListener('DOMContentLoaded', function() {
    const pageType = getPageType();
    
    if (window.trackLead) {
        window.trackLead({
            source: 'page-view',
            action: 'viewed',
            type: pageType
        });
    }
});

function getPageType() {
    const path = window.location.pathname;
    
    if (path.includes('quiz')) return 'quiz';
    if (path.includes('lead-magnets')) return 'lead-magnet';
    if (path.includes('landing')) return 'landing';
    if (path.includes('blog')) return 'blog';
    if (path.includes('services')) return 'services';
    if (path === '/' || path === '/index.html') return 'home';
    
    return 'other';
}

// Export leads data (for admin/analytics)
window.getLeadsData = function() {
    const leads = JSON.parse(localStorage.getItem('domtom_leads') || '[]');
    return leads;
};

// Clear leads data (for testing)
window.clearLeadsData = function() {
    localStorage.removeItem('domtom_leads');
    console.log('Leads data cleared');
};
