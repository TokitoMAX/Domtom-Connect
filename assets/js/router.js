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
        'profile': 'profile',
        'webinars': 'webinars',
        'vitrine': 'vitrine',
        'messages': 'messages',
        'moments': 'moments'
    },

    /**
     * Initialize the router
     */
    init() {
        console.log("[Router] Initializing...");
        
        // Listen for back/forward navigation
        window.addEventListener('popstate', (event) => this.handleCurrentRoute());
        window.addEventListener('hashchange', () => this.handleCurrentRoute());

        this.handleCurrentRoute();
    },

    /**
     * Navigate to a path (Supports clean URLs and Hash fallback)
     */
    navigate(path, params = null) {
        // Support absolute URLs that are internal
        const isInternal = path.includes(window.location.origin) || !path.startsWith('http');
        const isDashboard = path.includes('/mon-espace') || path.includes('/dashboard');
        
        if (isInternal && isDashboard) {
            // Extract the view ID from the internal URL
            const url = new URL(path, window.location.origin);
            let internalId = url.pathname.split('/').pop();
            if (internalId === 'mon-espace' || internalId === 'mon-espace.html') {
                internalId = url.hash.replace('#', '').split('?')[0] || 'overview';
            }
            
            if (this.routes[internalId]) {
                console.log("[Router] Internal absolute link detected, navigating as SPA:", internalId);
                window.history.pushState(params, '', `/mon-espace/${internalId}${url.search}`);
                this.handleCurrentRoute();
                return;
            }
        }

        if (!path.startsWith('#')) {
            console.log("[Router] External link or non-hash path detected, using standard navigation:", path);
            window.location.href = path;
            return;
        }

        let viewId = path.replace('#', '').replace('/mon-espace/', '').replace('/dashboard/', '');
        viewId = viewId.split('?')[0];

        // Ensure path is formatted correctly for History API
        const cleanPath = `/mon-espace/${viewId}`;

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
        
        // 3. Last fallback: loop (But never match real HTML files)
        if (!viewId || viewId === 'overview') {
            if (!path.includes('.html') && !path.includes('marketplace/')) {
                for (const [route, id] of Object.entries(this.routes)) {
                    if (path.endsWith(`/${route}`) || hash === route) {
                        viewId = id;
                        break;
                    }
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
