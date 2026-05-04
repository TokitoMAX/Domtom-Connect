/**
 * UIComponents.js - Domtom Connect
 * Dynamic rendering of shared UI elements
 */

const UIComponents = {
    /**
     * Helper: Detect if we are in a subfolder and return path prefix
     */
    getPathPrefix() {
        const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
        return isSubFolder ? '../' : '';
    },

    /**
     * Helper: Adjust paths for universal loading
     */
    adjustPath(p, prefix) {
        if (!p || p.startsWith('http') || p.startsWith('javascript:')) return p;
        let clean = p.startsWith('/') ? p.slice(1) : p;
        if (!clean.includes('.') && !clean.includes('#')) {
            if (clean === 'marketplace/evenements' || clean === 'marketplace/companies') clean += '.html';
            else if (!clean.endsWith('/')) clean += '.html';
        }
        return prefix + clean;
    },

    /**
     * Render the Sidebar
     */
    renderSidebar(role, territory) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        const prefix = this.getPathPrefix();
        const adjust = (p) => this.adjustPath(p, prefix);

        const config = {
            talents: { label: 'Talents', path: 'marketplace/directory.html', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0zm6 3l2 2m0 0l2-2m-2 2v-6' },
            missions: { label: 'Missions', path: 'marketplace/jobs.html', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
            solutions: { label: 'Solutions', path: 'marketplace/solutions.html', icon: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z' },
            projects: { label: 'Projets', path: 'marketplace/projects.html', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
            events: { label: 'Événements', path: 'marketplace/evenements.html', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
            companies: { label: 'Entreprises', path: 'marketplace/companies.html', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' }
        };

        const isOwner = ['porteur', 'owner', 'admin'].includes(role);
        const isProfessional = ['expert', 'prestataire', 'entreprise', 'admin'].includes(role);
        const isSpectator = ['spectateur', 'spectator'].includes(role);
        const canUseBilletterie = (isOwner || isProfessional || isSpectator);
        
        let sidebarHtml = `
            <a href="${adjust('index.html')}" class="sidebar-brand">
                <img src="${adjust('assets/images/logo-domtomconnect.png')}" alt="Logo" class="sidebar-logo-img">
                <span class="sidebar-brand-text">Domtom Connect</span>
            </a>
        `;

        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html'), 'Tableau de Bord', 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6');

        sidebarHtml += `<div class="sidebar-section-title">Le Réseau</div>`;
        Object.values(config).forEach(item => {
            sidebarHtml += this.renderSidebarLink(adjust(item.path), item.label, item.icon);
        });

        // Professional Tools
        sidebarHtml += `<div class="sidebar-section-title">Mes Outils</div>`;
        if (isOwner) sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#success-engine'), 'Pilotage Succès', 'M13 10V3L4 14h7v7l9-11h-7z');
        if (isProfessional) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#business'), 'Finance & TJM', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#vitrine'), 'Ma Vitrine', 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z');
        }
        if (canUseBilletterie) sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#billetterie'), 'Billetterie', 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z');
        
        sidebarHtml += this.renderSidebarLink(adjust('messages.html'), 'Messagerie', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');

        sidebarHtml += `<div class="sidebar-section-title">Paramètres</div>`;
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#profile'), 'Mon Profil', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
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
            solutions: { label: 'Solutions', path: 'marketplace/solutions.html' },
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
        if (items.length <= 1) return; // not enough to wall

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
