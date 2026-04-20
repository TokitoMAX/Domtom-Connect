/**
 * App.js - Domtom Connect
 * Main Orchestrator for the SaaS Platform
 */

const App = {
    state: {
        session: null,
        profile: null,
        role: 'user',
        territory: 'OM_FR',
        activeView: 'overview'
    },

    /**
     * Start the application
     */
    async init() {
        console.log("[App] Starting...");
        
        try {
            // 1. Check Supabase
            if (typeof _supabase === 'undefined' || !_supabase) {
                if (typeof initSupabase === 'function') {
                    window._supabase = initSupabase();
                }
            }
            const db = window._supabase;
            if (!db) {
                console.error("[App] Supabase not initialized");
                return;
            }

            // 2. Check Session
            const { data: { session } } = await db.auth.getSession();
            if (!session) {
                window.location.href = '/login';
                return;
            }
            this.state.session = session;

            // 3. Load Profile
            const { data: profile, error } = await db
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error || !profile) {
                window.location.href = '/registration/onboarding';
                return;
            }
            this.state.profile = profile;
            this.state.role = profile.role || 'user';
            this.state.territory = profile.major_zone || 'OM_FR';

            // 3. Apply Territorial Theme
            this.applyTheme();

            // 4. Initialize UI & Navigation
            this.renderUI();

            // 5. Initialize Router
            if (window.Router) {
                window.Router.init();
            }

            console.log("[App] Ready. Role:", this.state.role, "Territory:", this.state.territory);

        } catch (err) {
            console.error("[App] Initialization Error:", err);
            // Fallback for demo/debug
        }
    },

    /**
     * Apply Territorial Colors and Logos via CSS Variables
     */
    applyTheme() {
        const config = window.TerritoryConfig.getEcosystem(this.state.territory);
        const root = document.documentElement;

        // Define theme colors based on zone
        const themes = {
            'OM_FR': { primary: '#10b981', secondary: '#059669', dark: '#0f172a' },
            'PACIFIC_FR': { primary: '#3b82f6', secondary: '#1d4ed8', dark: '#0f172a' },
            'CAR_EN': { primary: '#f59e0b', secondary: '#d97706', dark: '#0f172a' },
            'CAR_ES': { primary: '#ef4444', secondary: '#b91c1c', dark: '#0f172a' },
            'INT_DIASPORA': { primary: '#6366f1', secondary: '#4338ca', dark: '#0f172a' }
        };

        const theme = themes[this.state.territory] || themes['OM_FR'];

        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--dark-color', theme.dark);
        
        console.log(`[App] Theme applied for ${this.state.territory}`);
    },

    /**
     * Render common UI components (Sidebar, TopNav, etc.)
     */
    renderUI() {
        if (!window.UIComponents) return;
        
        const territoryConfig = window.TerritoryConfig.getEcosystem(this.state.territory);
        
        window.UIComponents.renderSidebar(this.state.role, territoryConfig);
        window.UIComponents.renderTopNav(this.state.role, territoryConfig);
        window.UIComponents.renderMobileNav(this.state.role, territoryConfig);
    },

    /**
     * Centralized View Switcher (Delegates to Modules)
     */
    async showView(viewId, forceRender = false, params = null) {
        if (this.state.activeView === viewId && !forceRender) return;
        this.state.activeView = viewId;

        // 1. Hide all containers
        const containers = document.querySelectorAll('.view-section');
        containers.forEach(c => c.style.display = 'none');
        
        const overview = document.getElementById('overview-view');
        if (overview) overview.style.display = 'none';

        // 2. Special case for overview (Dashboard Hub)
        if (viewId === 'overview') {
            if (overview) overview.style.display = 'block';
        } else {
            // Automatically show the matching container if it exists
            const target = document.getElementById(`${viewId}-view`) || document.getElementById(`${viewId}-view-fixed`);
            if (target) target.style.display = 'block';
        }

        // 3. Delegate to Ecosystem Module
        const activeModule = this.getActiveModule();
        if (activeModule) {
            const gridContainer = document.getElementById('ecosystem-grid-container');
            await activeModule.route(viewId, gridContainer, this.state.profile, this.state.session, params);
        }

        // 4. Update Navigation active state
        this.updateNavState(viewId);

        // 5. Hide Splash Screen (First View Rendered)
        const splash = document.getElementById('app-splash-screen');
        if (splash && !splash.classList.contains('hidden')) {
            setTimeout(() => {
                splash.classList.add('hidden');
            }, 300);
        }
    },

    getActiveModule() {
        const role = this.state.role;
        switch (role) {
            case 'expert':
            case 'prestataire': return window.ExpertsModule;
            case 'entreprise': return window.CompaniesModule;
            case 'porteur':
            case 'owner': return window.OwnersModule;
            default: return window.StandardModule;
        }
    },

    updateNavState(viewId) {
        const links = document.querySelectorAll('.sidebar-link, .mobile-nav-link');
        links.forEach(link => {
            const path = link.getAttribute('href');
            const isActive = path === `/dashboard/${viewId}` || (viewId === 'overview' && path === '/dashboard');
            link.classList.toggle('active', isActive);
        });
    }
};

window.App = App;
window.showView = (id, force, params) => App.showView(id, force, params);

/**
 * Global Utility: isPremiumUser
 * Determines if a profile has an active premium/authority status
 */
window.isPremiumUser = (profile) => {
    if (!profile) return false;
    const tier = profile.subscription_tier || 'free';
    return tier !== 'free' || profile.is_premium === true;
};

document.addEventListener('DOMContentLoaded', () => App.init());
