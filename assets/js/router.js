/**
 * Router.js - Domtom Connect
 * Handles Clean URLs (History API) for the SPA logic
 */

const Router = {
    /**
     * Map clean paths to internal view identifiers
     */
    routes: {
        '/mon-espace': 'overview',
        '/dashboard': 'overview',
        '/dashboard/overview': 'overview',
        '/dashboard/success-engine': 'success-engine',
        '/dashboard/billetterie': 'billetterie',
        '/dashboard/mes-billets': 'mes-billets',
        '/dashboard/missions': 'missions',
        '/dashboard/business': 'business',
        '/dashboard/collaboration': 'collaboration',
        '/dashboard/profile': 'profile'
    },

    /**
     * Initialize the router
     */
    init() {
        console.log("[Router] Initializing...");
        
        // Listen for back/forward navigation
        window.addEventListener('popstate', (event) => {
            console.log("[Router] Popstate event:", window.location.pathname);
            this.handleCurrentRoute();
        });

        // Intercept clicks on links that should be handled by the router
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a');
            const href = link ? link.getAttribute('href') : null;
            if (href && (href.startsWith('/dashboard') || href.startsWith('/mon-espace'))) {
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
        console.log("[Router] Navigating to:", path);
        // Handle hash-based params as fallback
        if (path.includes('#')) {
            const parts = path.split('#');
            const cleanPath = parts[0];
            const hashPart = parts[1];
            if (hashPart.includes('?')) {
                const subParts = hashPart.split('?');
                path = `${subParts[0].startsWith('/') ? '' : '/dashboard/'}${subParts[0]}?${subParts[1]}`;
            } else {
                path = `/dashboard/${hashPart}`;
            }
        }

        if (window.location.pathname + window.location.search === path && !params) return;

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
        let viewId = 'overview';

        // Match specific routes first (Longest first)
        const sortedRoutes = Object.entries(this.routes).sort((a, b) => b[0].length - a[0].length);
        
        for (const [route, id] of sortedRoutes) {
            if (path === route || path.startsWith(route + '/')) {
                viewId = id;
                break;
            }
        }

        const params = new URLSearchParams(window.location.search);

        console.log(`[Router] Route matched: ${path}${window.location.search} -> ${viewId}`);
        
        // Call global showView (proxied to App.showView)
        if (typeof window.showView === 'function') {
            window.showView(viewId, true, params);
        }
    }
};

window.Router = Router;
