/**
 * Injecteur de Navigation Mobile Premium (Domtom Connect)
 * Crée et insère dynamiquement la barre de navigation basse sur les téléphones.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Ne pas injecter si l'écran est desktop ou s'il y en a déjà une
    if (document.querySelector('.mobile-nav-injected')) return;

    // Récupère l'URL courante pour déterminer l'onglet actif
    const currentPath = window.location.pathname;
    
    // Déterminer s'il faut remonter d'un dossier (ex: depuis /marketplace/jobs.html)
    const isSubdir = currentPath.includes('/marketplace/') || currentPath.includes('/admin/');
    const basePath = isSubdir ? '../' : '';

    const navHTML = `
        <nav class="mobile-nav mobile-nav-injected">
            <a href="${basePath}mon-espace.html" class="mobile-nav-link ${currentPath.includes('mon-espace.html') || currentPath.includes('dashboard.html') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span class="mobile-nav-label">Dashboard</span>
            </a>
            
            <a href="${basePath}epopee.html" class="mobile-nav-link ${currentPath.includes('epopee.html') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
                <span class="mobile-nav-label">Épopée</span>
            </a>

            <a href="${basePath}messages.html" class="mobile-nav-link ${currentPath.includes('messages.html') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <circle cx="9" cy="10" r="1" fill="currentColor"></circle>
                    <circle cx="15" cy="10" r="1" fill="currentColor"></circle>
                </svg>
                <span class="mobile-nav-label">Messages</span>
            </a>

            <a href="${basePath}profile.html" class="mobile-nav-link ${currentPath.includes('profile.html') ? 'active' : ''}">
                <svg viewBox="0 0 24 24" fill="none" class="nav-icon" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="mobile-nav-label">Profil</span>
            </a>
        </nav>
    `;

    document.body.insertAdjacentHTML('beforeend', navHTML);
});
