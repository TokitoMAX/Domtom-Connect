/**
 * Core Dashboard Logic for Domtom Connect
 * Handles Navigation, Routing, Session, and Global Handlers (Shell)
 */

// --- 1. CONFIGURATION GLOBALE ---
window.isAdminInspection = window.isAdminInspection || false;
let currentSREProject = null;
window.isEditing = false;
let originalProfileData = null;
window.activeBusinessId = null;

// --- 2. INITIALISATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // Initialisation du cockpit (Session + Profil + Routage)
    await checkSession();

    // Vérification des invitations et collaborations en arrière-plan
    const session = window.currentSession;
    if (session && session.user) {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteId = urlParams.get('invite');
        if (inviteId) {
            await window.handleInviteToken(inviteId, session.user);
        }

        const collabs = await window.checkCollaborations(session.user.email);
        if (collabs && collabs.length > 0) {
            setTimeout(() => window.renderCollaborationSwitch(collabs), 1000);
        }
    }
});

/**
 * Gestion du routage centralisé (MODULAIRE)
 */
function showView(viewId, forceRender = false) {
    if (window.location.hash !== `#${viewId}` && !viewId.includes('?') && !forceRender) {
        window.location.hash = viewId;
        return;
    }

    let baseView = viewId;
    let params = {};
    if (viewId.includes('?')) {
        const parts = viewId.split('?');
        baseView = parts[0];
        const searchParams = new URLSearchParams(parts[1]);
        searchParams.forEach((v, k) => params[k] = v);
    }

    // 1. Masquer TOUTES les sections (Vue Clean)
    const views = ['overview-view', 'success-engine-view-fixed', 'billetterie-view', 'missions-view', 'business-view', 'collaboration-view', 'mes-billets-view', 'profile-view'];
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    if (baseView === 'profile') {
        window.location.href = '/profile';
        return;
    }

    // 2. DÉLÉGATION AU MODULE D'ÉCOSYSTÈME
    const activeModule = getActiveModule();
    if (activeModule && typeof activeModule.route === 'function') {
        console.log(`[Dashboard] Delegating '${baseView}' to active module.`);
        activeModule.route(baseView, null, window.userProfile, window.currentSession);
    }

    // 3. Synchronisation UI (Headers, Navbar)
    const isOverview = baseView === 'overview';
    const overviewView = document.getElementById('overview-view');
    const greeting = document.querySelector('.dash-section-header');
    const topNav = document.querySelector('.top-nav');

    if (overviewView) overviewView.style.display = isOverview ? 'block' : 'none';
    if (greeting) greeting.style.display = isOverview ? 'block' : 'none';
    
    // Top Nav reste visible sur les écosystèmes standard
    if (topNav) topNav.style.display = 'flex';

    // 4. Mise à jour de l'état actif des liens
    const navLinks = document.querySelectorAll('.sidebar-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        const isActive = (href === `#${baseView}` || href === baseView || (link.onclick && link.onclick.toString().includes(`'${baseView}'`)));
        link.classList.toggle('active', !!isActive);
    });

    window.scrollTo(0, 0);
}

/**
 * Détermination du module actif selon le rôle
 */
function getActiveModule() {
    const role = window.activeRole || (window.userProfile && window.userProfile.role) || 'user';
    switch (role) {
        case 'expert':
        case 'prestataire': return window.ExpertsModule;
        case 'entreprise': return window.CompaniesModule;
        case 'porteur':
        case 'owner': return window.OwnersModule;
        default: return window.StandardModule;
    }
}

function handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'overview';
    showView(hash, true);
}

window.addEventListener('hashchange', handleRouting);

/**
 * --- SESSION & DATA LOADING ---
 */
async function checkSession() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = '/login.html';
            return;
        }
        window.currentSession = session;
        await loadDashboardContent(session);
    } catch (err) {
        console.error("Session Check Error:", err);
    }
}

async function loadDashboardContent(session) {
    const user = session.user;
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    
    let profile = await getProfile(user.id);
    if (!profile) {
        window.location.href = 'registration/onboarding';
        return;
    }

    window.userProfile = profile;
    window.activeRole = (profile && profile.role) ? profile.role : 'user';
    if (user.email === 'domtomconnect@gmail.com') window.activeRole = 'admin';

    // UI Greeting
    const greetingEl = document.getElementById('user-greeting');
    if (greetingEl) greetingEl.textContent = `Bonjour, ${name}`;

    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) renderRoleBadge(roleBadge, window.activeRole);

    // Initialisation du routage
    handleRouting();
    renderMobileNav(window.activeRole);

    // Isolation Sidebar pour Explorateurs
    const isSpecialist = ['expert', 'prestataire', 'entreprise', 'porteur', 'owner', 'admin'].includes(window.activeRole);
    if (!isSpecialist) {
        const titles = document.querySelectorAll('.sidebar-section-title');
        titles.forEach(t => {
            if (t.textContent === "Mon Pilotage") t.style.display = 'none';
        });
        const successLink = document.getElementById('nav-success-engine');
        if (successLink) successLink.parentElement.style.display = 'none';
    }
}

function renderRoleBadge(el, role) {
    const roleColors = {
        'expert': { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981', text: 'PROFIL EXPERT' },
        'admin': { bg: '#0f172a', color: 'white', text: 'ADMINISTRATEUR' },
        'entreprise': { bg: 'rgba(2, 132, 199, 0.1)', color: '#0284c7', text: 'ENTREPRISE' },
        'owner': { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', text: 'PORTEUR DE PROJET' }
    };
    const config = roleColors[role] || { bg: '#f1f5f9', color: '#64748b', text: 'EXPLORATEUR' };
    
    el.style.background = config.bg;
    el.style.color = config.color;
    el.textContent = config.text;
    el.style.display = 'inline-block';
    el.style.textTransform = 'uppercase';
    el.style.fontWeight = '800';
    el.style.fontSize = '0.7rem';
    el.style.padding = '4px 12px';
    el.style.borderRadius = '100px';
}

function renderMobileNav(role) {
    const nav = document.getElementById('site-nav');
    if (!nav) return;
    
    const isPro = ['admin', 'expert', 'entreprise'].includes(role);
    const navHTML = `
        <div style="display: flex; justify-content: space-around; width: 100%; align-items: center; padding: 12px 0; background: #0f172a; border-radius: 20px 20px 0 0; box-shadow: 0 -10px 25px rgba(0,0,0,0.2);">
            <a href="#overview" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: white; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                Dashboard
            </a>
            <a href="/marketplace/directory" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
                Talents
            </a>
            <a href="/marketplace/jobs.html" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
                Missions
            </a>
            <a href="#billetterie" class="mobile-nav-link" style="display:flex; flex-direction:column; align-items:center; color: #94a3b8; text-decoration:none; font-size: 0.6rem; font-weight: 800; gap: 4px;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 5v2"/><path d="M15 11v2"/><path d="M15 17v2"/><path d="M5 5h14a2 2 0 012 2v3a2 2 0 000 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 000-4V7a2 2 0 012-2z"/></svg>
                Billets
            </a>
        </div>
    `;
    nav.innerHTML = navHTML;
}

// Global Handlers
window.handleLogout = () => signOut();
window.showView = showView;
window.checkSession = checkSession;
