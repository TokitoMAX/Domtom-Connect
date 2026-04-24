/**
 * Router.js - Domtom Connect
 * Handles Clean URLs (History API) for the SPA logic
 */

const Router = {
    /**
     * Map clean paths to internal view identifiers
     */
    routes: {
        'overview': 'overview',
        'success-engine': 'success-engine',
        'billetterie': 'billetterie',
        'mes-billets': 'mes-billets',
        'missions': 'missions',
        'business': 'business',
        'collaboration': 'collaboration',
        'profile': 'profile',
        'vitrine': 'vitrine',
        'marketplace': 'marketplace'
    },

    /**
     * Initialize the router
     */
    init() {
        console.log("[Router] Initializing...");
        
        // Listen for back/forward navigation
        window.addEventListener('popstate', (event) => this.handleCurrentRoute());
        window.addEventListener('hashchange', () => this.handleCurrentRoute());

        // Intercept clicks
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const href = link ? link.getAttribute('href') : null;
            if (href && (href.includes('#') || href.startsWith('/dashboard'))) {
                // If it's a cross-page link (e.g. marketplace), don't intercept here
                if (href.includes('.html') && !window.location.pathname.includes(href.split('#')[0])) {
                    return; 
                }
                e.preventDefault();
                this.navigate(href);
            }
        });

        this.handleCurrentRoute();
    },

    /**
     * Navigate to a path
     */
    navigate(path, params = null) {
        const hashPart = path.includes('#') ? path.split('#')[1] : null;
        
        // Prevent redundant navigation if already on this hash
        if (hashPart && window.location.hash.replace('#', '') === hashPart) {
            console.log("[Router] Already on hash:", hashPart);
            return;
        }

        console.log("[Router] Navigating to:", path);
        if (hashPart) {
            window.location.hash = hashPart;
            return;
        }
        window.history.pushState(params, '', path);
        this.handleCurrentRoute();
    },

    /**
     * Update URL without triggering router logic (Persistence)
     */
    updateUrl(path) {
        if (window.location.pathname + window.location.search === path) return;
        window.history.replaceState(null, '', path);
    },

    /**
     * Resolve the current URL and trigger view display
     */
    handleCurrentRoute() {
        const path = window.location.pathname;
        const hash = window.location.hash.replace('#', '');
        let viewId = 'overview';

        // 1. Try to match hash first (Preferred for file protocol)
        if (hash) {
            const cleanHash = hash.split('?')[0];
            if (this.routes[cleanHash]) {
                viewId = this.routes[cleanHash];
            }
        } 
        
        // 2. Fallback to path matching
        if (!viewId || viewId === 'overview') {
            for (const [route, id] of Object.entries(this.routes)) {
                if (path.includes(route)) {
                    viewId = id;
                    break;
                }
            }
        }

        const params = new URLSearchParams(window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''));

        console.log(`[Router] Route matched: ${path} (Hash: ${hash}) -> ${viewId}`);
        
        // Call global showView (proxied to App.showView)
        if (typeof window.showView === 'function') {
            window.showView(viewId, true, params);
        }
    }
};

window.Router = Router;
