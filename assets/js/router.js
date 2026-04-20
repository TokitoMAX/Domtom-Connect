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
            if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('/dashboard')) {
                e.preventDefault();
                this.navigate(link.getAttribute('href'));
            }
        });

        this.handleCurrentRoute();
    },

    /**
     * Navigate to a path
     */
    navigate(path, params = null) {
        console.log("[Router] Navigating to:", path);
        if (window.location.pathname === path && !params) return;

        window.history.pushState(params, '', path);
        this.handleCurrentRoute();
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

        console.log(`[Router] Route matched: ${path} -> ${viewId}`);
        
        // Call global showView (proxied to App.showView later)
        if (typeof window.showView === 'function') {
            window.showView(viewId, true);
        }
    }
};

window.Router = Router;
