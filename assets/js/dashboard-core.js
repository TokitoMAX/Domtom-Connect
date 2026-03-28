/**
 * Core Dashboard Logic for Domtom Connect
 * Handles Navigation, Routing, Session, and Global Handlers.
 */

// --- 1. NAVIGATION & ROUTING ---

function showView(viewId) {
    console.log("Showing view:", viewId);
    
    // Hide all views
    const views = document.querySelectorAll('.dashboard-view');
    views.forEach(v => v.style.display = 'none');

    // Show target view
    const target = document.getElementById('view-' + viewId);
    if (target) {
        target.style.display = 'block';
    } else {
        // Fallback to overview
        const overview = document.getElementById('view-overview');
        if (overview) overview.style.display = 'block';
    }

    // Update Sidebar Active State
    const navLinks = document.querySelectorAll('.sidebar-nav-link');
    navLinks.forEach(link => {
        if (link.getAttribute('onclick') && link.getAttribute('onclick').includes(viewId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Handle initial loading of specific views if needed
    if (viewId === 'billetterie' && typeof loadMyTicketing === 'function') {
        loadMyTicketing();
    } else if (viewId === 'mes-billets' && typeof loadMyTickets === 'function') {
        loadMyTickets();
    }
}

function initRouting() {
    const hash = window.location.hash.replace('#', '') || 'overview';
    showView(hash);
}

window.addEventListener('hashchange', initRouting);
window.addEventListener('popstate', initRouting);

// --- 2. SESSION & CONTENT LOADING ---

async function checkSession() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = 'registration/login.html';
            return;
        }
        await loadDashboardContent(session);
    } catch (err) {
        console.error("Session Check Error:", err);
    }
}

async function loadDashboardContent(session) {
    const user = session.user;
    const profile = await getProfile(user.id);
    if (!profile) return;

    const userNameEl = document.getElementById('user-greeting');
    if (userNameEl) userNameEl.textContent = `Bonjour, ${profile.full_name || user.email.split('@')[0]}.`;

    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) {
        roleBadge.textContent = profile.role || 'Membre';
        roleBadge.style.display = 'inline-block';
    }

    // Update Profile Strength if applicable
    updateProfileStrength(profile);

    // Call projects load if available (from success-engine.js)
    if (typeof loadMyProjects === 'function') {
        loadMyProjects(user.id);
    }

    initRouting();
}

// --- 3. PROFILE & VISIBILITY ---

function updateProfileStrength(profile) {
    const score = calculateProfileStrength(profile);
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-percentage');
    const container = document.getElementById('profile-strength-container');
    
    if (container) container.style.display = (profile.role === 'expert') ? 'block' : 'none';
    if (strengthBar) strengthBar.style.width = score + '%';
    if (strengthText) strengthText.textContent = score + '%';
}

function calculateProfileStrength(p) {
    let score = 20; // Base score for being here
    if (p.avatar_url) score += 20;
    if (p.bio && p.bio.length > 50) score += 20;
    if (p.territory) score += 20;
    if (p.skills && p.skills.length > 0) score += 20;
    return Math.min(100, score);
}

function renderVisibilityPreview(profile) {
    const container = document.getElementById('visibility-preview-container');
    if (!container) return;

    const isListed = profile.listed || false;
    container.innerHTML = `
        <div class="dash-card ${isListed ? 'success' : 'warning'}" style="margin-top:20px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div class="card-title">Visibilité Finale</div>
                    <p class="card-desc">${isListed ? 'Votre profil est public et actif dans l\'annuaire.' : 'Votre profil est actuellement privé.'}</p>
                </div>
                <div class="status-badge ${isListed ? 'active' : 'inactive'}">
                    ${isListed ? '● PUBLIC' : '● PRIVÉ'}
                </div>
            </div>
            <button onclick="toggleListing(${isListed})" class="cta-button secondary" style="margin-top:16px;">
                ${isListed ? 'Passer en Mode Privé' : 'Activer mon Profil Public'}
            </button>
        </div>
    `;
}

// --- 4. GLOBAL ACTIONS ---

function handleLogout() {
    signOut();
}

async function toggleListing(currentStatus) {
    const newStatus = !currentStatus;
    const action = newStatus ? "republier" : "retirer de la marketplace";
    if (!confirm(`Voulez-vous vraiment ${action} votre profil ?`)) return;

    try {
        const session = await getSession();
        if (!session) return;

        const { error } = await _supabase
            .from('profiles')
            .update({ listed: newStatus })
            .eq('id', session.user.id);

        if (error) throw error;
        alert(`✅ Profil ${newStatus ? 'republié' : 'retiré'}.`);
        window.location.reload();
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

// Export functions to global scope
window.showView = showView;
window.checkSession = checkSession;
window.handleLogout = handleLogout;
window.toggleListing = toggleListing;
window.showView = showView;

// Start initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check session on load
    checkSession();

    // Mobile Navigation Toggle (if present)
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
            mobileToggle.classList.toggle('active');
        });
    }
});
