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
            if (!link) return;

            const href = link.getAttribute('href');
            const isLocalHash = href && href.startsWith('#');
            const isDashboardRoute = href && (href.startsWith('/dashboard') || href.startsWith('/mon-espace'));
            
            // Only intercept if it's a dashboard view and NOT a separate .html page
            if ((isLocalHash || isDashboardRoute) && !href.includes('.html')) {
                e.preventDefault();
                this.navigate(href);
            }
        });

        this.handleCurrentRoute();
    },

    /**
     * Navigate to a path (Supports clean URLs and Hash fallback)
     */
    navigate(path, params = null) {
        let viewId = path.replace('#', '').replace('/mon-espace/', '').replace('/dashboard/', '');
        viewId = viewId.split('?')[0];

        // Ensure path is formatted correctly for History API
        const cleanPath = path.startsWith('#') ? `/mon-espace/${path.substring(1)}` : path;

        console.log("[Router] Navigating to:", cleanPath, "Matched view:", viewId);

        // Fallback for local file protocol: Use Hash
        if (window.location.protocol === 'file:') {
            window.location.hash = viewId;
            return;
        }

        window.history.pushState(params, '', cleanPath);
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

        // 1. Try to match clean path first
        const cleanPath = path.replace('/mon-espace/', '').replace('/dashboard/', '').replace('/', '');
        if (cleanPath && this.routes[cleanPath]) {
            viewId = this.routes[cleanPath];
        }

        // 2. Fallback to hash matching
        if (hash) {
            const cleanHash = hash.split('?')[0];
            if (this.routes[cleanHash]) {
                viewId = this.routes[cleanHash];
            }
        } 
        
        // 3. Last fallback: loop
        if (!viewId || viewId === 'overview') {
            for (const [route, id] of Object.entries(this.routes)) {
                if (path.includes(route) || hash.includes(route)) {
                    viewId = id;
                    break;
                }
            }
        }

        const params = new URLSearchParams(window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''));

        console.log(`[Router] Route matched: ${path} (Hash: ${hash}) -> ${viewId}`);

        if (window.App && window.App.showView) {
            window.App.showView(viewId, false, params);
        }
    }
};

window.Router = Router;
