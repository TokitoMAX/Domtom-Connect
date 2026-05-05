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
            
            // Hardened Platform Admin Logic: Always elevate the core email to admin
            const ownerEmail = 'domtomconnect@gmail.com';
            if (session.user.email?.toLowerCase().trim() === ownerEmail) {
                this.state.role = 'admin';
                console.log("[App] Platform Owner detected. Elevating to ADMIN role.");
            }
            
            console.log(`[App] Session ready: ${profile.full_name} (${this.state.role})`);

            // 4. Initialize UI & Routing
            this.state.initialized = true;

            if (window.UIComponents) {
                window.UIComponents.renderSidebar(this.state.role, profile.territory || 'Territoire');
                window.UIComponents.renderTopNav(this.state.role);
            }

            if (window.Router) {
                window.Router.init();
            }

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
            while (!this.state.initialized && waitCount < 30) {
                await new Promise(resolve => setTimeout(resolve, 100)); // Faster check (100ms)
                waitCount++;
            }
        }

        if (this.state.activeView === viewId && !forceRender) return;

        console.log(`[App] Switching view to: ${viewId} with params:`, params);
        this.state.activeView = viewId;

        // 1. Hide all views (SPA Strategy)
        const containers = document.querySelectorAll('.view-section');
        containers.forEach(c => c.style.display = 'none');
        
        // 2. Resolve target view and container
        const overview = document.getElementById('overview-view');
        const targetViewId = `${viewId}-view`;
        const targetView = document.getElementById(targetViewId);
        
        // Role Isolation: Strictly enforce view permissions
        const isOwner = ['porteur', 'owner', 'admin'].includes(this.state.role);
        const isAdmin = this.state.role === 'admin' || (this.state.session?.user?.email === 'domtomconnect@gmail.com');
        
        if (viewId === 'success-engine' && !(isOwner || isAdmin)) {
            console.warn(`[App] Unauthorized access attempt to success-engine by role: ${this.state.role}. Redirecting...`);
            this.showView('overview', true);
            return;
        }

        // Show the active view container
        if (viewId === 'overview' && overview) {
            overview.style.display = 'block';
        } else if (targetView) {
            targetView.style.display = 'block';
        }

        // 3. Select Module based on role
        let activeModule = this.getActiveModule();

        // --- NEW: Global Module Overrides ---
        if (viewId === 'webinars' && window.WebinarModule) {
            activeModule = window.WebinarModule;
        }
        
        // Robust Wait for Module to Load (Mobile/Slow network support)
        if (!activeModule) {
            console.warn(`[App] Module for role ${this.state.role} not found. Retrying...`);
            let retry = 0;
            while (!activeModule && retry < 20) {
                await new Promise(r => setTimeout(r, 200));
                activeModule = this.getActiveModule();
                retry++;
            }
        }

        // 4. Render Module Content
        const gridContainer = document.getElementById('ecosystem-grid-container');
        const targetContainer = targetView || gridContainer;

        if (activeModule) {
            console.log(`[App] Executing ${activeModule.role || 'standard'} module router for view: ${viewId}`);
            
            // SECURITY CHECK: Clear target before injecting new module content
            if (targetContainer) {
                console.log(`[App] Preparing targetContainer (${targetContainer.id}) for module: ${viewId}`);
                // Ensure visibility
                targetContainer.style.display = 'block';
                // Keep some height to avoid "jumpy" UI
                targetContainer.innerHTML = `
                    <div style="min-height:450px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px; animation: fadeIn 0.3s ease;">
                        <div class="splash-loader"></div>
                        <p style="color:#64748b; font-weight:700; font-size:1.1rem; letter-spacing:-0.01em;">Initialisation de l'espace ${viewId}...</p>
                    </div>
                `;
            }
            
            try {
                await activeModule.route(viewId, targetContainer, this.state.profile, this.state.session, params);
            } catch (err) {
                console.error("[App] Module Route Error:", err);
                if (targetContainer) targetContainer.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:700; text-align:center;">Erreur lors du rendu du module : ${err.message}</div>`;
            }
        } else {
            console.error(`[App] Critical: Active module not found for role: ${this.state.role}`);
            if (targetContainer) targetContainer.innerHTML = `<div style="padding:40px; color:#ef4444; font-weight:700; text-align:center;">Module ${this.state.role} introuvable. Veuillez recharger la page.</div>`;
        }
    },

    getActiveModule() {
        const rawRole = this.state.role || 'spectateur';
        // Normalize role: lowercase and remove accents/spaces for robust matching
        const role = rawRole.toLowerCase()
            .replace(/\s+/g, '')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 

        switch (role) {
            case 'admin':
            case 'entreprise': return window.CompaniesModule;
            case 'expert':
            case 'prestataire': return window.ExpertsModule;
            case 'porteur':
            case 'porteurdeprojet':
            case 'owner': return window.OwnersModule;
            case 'spectateur':
            case 'spectator': return window.SpectatorsModule;
            default: return window.StandardModule;
        }
    }
};

window.App = App;
window.showView = (id, force, params) => App.showView(id, force, params);

// Auto-boot if on the correct page
document.addEventListener('DOMContentLoaded', () => {
    if (window.location.pathname.includes('mon-espace') || 
        window.location.pathname.includes('dashboard') || 
        document.querySelector('.sidebar') || 
        document.querySelector('.main-content')) {
        App.init();
    }
});
