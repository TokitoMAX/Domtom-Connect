/**
 * Injecteur de Navigation Mobile Premium (Domtom Connect)
 * 1. Barre de navigation basse (Bottom Nav) avec 5 raccourcis.
 * 2. Menu tiroir ultra-complet (Bottom Sheet Drawer) offrant 100% de parité avec la Sidebar PC.
 */

// 1. Définition globale de la fonction de bascule
window.toggleMobileMenu = function(forceState) {
    const sheet = document.querySelector('.mobile-menu-sheet');
    const backdrop = document.getElementById('mobile-menu-backdrop');
    const toggles = document.querySelectorAll('.nav-toggle, #mobile-menu-toggle');

    if (!sheet || !backdrop) return;

    const isOpen = typeof forceState === 'boolean' ? forceState : !sheet.classList.contains('active');

    if (isOpen) {
        sheet.classList.add('active');
        backdrop.classList.add('active');
        backdrop.style.display = 'block';
        requestAnimationFrame(() => {
            backdrop.style.opacity = '1';
        });
        toggles.forEach(t => t.classList.add('active'));
        document.body.style.overflow = 'hidden';
    } else {
        sheet.classList.remove('active');
        backdrop.style.opacity = '0';
        setTimeout(() => {
            if (!sheet.classList.contains('active')) {
                backdrop.style.display = 'none';
                backdrop.classList.remove('active');
            }
        }, 300);
        toggles.forEach(t => t.classList.remove('active'));
        document.body.style.overflow = '';
    }
};

(function initMobileNav() {
    function injectNavigation() {
        // Supprimer tous les résidus de menus statiques HTML ou anciennes injections
        document.querySelectorAll('#mobile-menu-sheet, #mobile-menu-backdrop, .mobile-nav-injected').forEach(el => el.remove());

        const currentPath = window.location.pathname;
        const isSubdir = /\/(marketplace|admin|solutions|registration|blog|territoires|services|a-propos|diaspora)\//.test(currentPath);
        const basePath = isSubdir ? '../' : '';

        // Détection du rôle et profil utilisateur
        const profile = window.App && window.App.state && window.App.state.profile;
        const roleLower = (profile && profile.role || '').toLowerCase().trim();
        
        const isOwner = ['porteur', 'owner', 'porteur de projet', 'admin'].includes(roleLower);
        const isExpert = roleLower === 'expert';
        const isCompany = ['entreprise', 'company'].includes(roleLower);
        const proRoles = ['expert', 'entreprise', 'porteur', 'owner', 'porteur de projet', 'admin', 'premium', 'authority', 'club'];
        const isPro = proRoles.includes(roleLower);

        const fullName = profile ? ([profile.first_name, profile.last_name].filter(Boolean).join(' ') || profile.email || 'Mon Compte') : 'Domtom Connect';
        const roleBadge = isOwner ? 'Porteur de Projet' : isExpert ? 'Expert / Talent' : isCompany ? 'Entreprise' : 'Membre';

        // Helper pour marquer l'élément actif
        const isActive = (hrefPattern) => currentPath.includes(hrefPattern) ? 'active' : '';

        // --- HTML DU TIROIR MENU (Bottom Sheet Drawer) ---
        const drawerHTML = `
            <div id="mobile-menu-backdrop" onclick="window.toggleMobileMenu(false)" style="display:none; position:fixed; inset:0; background:rgba(15, 23, 42, 0.6); z-index:10004; backdrop-filter:blur(8px); transition:opacity 0.3s; opacity:0;"></div>

            <div id="mobile-menu-sheet" class="mobile-menu-sheet">
                <div class="sheet-handle" onclick="window.toggleMobileMenu(false)"></div>
                
                <div class="mobile-menu-header">
                    <div class="mobile-menu-title-wrap" style="display:flex; align-items:center; gap:12px;">
                        <img src="${basePath}assets/images/logo-domtomconnect.png" alt="Domtom Connect" class="mobile-menu-brand-img" style="height:34px; width:auto;">
                        <div>
                            <div class="mobile-menu-brand-name" style="font-size:1.1rem; font-weight:900; color:#0f172a; line-height:1.2;">${fullName}</div>
                            <div style="font-size:0.75rem; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:0.04em;">${roleBadge}</div>
                        </div>
                    </div>
                    <button type="button" class="close-menu-btn" onclick="window.toggleMobileMenu(false)" aria-label="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>

                <div class="mobile-menu-body">
                    <!-- SECTION 1: NAVIGATION PRINCIPALE -->
                    <div class="mobile-menu-section">
                        <div class="mobile-menu-section-label">Navigation</div>
                        <div class="mobile-menu-grid">
                            <a href="${basePath}mon-espace.html#overview" class="mobile-menu-item ${isActive('mon-espace.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-home"></i> <span>Accueil</span>
                            </a>
                            <a href="${basePath}marketplace/directory.html" class="mobile-menu-item ${isActive('directory.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-compass"></i> <span>Explorer</span>
                            </a>
                            <a href="${basePath}messages.html" class="mobile-menu-item ${isActive('messages.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-comments"></i> <span>Messagerie</span>
                            </a>
                            <a href="${basePath}billetterie.html" class="mobile-menu-item ${isActive('billetterie.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-ticket-alt"></i> <span>Événements</span>
                            </a>
                        </div>
                    </div>

                    <!-- SECTION 2: ESPACES CIBLÉS -->
                    <div class="mobile-menu-section">
                        <div class="mobile-menu-section-label">Vos Espaces</div>
                        <div class="mobile-menu-grid">
                            ${isOwner ? `
                            <a href="${basePath}pilotage.html" class="mobile-menu-item ${isActive('pilotage.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-rocket"></i> <span>Mon Épopée</span>
                            </a>
                            <a href="${basePath}tremplin.html" class="mobile-menu-item ${isActive('tremplin.html') || isActive('incubateur')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-layer-group"></i> <span>Incubateur</span>
                            </a>
                            <a href="${basePath}premium.html" class="mobile-menu-item ${isActive('premium.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-gem"></i> <span>Mentors</span>
                            </a>
                            <a href="${basePath}business.html" class="mobile-menu-item ${isActive('business.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-briefcase"></i> <span>Business</span>
                            </a>
                            ` : isExpert ? `
                            <a href="${basePath}business.html" class="mobile-menu-item ${isActive('business.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-briefcase"></i> <span>Missions & Projets</span>
                            </a>
                            <a href="${basePath}premium.html" class="mobile-menu-item ${isActive('premium.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-gem"></i> <span>Sessions Mentors</span>
                            </a>
                            <a href="${basePath}pilotage.html" class="mobile-menu-item ${isActive('pilotage.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-handshake"></i> <span>Services</span>
                            </a>
                            ` : isCompany ? `
                            <a href="${basePath}business.html" class="mobile-menu-item ${isActive('business.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-briefcase"></i> <span>Opportunités B2B</span>
                            </a>
                            <a href="${basePath}pilotage.html" class="mobile-menu-item ${isActive('pilotage.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-handshake"></i> <span>Copilotage</span>
                            </a>
                            ` : `
                            <a href="${basePath}tremplin.html" class="mobile-menu-item ${isActive('tremplin.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-rocket"></i> <span>Incubateur</span>
                            </a>
                            <a href="${basePath}business.html" class="mobile-menu-item ${isActive('business.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-briefcase"></i> <span>Espace Business</span>
                            </a>
                            `}
                        </div>
                    </div>

                    <!-- SECTION 3: MON COMPTE -->
                    <div class="mobile-menu-section">
                        <div class="mobile-menu-section-label">Mon Compte</div>
                        <div class="mobile-menu-grid">
                            ${isPro ? `
                            <a href="${basePath}vitrine.html" class="mobile-menu-item ${isActive('vitrine.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-store"></i> <span>Ma Vitrine</span>
                            </a>
                            ` : ''}
                            <a href="${basePath}profile.html" class="mobile-menu-item ${isActive('profile.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-user-circle"></i> <span>Mon Profil</span>
                            </a>
                        </div>
                    </div>

                    <!-- SECTION 4: SYSTÈME & DÉCONNEXION -->
                    <div class="mobile-menu-section">
                        <div class="mobile-menu-section-label">Système</div>
                        <div class="mobile-menu-grid">
                            <a href="${basePath}application.html" class="mobile-menu-item ${isActive('application.html')}" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-mobile-alt"></i> <span>App Mobile</span>
                            </a>
                            <a href="${basePath}index.html" class="mobile-menu-item" onclick="window.toggleMobileMenu(false)">
                                <i class="fas fa-globe"></i> <span>Site Public</span>
                            </a>
                        </div>
                        <div style="margin-top: 14px;">
                            <a href="javascript:void(0)" onclick="window.toggleMobileMenu(false); if(typeof signOut === 'function') signOut(); else window.location.href='index.html';" class="mobile-menu-item logout-item" style="width: 100%; box-sizing: border-box; justify-content: center; background: #fef2f2; border-color: #fee2e2;">
                                <i class="fas fa-sign-out-alt" style="color: #ef4444;"></i> <span style="color: #ef4444; font-weight: 800;">Déconnexion</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // --- BARRE DE NAVIGATION BASSE (Bottom Nav) ---
        let secondTabHTML = `
            <a href="${basePath}marketplace/directory.html" class="mobile-nav-link ${isActive('directory.html')}">
                <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <span class="mobile-nav-label">Explorer</span>
            </a>
        `;
        if (isOwner) {
            secondTabHTML = `
                <a href="${basePath}pilotage.html" class="mobile-nav-link ${isActive('pilotage.html') || isActive('epopee.html')}">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                    </svg>
                    <span class="mobile-nav-label">Épopée</span>
                </a>
            `;
        } else if (isExpert || isCompany) {
            secondTabHTML = `
                <a href="${basePath}business.html" class="mobile-nav-link ${isActive('business.html')}">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span class="mobile-nav-label">Business</span>
                </a>
            `;
        }

        const bottomNavHTML = `
            <nav class="mobile-nav mobile-nav-injected">
                <a href="${basePath}mon-espace.html" class="mobile-nav-link ${isActive('mon-espace.html') || isActive('dashboard.html')}">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    <span class="mobile-nav-label">Accueil</span>
                </a>
                
                ${secondTabHTML}

                <a href="${basePath}messages.html" class="mobile-nav-link ${isActive('messages.html')}">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span class="mobile-nav-label">Messages</span>
                </a>

                <a href="${basePath}profile.html" class="mobile-nav-link ${isActive('profile.html')}">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span class="mobile-nav-label">Profil</span>
                </a>

                <a href="javascript:void(0)" onclick="window.toggleMobileMenu()" class="mobile-nav-link">
                    <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                    <span class="mobile-nav-label">Menu</span>
                </a>
            </nav>
        `;

        document.body.insertAdjacentHTML('beforeend', drawerHTML + bottomNavHTML);

        // Attachement automatique aux boutons d'ouverture
        document.querySelectorAll('.nav-toggle, #mobile-menu-toggle').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                window.toggleMobileMenu();
            };
        });
    }

    window.rebuildMobileNav = injectNavigation;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectNavigation);
    } else {
        injectNavigation();
    }
})();
