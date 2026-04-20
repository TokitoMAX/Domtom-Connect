/**
 * App.js - Domtom Connect
 * Main Orchestrator for the SPA Dashboard and Platform Logic
 */

const App = {
    state: {
        session: null,
        profile: null,
        role: null,
        activeView: null,
        initialized: false
    },

    /**
     * Initialization - Boot the platform
     */
    async init() {
        console.log("[App] Booting Domtom Connect Dashboard...");
        
        try {
            // 1. Wait for Supabase SDK & Auth initialization Injection
            let retryCount = 0;
            while (!window._supabase && retryCount < 20) {
                if (typeof window.initSupabase === 'function') window.initSupabase();
                if (window._supabase) break;
                console.log("[App] Waiting for Supabase SDK...");
                await new Promise(resolve => setTimeout(resolve, 200));
                retryCount++;
            }

            if (!window._supabase) {
                throw new Error("Le SDK Supabase n'a pas pu être initialisé.");
            }

            const db = window._supabase;
            this.db = db;

            // 2. Load Session
            const { data: { session }, error: sessionError } = await db.auth.getSession();
            if (sessionError) throw sessionError;

            this.state.session = session;

            if (!session) {
                console.log("[App] No active session found. Redirecting to login...");
                window.location.href = '/login';
                return;
            }

            // 3. Load Profile & Role
            const profile = await window.getUserProfile(session.user.id);
            if (!profile) {
                console.warn("[App] Profile not found. Redirecting to onboarding...");
                window.location.href = '/registration/onboarding';
                return;
            }

            this.state.profile = profile;
            this.state.role = profile.role || 'spectateur';
            console.log(`[App] Session ready: ${profile.full_name} (${this.state.role})`);

            // 4. Initialize UI & Routing
            if (window.UIComponents) {
                window.UIComponents.renderSidebar(this.state.role, profile.territory || 'Territoire');
                window.UIComponents.renderTopNav(this.state.role);
            }

            if (window.Router) {
                window.Router.init();
            }

            this.state.initialized = true;

        } catch (err) {
            console.error("[App] Critical Boot Error:", err);
            const container = document.getElementById('ecosystem-grid-container');
            if (container) {
                container.innerHTML = `<div style="padding:40px; color:#ef4444; text-align:center; font-weight:800;">Erreur de connexion : ${err.message}.</div>`;
            }
        }
    },

    /**
     * View Switcher - Main entry point for Router
     */
    async showView(viewId, forceRender = false, params = null) {
        if (!this.state.initialized && this.state.session) {
            console.log("[App] ShowView called before initialization complete. Waiting...");
            let waitCount = 0;
            while (!this.state.initialized && waitCount < 10) {
                await new Promise(resolve => setTimeout(resolve, 500));
                waitCount++;
            }
        }

        if (this.state.activeView === viewId && !forceRender) return;

        console.log(`[App] Switching view to: ${viewId} with params:`, params);
        this.state.activeView = viewId;

        // Hide all views (SPA Strategy)
        const containers = document.querySelectorAll('.view-section');
        containers.forEach(c => c.style.display = 'none');
        
        // Modules and specialized views
        const overview = document.getElementById('overview-view');
        const successEngine = document.getElementById('success-engine-view-fixed');
        const billetterie = document.getElementById('billetterie-view');
        
        // Role Isolation: Strictly enforce view permissions
        const isOwner = ['porteur', 'owner', 'admin', 'admin'].includes(this.state.role);
        
        if (viewId === 'success-engine' && !isOwner) {
            console.warn(`[App] Unauthorized access attempt to success-engine by role: ${this.state.role}. Redirecting...`);
            this.showView('overview', true);
            return;
        }

        if (successEngine) successEngine.style.display = (viewId === 'success-engine' && isOwner) ? 'block' : 'none';

        // Select Module based on role
        const activeModule = this.getActiveModule();
        
        if (activeModule) {
            // View Orchestration
            if (viewId === 'overview' && overview) {
                overview.style.display = 'block';
            } else {
                // For specialized views, show their specific containers if handled by modules
                const targetViewId = `${viewId}-view`;
                const targetView = document.getElementById(targetViewId);
                if (targetView) targetView.style.display = 'block';
            }

            const gridContainer = document.getElementById('ecosystem-grid-container');
            await activeModule.route(viewId, gridContainer, this.state.profile, this.state.session, params);
        }
    },

    getActiveModule() {
        const role = this.state.role || 'spectateur';
        switch (role) {
            case 'expert':
            case 'prestataire': return window.ExpertsModule;
            case 'entreprise': return window.CompaniesModule;
            case 'porteur':
            case 'owner': return window.OwnersModule;
            default: return window.StandardModule;
        }
    }
};

window.App = App;
window.showView = (id, force, params) => App.showView(id, force, params);

// Auto-boot if on the correct page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('/mon-espace') || 
        window.location.pathname.includes('/dashboard') || 
        document.getElementById('nav-links-container')) {
        App.init();
    }
});
