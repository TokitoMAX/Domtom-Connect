/**
 * UIComponents.js - Domtom Connect
 * Dynamic rendering of shared UI elements
 */

const UIComponents = {
    /**
     * Render the Sidebar
     */
    renderSidebar(role, territory) {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // --- PATH LOGIC (Robust local file support) ---
        const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
        const prefix = window.location.protocol === 'file:' ? (isSubFolder ? '../' : '') : '/';
        const adjust = (p) => {
            if (p.startsWith('http') || p.startsWith('javascript:')) return p;
            let clean = p.startsWith('/') ? p.slice(1) : p;
            if (!clean.includes('.') && !clean.includes('#')) clean += '.html';
            return prefix + clean;
        };

        const isOwner = ['porteur', 'owner', 'admin'].includes(role);
        const isProfessional = ['expert', 'prestataire', 'entreprise', 'admin'].includes(role);
        
        const navItems = [
            { id: 'overview', label: 'ESPACE', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: 'mon-espace.html' },
            { id: 'collaboration', label: 'Hub Équipe', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-19a4 4 0 11-4 4 4 4 0 014-4zm6 19v-2a4 4 0 00-3-3.87m-4-12a4 4 0 014 4', path: 'mon-espace.html#collaboration' },
        ];

        const networkItems = [
            { label: 'Talents & Experts', icon: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m12-10a4 4 0 11-8 0 4 4 0 018 0zm6 3l2 2m0 0l2-2m-2 2v-6', path: 'marketplace/directory.html' },
            { label: 'Missions', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', path: 'marketplace/jobs.html' },
            { label: 'Projets', icon: 'M13 10V3L4 14h7v7l9-11h-7z', path: 'marketplace/projects.html' },
            { label: 'Événements', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', path: 'marketplace/evenements.html' },
            { label: 'Entreprises', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4', path: 'marketplace/companies.html' }
        ];

        let sidebarHtml = `
            <a href="${adjust('index.html')}" class="sidebar-brand">
                <img src="${adjust('assets/images/logo-domtomconnect.png')}" alt="Logo" class="sidebar-logo-img">
                <span class="sidebar-brand-text">Domtom Connect</span>
            </a>
        `;

        // Main Navigation
        navItems.forEach(item => {
            sidebarHtml += this.renderSidebarLink(adjust(item.path), item.label, item.icon);
        });

        // Network Section
        sidebarHtml += `<div class="sidebar-section-title">Le Réseau</div>`;
        networkItems.forEach(item => {
            sidebarHtml += this.renderSidebarLink(adjust(item.path), item.label, item.icon);
        });

        // Professional Tools
        sidebarHtml += `<div class="sidebar-section-title">Mes Outils</div>`;
        if (isOwner) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#success-engine'), 'Succès & Pilotage', 'M13 10V3L4 14h7v7l9-11h-7z');
        }
        if (isProfessional) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#business'), 'Factures & TJM', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
        }
        sidebarHtml += this.renderSidebarLink(adjust('messages.html'), 'Messagerie (Chat)', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');

        // Settings
        sidebarHtml += `<div class="sidebar-section-title">Paramètres</div>`;
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#profile'), 'Mon Compte', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
        sidebarHtml += `
            <a href="javascript:void(0)" onclick="signOut()" class="sidebar-link" title="Déconnexion">
                <div class="sidebar-icon" style="color:#ef4444;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </div>
                <span class="sidebar-label" style="color:#ef4444;">Déconnexion</span>
            </a>
        `;

        sidebar.innerHTML = sidebarHtml;
    },

    renderSidebarLink(path, label, icon) {
        return `
            <a href="${path}" class="sidebar-link" title="${label}">
                <div class="sidebar-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="${icon}" />
                    </svg>
                </div>
                <span class="sidebar-label">${label}</span>
            </a>
        `;
    },

    /**
     * Render the Top Navigation (Marketplace & Landing Style)
     */
    async renderTopNav() {
        const topNav = document.getElementById('nav-links-container') || document.querySelector('.navbar .container');
        if (!topNav) return;

        // 1. Context Detection
        const isDashboard = window.location.pathname.includes('mon-espace') || window.location.pathname.includes('dashboard');

        // 2. Get Session for Auth Buttons
        let session = null;
        try {
            const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
            if (db) {
                const { data } = await db.auth.getSession();
                session = data?.session;
            }
        } catch (err) {
            console.warn("[UI] Could not fetch session for navbar:", err);
        }

        const links = [
            { label: 'Talents', path: 'marketplace/directory.html' },
            { label: 'Missions', path: 'marketplace/jobs.html' },
            { label: 'Projets', path: 'marketplace/projects.html' },
            { label: 'Événements', path: 'marketplace/evenements.html' },
            { label: 'Entreprises', path: 'marketplace/companies.html' }
        ];

        // --- PATH LOGIC (Robust local file support) ---
        // Detect if we are in a subfolder (marketplace, registration, blog, territoires, services, a-propos, diaspora)
        const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
        const prefix = window.location.protocol === 'file:' ? (isSubFolder ? '../' : '') : '/';
        
        const adjustPath = (p) => {
            if (p.startsWith('http')) return p;
            let cleanPath = p.startsWith('/') ? p.slice(1) : p;
            return prefix + cleanPath;
        };

        const currentPath = window.location.pathname;

        // --- DASHBOARD MODE (Pill Style, Centered) ---
        if (isDashboard) {
            let pillHtml = `<div class="nav-market-links">`;
            links.forEach(link => {
                const finalPath = adjustPath(link.path);
                const isActive = currentPath.includes(link.path.replace('.html', ''));
                pillHtml += `
                    <a href="${finalPath}" class="nav-market-link ${isActive ? 'active' : ''}">
                        ${link.label}
                    </a>
                `;
            });
            pillHtml += `</div>`;
            topNav.innerHTML = pillHtml;
            return;
        }

        // --- PUBLIC MODE (Standard Style with Branding & Actions) ---
        let html = `
            <a href="${adjustPath('index.html')}" class="nav-brand" id="logo-home" title="Accueil Domtom Connect">
                <img src="${adjustPath('assets/images/logo-domtomconnect.png')}" alt="Domtom Connect" class="nav-logo">
                <span class="nav-brand-name">Domtom Connect</span>
            </a>
            <button class="nav-toggle" type="button" aria-label="Menu" aria-expanded="false">
                <span></span><span></span><span></span>
            </button>
            <div class="nav-content">
                <div class="nav-links">
        `;

        links.forEach(link => {
            const finalPath = adjustPath(link.path);
            const isActive = currentPath.includes(link.path.replace('.html', ''));
            html += `<a href="${finalPath}" class="${isActive ? 'active' : ''}">${link.label}</a>`;
        });

        html += `
                </div>
                <div class="nav-actions" id="nav-auth-actions">
                    ${session ? `
                        <a href="${adjustPath('mon-espace.html')}" class="cta-button secondary">Dashboard</a>
                        <a href="${adjustPath('mon-espace.html#profile')}" class="cta-button primary" style="background:#0f172a; color: white !important;">Mon Profil</a>
                    ` : `
                        <a href="${adjustPath('login.html')}" class="cta-button secondary">Connexion</a>
                        <a href="${adjustPath('register-choice.html')}" class="cta-button primary" style="background:#0f172a; color: white !important;">Démarrer</a>
                    `}
                </div>
            </div>
        `;

        topNav.innerHTML = html;

        // --- ASYNC SESSION UPDATE (Fail-safe) ---
        if (!session) {
            try {
                const db = window._supabase || (typeof initSupabase === 'function' ? initSupabase() : null);
                if (db) {
                    const { data } = await db.auth.getSession();
                    if (data?.session) {
                        const authActions = document.getElementById('nav-auth-actions');
                        if (authActions) {
                            authActions.innerHTML = `
                                <a href="${adjustPath('mon-espace.html')}" class="cta-button secondary">Dashboard</a>
                                <a href="${adjustPath('mon-espace.html#profile')}" class="cta-button primary" style="background:#0f172a; color: white !important;">Mon Profil</a>
                            `;
                        }
                    }
                }
            } catch (err) {
                console.warn("[UI] Could not fetch session for upgrade:", err);
            }
        }
    },

    /**
     * Render the Mobile Bottom Navigation
     */
    renderMobileNav(role, territory) {
        const mobileNav = document.querySelector('.mobile-nav');
        if (!mobileNav) return;

        // Detect if we are in a subfolder for local file support
        const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
        const prefix = window.location.protocol === 'file:' ? (isSubFolder ? '../' : '') : '/';
        const adjust = (p) => prefix + (p.startsWith('/') ? p.slice(1) : p);

        mobileNav.innerHTML = `
            <div style="display: flex; justify-content: space-around; width: 100%; align-items: center; padding: 12px 0; background: #0f172a; border-radius: 20px 20px 0 0; box-shadow: 0 -10px 25px rgba(0,0,0,0.2);">
                <a href="${adjust('mon-espace.html')}" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: white; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    Dashboard
                </a>
                <a href="${adjust('marketplace/directory.html')}" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                    Talents
                </a>
                <a href="${adjust('marketplace/evenements.html')}" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>
                    Éclats
                </a>
                <a href="${adjust('mon-espace.html#profile')}" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                    Profil
                </a>
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
        
        // --- MOBILE NAV INITIALIZATION ---
        // Render bottom nav for authenticated/dashboard views
        if (document.querySelector('.mobile-nav')) {
            window.UIComponents.renderMobileNav();
        }
        
        // --- MOBILE TOGGLE INITIALIZATION (Landing/Public) ---
        const toggle = document.querySelector('.nav-toggle');
        const navContent = document.querySelector('.nav-content');
        
        if (toggle && navContent) {
            toggle.addEventListener('click', function() {
                const expanded = this.getAttribute('aria-expanded') === 'true' || false;
                this.setAttribute('aria-expanded', !expanded);
                navContent.classList.toggle('active');
                this.classList.toggle('active');
            });
            
            // Close menu when clicking links
            navContent.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navContent.classList.remove('active');
                    toggle.classList.remove('active');
                    toggle.setAttribute('aria-expanded', 'false');
                });
            });
        }
    }
};

window.UIComponents = UIComponents;
