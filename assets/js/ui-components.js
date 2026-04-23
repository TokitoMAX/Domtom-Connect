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
        const canUseBilletterie = isOwner || isProfessional;
        
        const navItems = [
            { id: 'overview', label: 'ESPACE', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', path: 'mon-espace.html' }
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
        sidebarHtml += `<div class="sidebar-section-title">Le R&eacute;seau</div>`;
        networkItems.forEach(item => {
            sidebarHtml += this.renderSidebarLink(adjust(item.path), item.label, item.icon);
        });

        // Professional Tools
        sidebarHtml += `<div class="sidebar-section-title">Mes Outils</div>`;
        if (isOwner) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#success-engine'), 'Succ&egrave;s &amp; Pilotage', 'M13 10V3L4 14h7v7l9-11h-7z');
        }
        if (isProfessional) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#business'), 'Factures &amp; TJM', 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z');
        }
        if (canUseBilletterie) {
            sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#billetterie'), 'Billetterie', 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z');
        }
        sidebarHtml += this.renderSidebarLink(adjust('messages.html'), 'Messagerie (Chat)', 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z');

        // Settings
        sidebarHtml += `<div class="sidebar-section-title">Param&egrave;tres</div>`;
        sidebarHtml += this.renderSidebarLink(adjust('mon-espace.html#profile'), 'Mon Compte', 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z');
        sidebarHtml += `
            <a href="javascript:void(0)" onclick="signOut()" class="sidebar-link" title="Déconnexion">
                <div class="sidebar-icon" style="color:#ef4444;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </div>
                <span class="sidebar-label" style="color:#ef4444;">D&eacute;connexion</span>
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

    async renderTopNav() {
        // We only use this function to update the auth buttons on native HTML now.
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

        if (session) {
            const authActions = document.getElementById('nav-auth-actions');
            if (authActions) {
                // Determine prefix based on pathname
                const isSubFolder = /marketplace|registration|blog|territoires|services|a-propos|diaspora/.test(window.location.pathname);
                const prefix = window.location.protocol === 'file:' ? (isSubFolder ? '../' : '') : '/';
                const adjustPath = (p) => prefix + (p.startsWith('/') ? p.slice(1) : p);

                authActions.innerHTML = `
                    <a href="${adjustPath('mon-espace.html')}" class="cta-button secondary">Dashboard</a>
                    <a href="${adjustPath('mon-espace.html#profile')}" class="cta-button primary" style="background:#0f172a; color: white !important;">Mon Profil</a>
                `;
            }
        }
    }
};

/**
 * Global Helper for Universal Navigation Loading
 */
window.loadGlobalNavbar = async function() {
    if (window.UIComponents) {
        await window.UIComponents.renderTopNav();
        
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
