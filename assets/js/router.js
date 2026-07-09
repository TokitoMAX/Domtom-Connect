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
        'pilotage.html': 'success-engine',
        'billetterie': 'billetterie',
        'billetterie.html': 'billetterie',
        'profile': 'profile',
        'profile.html': 'profile',
        'channel': 'channel',
        'channel.html': 'channel',
        'webinars': 'webinars',
        'vitrine': 'vitrine',
        'vitrine.html': 'vitrine',
        'showcase': 'vitrine',
        'messages': 'messages',
        'messages.html': 'messages',
        'moments': 'moments',
        'dtc': 'moments',
        'dtc.html': 'moments',
        'mastermind': 'mastermind',
        'mastermind.html': 'mastermind',
        'mastermind-salon': 'mastermind-salon',
        'business': 'business',
        'business.html': 'business',
        'premium': 'premium',
        'premium.html': 'premium',
        'incubator': 'incubator',
        'incubator.html': 'incubator',
        'pilotage': 'success-engine',
        'pilotage.html': 'success-engine',
        'admin-inspection': 'admin-inspection',
        'services': 'services',
        'services.html': 'services'
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

        let cleanHash = path.replace('#', '').replace('/mon-espace/', '').replace('/dashboard/', '');
        let viewId = cleanHash.split('?')[0];
        let queryString = cleanHash.includes('?') ? '?' + cleanHash.split('?')[1] : '';

        // Ensure path is formatted correctly for History API
        const cleanPath = `/mon-espace/${viewId}${queryString}`;

        console.log("[Router] Navigating to:", cleanPath, "Matched view:", viewId);

        // Fallback for local file protocol: Use Hash
        if (window.location.protocol === 'file:') {
            window.location.hash = cleanHash;
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

        // Extract filename or last path segment to support subdirectories and file://
        let pathParts = path.split('/');
        let lastSegment = pathParts[pathParts.length - 1];
        if (!lastSegment && pathParts.length > 1) {
            lastSegment = pathParts[pathParts.length - 2];
        }
        
        // 1. Try to match clean path first
        if (lastSegment && this.routes[lastSegment]) {
            viewId = this.routes[lastSegment];
        }

        // 2. Fallback to hash matching
        if (viewId === 'overview' && hash) {
            const cleanHash = hash.split('?')[0];
            if (this.routes[cleanHash]) {
                viewId = this.routes[cleanHash];
            }
        } 
        
        // 3. Last fallback: loop
        if (viewId === 'overview') {
            for (const [route, id] of Object.entries(this.routes)) {
                if (path.endsWith(`/${route}`) || hash === route) {
                    viewId = id;
                    break;
                }
            }
        }

        const params = new URLSearchParams(window.location.search || (window.location.hash.includes('?') ? window.location.hash.split('?')[1] : ''));

        console.log(`[Router] Route matched: ${path} (Hash: ${hash}) -> ${viewId}`);

        this.updateSEO(viewId);

        if (window.App && window.App.showView) {
            window.App.showView(viewId, false, params);
        }
    },

    /**
     * Update SEO Meta Tags dynamically for SPAs
     */
    updateSEO(viewId) {
        const seoMap = {
            'overview': { title: 'Tableau de bord | Domtom Connect', desc: "Gérez vos projets, missions et accédez à votre réseau." },
            'moments': { title: 'DTC | Domtom Connect', desc: "Découvrez les dernières opportunités et projets de la communauté." },
            'marketplace': { title: 'Marketplace Experts | Domtom Connect', desc: "Trouvez les meilleurs experts et prestataires pour vos projets." },
            'showcase': { title: 'Offres & Services | Domtom Connect', desc: "Explorez nos solutions métiers." },
            'premium': { title: 'Accompagnement 1-to-1 | Domtom Connect', desc: "Propulsez votre projet avec un accompagnement sur-mesure." },
            'incubator': { title: 'Incubateur | Domtom Connect', desc: "Rejoignez l'Incubateur DTC et structurez votre projet." },
            'mastermind-salon': { title: 'Salon VIP | Domtom Connect', desc: "Espace d'échange réservé aux membres du Club Mastermind." },
            'default': { title: 'Domtom Connect | Ecosystème', desc: "Le pont entre l'ambition territoriale et l'expertise mondiale." }
        };

        const seo = seoMap[viewId] || seoMap['default'];
        
        // Update Title
        document.title = seo.title;
        
        // Update Meta Description
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = 'description';
            document.head.appendChild(metaDesc);
        }
        metaDesc.content = seo.desc;
        
        // Update OpenGraph Title
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
            ogTitle = document.createElement('meta');
            ogTitle.setAttribute('property', 'og:title');
            document.head.appendChild(ogTitle);
        }
        ogTitle.content = seo.title;
    }
};

window.Router = Router;
