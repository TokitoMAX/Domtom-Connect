/**
 * UIComponents.js - Domtom Connect
 * Dynamic rendering of shared UI elements
 */

const UIComponents = {
    /**
     * Helper: Detect if we are in a subfolder and return path prefix
     */
    getPathPrefix() {
        const path = window.location.pathname;
        const isSubFolder = /marketplace\/|registration\/|blog\/|territoires\/|services\/|a-propos\/|diaspora\/|mon-espace\/|dashboard\//.test(path);
        return isSubFolder ? '../' : '';
    },

    /**
     * Helper: Adjust paths for universal loading
     */
    adjustPath(p, prefix) {
        if (!p) return '#';
        
        // --- NEW: Absolute Site Root Protection ---
        // Detect Project Root from script tag to ensure all generated paths are absolute
        const appScript = document.querySelector('script[src*="app.js"]');
        let siteRoot = appScript ? appScript.src.split('assets/js/app.js')[0] : (window.location.origin + '/');

        // Critical Fix: If the server rewrites virtual SPA paths (like /mon-espace/ or /marketplace/marketplace/),
        // the siteRoot will erroneously include them. We MUST strip them to find the true root.
        siteRoot = siteRoot.replace(/\/(mon-espace|marketplace|dashboard|territoires|blog|services)\/.*$/, '/');

        let clean = p.startsWith('./') ? p.substring(2) : p;
        
        // Don't modify absolute URLs or hashes
        if (clean.startsWith('http') || clean.startsWith('#') || clean.startsWith('javascript:')) {
            return clean;
        }

        // Auto-append .html if missing (and not a special path)
        if (!clean.includes('.') && !clean.includes('#')) {
            if (clean !== '' && !clean.endsWith('/')) {
                clean += '.html';
            }
        }

        try {
            // Resolve relative to site root for total safety
            return new URL(clean, siteRoot).href;
        } catch(e) {
            return prefix + clean;
        }
    },

    /**
     * Render the Sidebar
     */
    renderSidebar(role, territory) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const prefix = this.getPathPrefix();
        const adjust = (p) => this.adjustPath(p, prefix);

        const profile = window.App && window.App.state.profile;
        const isClubMember = profile && (profile.subscription_tier === 'club' || profile.subscription_tier === 'premium' || profile.subscription_tier === 'authority');

        let sidebarHtml = `
            <a href="${adjust('index.html')}" class="sidebar-brand">
                <img src="${adjust('assets/images/logo-domtomconnect.png')}" alt="Logo" class="sidebar-logo-img">
                <span class="sidebar-brand-text">Domtom Connect</span>
            </a>
        `;

        const roleLower = (role || '').toLowerCase();
        const allowedRoles = ['expert', 'entreprise', 'porteur', 'owner', 'porteur de projet', 'premium', 'authority', 'club', 'admin'];
        const roleTrimmed = roleLower.trim();
        const proRoles = ['expert', 'entreprise', 'porteur', 'owner', 'porteur de projet', 'admin', 'premium', 'authority', 'club'];
        const isExplorateur = !proRoles.includes(roleTrimmed);

        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#overview'), 'Accueil', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6');
        
        if (!isExplorateur) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#moments'), 'DTC', 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15');
        }
        
        sidebarHtml += this.renderSidebarLink(adjust('marketplace/directory.html'), 'Explorer', 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z');
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#messages'), 'Messagerie', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#billetterie'), 'Événements', 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z');

        if (allowedRoles.includes(roleLower) || isClubMember) {
            sidebarHtml += `<div class="sidebar-section-title">Espace VIP</div>`;
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#mastermind'), 'Club Mastermind', 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z');
        }

        sidebarHtml += `<div class="sidebar-section-title">Paramètres</div>`;
        sidebarHtml += this.renderSidebarLink(adjust(`mon-espace.html#channel?id=${profile ? profile.id : ''}`), 'Ma Chaîne', 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z');
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#profile'), 'Mon Profil', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
        sidebarHtml += this.renderSidebarLink(adjust('index.html'), 'Retour au Site Public', 'M10 19l-7-7m0 0l7-7m-7 7h18');
        sidebarHtml += `
            <a href="javascript:void(0)" onclick="signOut()" class="sidebar-link logout-btn">
                <div class="sidebar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2.5"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></div>
                <span class="sidebar-label" style="color:#ef4444; font-weight: 800;">Déconnexion</span>
            </a>
        `;

        sidebar.innerHTML = sidebarHtml;
    },

    renderSidebarLink(path, label, icon) {
        return `
            <a href="${path}" class="sidebar-link" title="${label}">
                <div class="sidebar-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="${icon}" /></svg></div>
                <span class="sidebar-label">${label}</span>
            </a>
        `;
    },

    renderUnifiedDashboard: async function(container, profile, role) {
        if (!container) return;
        const prefix = this.getPathPrefix();
        const adjust = (p) => this.adjustPath(p, prefix);

        const safeRole = (role || 'spectateur').toLowerCase();
        let roleActions = '';
        
        if (['porteur', 'owner', 'porteur de projet', 'admin'].includes(safeRole)) {
            roleActions = `
                <div class="dash-card dash-card-pro" onclick="window.Router.navigate('#success-engine')">
                    <div class="dash-card-icon"><i class="fas fa-rocket"></i></div>
                    <h3>Pilotage de Projet</h3>
                    <p>Gérez vos objectifs, vos financements et vos ressources.</p>
                </div>
            `;
        } else if (['expert', 'entreprise'].includes(safeRole)) {
            roleActions = `
                <div class="dash-card dash-card-pro" onclick="window.Router.navigate('#profile')">
                    <div class="dash-card-icon"><i class="fas fa-briefcase"></i></div>
                    <h3>Mon Activité Pro</h3>
                    <p>Gérez vos missions, vos offres et vos informations.</p>
                </div>
            `;
        } else {
            roleActions = `
                <div class="dash-card dash-card-pro" onclick="window.Router.navigate('#profile')">
                    <div class="dash-card-icon"><i class="fas fa-rocket"></i></div>
                    <h3>Porteur de Projet</h3>
                    <p>Structurez votre idée et trouvez des financements.</p>
                </div>
                <div class="dash-card dash-card-pro" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);" onclick="window.Router.navigate('#profile')">
                    <div class="dash-card-icon" style="color: #10b981;"><i class="fas fa-briefcase"></i></div>
                    <h3>Expert / Talent</h3>
                    <p>Proposez vos services à l'écosystème territorial.</p>
                </div>
                <div class="dash-card dash-card-pro" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);" onclick="window.Router.navigate('#profile')">
                    <div class="dash-card-icon" style="color: #3b82f6;"><i class="fas fa-building"></i></div>
                    <h3>Entreprise</h3>
                    <p>Recrutez et trouvez de nouveaux partenariats.</p>
                </div>
            `;
        }

        const roleDisplayNames = {
            'spectateur': 'Membre',
            'porteur': 'Porteur de Projet',
            'owner': 'Porteur de Projet',
            'expert': 'Expert / Talent',
            'entreprise': 'Entreprise',
            'admin': 'Administrateur'
        };
        const displayRole = roleDisplayNames[safeRole] || 'Membre';

        container.innerHTML = `
            <style>
                .dash-unified { font-family: 'Plus Jakarta Sans', sans-serif; padding: clamp(20px, 4vw, 40px); max-width: 1200px; margin: 0 auto; padding-bottom: 80px; }
                .dash-welcome { text-align: center; margin-bottom: 40px; }
                .dash-welcome h1 { font-size: clamp(2rem, 5vw, 3rem); font-weight: 950; color: #0f172a; margin: 0 0 10px 0; letter-spacing: -0.04em; }
                .dash-welcome p { font-size: 1.1rem; color: #64748b; margin: 0; font-weight: 500; }
                
                .dash-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }
                
                .dash-card { background: white; border-radius: 24px; padding: 32px; border: 1.5px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.02); cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: flex-start; text-align: left; }
                .dash-card:hover { transform: translateY(-5px); box-shadow: 0 20px 40px rgba(0,0,0,0.06); border-color: #10b981; }
                
                .dash-card-icon { width: 56px; height: 56px; background: #f0fdf4; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; margin-bottom: 24px; color: #10b981; transition: all 0.3s; }
                .dash-card:hover .dash-card-icon { background: #10b981; color: white; }
                
                .dash-card h3 { font-size: 1.3rem; font-weight: 900; color: #0f172a; margin: 0 0 10px 0; }
                .dash-card p { font-size: 0.95rem; color: #64748b; line-height: 1.6; margin: 0; }
                
                .dash-card-pro { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border: none; color: white; }
                .dash-card-pro h3 { color: white; }
                .dash-card-pro p { color: rgba(255,255,255,0.7); }
                .dash-card-pro .dash-card-icon { background: rgba(255,255,255,0.1); color: white; }
                .dash-card-pro:hover { box-shadow: 0 20px 40px rgba(15,23,42,0.3); border-color: transparent; }
                .dash-card-pro:hover .dash-card-icon { background: white; color: #0f172a; }
            </style>
            
            <div class="dash-unified">
                <div class="dash-welcome">
                    <h1>Bienvenue${profile?.first_name ? ', ' + profile.first_name : ''} 👋</h1>
                    <div style="margin-top: 12px; margin-bottom: 24px;">
                        <span style="background: rgba(16,185,129,0.1); border: 1px solid #10b981; color: #10b981; padding: 6px 14px; border-radius: 99px; font-size: 0.85rem; font-weight: 800; letter-spacing: 0.05em; text-transform: uppercase;">Type de compte : ${displayRole}</span>
                    </div>
                    <p>Que souhaitez-vous faire aujourd'hui ?</p>
                </div>
                
                <div class="dash-grid">
                    ${roleActions}
                    
                    <div class="dash-card" onclick="window.Router.navigate('#moments')">
                        <div class="dash-card-icon"><i class="fas fa-play"></i></div>
                        <h3>DTC (Réseau Social)</h3>
                        <p>Découvrez les dernières publications, stories et actualités de la communauté.</p>
                    </div>
                    
                    <div class="dash-card" onclick="window.location.href='${adjust('marketplace/directory.html')}'">
                        <div class="dash-card-icon"><i class="fas fa-compass"></i></div>
                        <h3>Explorer</h3>
                        <p>Trouvez des talents, des projets et des opportunités d'affaires locales.</p>
                    </div>
                    
                    <div class="dash-card" onclick="window.Router.navigate('#messages')">
                        <div class="dash-card-icon"><i class="fas fa-comment-dots"></i></div>
                        <h3>Messagerie</h3>
                        <p>Communiquez en direct avec votre réseau et vos collaborateurs.</p>
                    </div>
                    
                    <div class="dash-card" onclick="window.Router.navigate('#channel?id=${profile?.id || ''}')">
                        <div class="dash-card-icon"><i class="fas fa-tv"></i></div>
                        <h3>Ma Chaîne</h3>
                        <p>Gérez votre contenu, vos posts, et augmentez votre visibilité.</p>
                    </div>
                </div>
            </div>
        `;
    },

    async renderTopNav() {
        let nav = document.querySelector('.navbar');
        if (!nav) return;
        
        let navContainer = nav.querySelector('.container');
        if (!navContainer) {
            navContainer = document.createElement('div');
            navContainer.className = 'container';
            nav.appendChild(navContainer);
        }

        const prefix = this.getPathPrefix();
        const adjust = (p) => this.adjustPath(p, prefix);

        const config = {
            talents: { label: 'Talents', path: 'marketplace/directory.html' },
            missions: { label: 'Missions', path: 'marketplace/jobs.html' },
            projects: { label: 'Projets', path: 'marketplace/projects.html' },
            events: { label: 'Événements', path: 'marketplace/evenements.html' },
            companies: { label: 'Entreprises', path: 'marketplace/companies.html' }
        };

        navContainer.innerHTML = `
            <a href="${adjust('index.html')}" class="nav-brand">
                <img src="${adjust('assets/images/logo-domtomconnect.png')}" alt="Domtom Connect" class="nav-logo">
                <span class="nav-brand-name">Domtom Connect</span>
            </a>
            
            <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
            
            <div class="nav-content" id="primary-navigation">
                <div class="nav-links">
                    ${Object.values(config).map(item => {
                        const active = window.location.pathname.includes(item.path.split('/').pop()) ? 'class="active"' : '';
                        return `<a href="${adjust(item.path)}" ${active}>${item.label}</a>`;
                    }).join('')}
                </div>
                
                <div class="nav-actions" id="nav-auth-actions" style="display: flex; align-items: center; gap: 16px;">
                    <a href="${adjust('login.html')}" style="color: #0f172a; font-weight: 700; text-decoration: none;">Se connecter</a>
                    <a href="${adjust('register-choice.html')}" class="cta-button primary" style="background:#10b981; color: white !important; border: none; padding: 10px 24px; border-radius: 12px;">S'inscrire</a>
                </div>
            </div>
        `;

        nav.style.backgroundColor = 'white';
        nav.style.borderBottom = '1px solid #e2e8f0';
        nav.style.display = 'flex';

        let session = null;
        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            if (db) {
                const { data } = await db.auth.getSession();
                session = data?.session;
            }
        } catch (err) {}

        if (session) {
            const authActions = document.getElementById('nav-auth-actions');
            if (authActions) {
                authActions.innerHTML = `
                    <a href="${adjust('mon-espace.html')}" class="cta-button secondary">Dashboard</a>
                    <a href="${adjust('mon-espace.html#profile')}" class="cta-button primary" style="background:#0f172a; color: white !important;">Mon Profil</a>
                `;
            }
        }
    },

    async applyAuthWall(containerElement, typeName) {
        if (!containerElement) return;
        const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
        if (!db) return;

        try {
            const { data } = await db.auth.getSession();
            if (data?.session) return; // logged in
        } catch(e) {}

        const items = containerElement.children;
        if (items.length === 0) return; // not enough to wall

        for (let i = 0; i < items.length; i++) {
            if (i >= 2) {
                items[i].style.filter = 'blur(6px)';
                items[i].style.pointerEvents = 'none';
                items[i].style.userSelect = 'none';
                items[i].style.opacity = '0.7';
            }
        }

        containerElement.style.position = 'relative';
        
        const isDark = document.body.style.background.includes('var(--bg-main)') || window.location.pathname.includes('projects');
        const boxBg = isDark ? '#131B2F' : 'white';
        const textColor = isDark ? 'white' : '#0f172a';
        const textMuted = isDark ? '#9CA3AF' : '#64748b';
        const borderColor = isDark ? 'rgba(255,255,255,0.1)' : '#e2e8f0';
        const prefix = this.getPathPrefix();

        let overlay = containerElement.querySelector('.auth-wall-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'auth-wall-overlay';
            containerElement.appendChild(overlay);
        }

        overlay.style.position = 'absolute';
        overlay.style.bottom = '-10px';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '60%';
        overlay.style.display = 'flex';
        overlay.style.flexDirection = 'column';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'flex-end';
        overlay.style.paddingBottom = '40px';
        overlay.style.zIndex = '10';

        overlay.innerHTML = `
            <div style="background: ${boxBg}; padding: 40px; border-radius: 24px; text-align: center; box-shadow: 0 20px 50px rgba(0,0,0,0.3); border: 1px solid ${borderColor}; max-width: 500px; margin: 0 auto; width: 90%;">
                <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.1); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #10b981;">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <h3 style="font-size: 1.4rem; font-weight: 800; margin-bottom: 16px; color: ${textColor}; line-height: 1.3;">Inscrivez-vous pour voir tous les ${typeName}</h3>
                <p style="color: ${textMuted}; margin-bottom: 32px; line-height: 1.6; font-size: 0.95rem;">L'accès complet à cet espace est réservé aux membres.</p>
                <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
                    <a href="${this.adjustPath('login.html', prefix)}" class="cta-button secondary" style="padding: 12px 24px; border: 1px solid ${borderColor}; border-radius: 12px; font-weight: 700; color: ${textColor}; text-decoration: none; background: transparent;">Se connecter</a>
                    <a href="${this.adjustPath('register-choice.html', prefix)}" class="cta-button primary" style="background: #10b981; color: white !important; padding: 12px 24px; border-radius: 12px; font-weight: 700; text-decoration: none; border: none; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">S'inscrire (Gratuit)</a>
                </div>
            </div>
        `;
    }
};

/**
 * Global Helper for Universal Navigation Loading
 */
window.loadGlobalNavbar = async function() {
    if (window.UIComponents) {
        await window.UIComponents.renderTopNav();
        
        // --- MOBILE TOGGLE INITIALIZATION ---
        const toggle = document.querySelector('.nav-toggle');
        const navContent = document.querySelector('.nav-content');
        
        if (toggle && navContent) {
            // Remove any existing click listeners to avoid double-triggering
            const newToggle = toggle.cloneNode(true);
            toggle.parentNode.replaceChild(newToggle, toggle);

            newToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                const expanded = this.getAttribute('aria-expanded') === 'true';
                this.setAttribute('aria-expanded', !expanded);
                this.classList.toggle('active');
                navContent.classList.toggle('active');
                
                // Prevent scrolling when menu is open
                if (navContent.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
            
            // Close menu when clicking links
            navContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navContent.classList.remove('active');
                    newToggle.classList.remove('active');
                    newToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });

            // Close when clicking outside
            document.addEventListener('click', (e) => {
                if (navContent.classList.contains('active') && !navContent.contains(e.target) && !newToggle.contains(e.target)) {
                    navContent.classList.remove('active');
                    newToggle.classList.remove('active');
                    newToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    }
};

window.UIComponents = UIComponents;

window.showFlashMessage = function(message, type = 'success', redirectPath = null) {
    let container = document.getElementById('flash-message-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'flash-message-container';
        container.style.cssText = 'position:fixed; top:24px; left:50%; transform:translateX(-50%); z-index:999999; display:flex; flex-direction:column; gap:10px; pointer-events:none; width:90%; max-width:400px;';
        document.body.appendChild(container);
    }
    
    const el = document.createElement('div');
    el.style.cssText = `
        padding: 16px 20px;
        border-radius: 16px;
        background: ${type === 'success' ? '#065f46' : '#991b1b'};
        color: white;
        font-family: 'Plus Jakarta Sans', sans-serif;
        font-weight: 700;
        font-size: 0.9rem;
        box-shadow: 0 20px 40px rgba(0,0,0,0.3);
        border: 1px solid rgba(255,255,255,0.1);
        display: flex;
        align-items: center;
        gap: 12px;
        pointer-events: all;
        cursor: pointer;
        opacity: 0;
        transform: translateY(-20px);
        transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    `;
    
    const icon = type === 'success' ? '✅' : '❌';
    el.innerHTML = `
        <span style="font-size: 1.2rem;">${icon}</span>
        <span style="flex:1;">${message}</span>
    `;
    
    container.appendChild(el);
    
    setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
    }, 10);
    
    const dismiss = () => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            el.remove();
            if (redirectPath) {
                if (redirectPath.startsWith('#')) {
                    if (window.Router) {
                        window.Router.navigate(redirectPath);
                    } else {
                        window.location.hash = redirectPath;
                    }
                } else {
                    window.location.href = redirectPath;
                }
            }
        }, 300);
    };
    
    el.addEventListener('click', dismiss);
    setTimeout(dismiss, 3500);
};
