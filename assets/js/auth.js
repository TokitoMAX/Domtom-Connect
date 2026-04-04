// Configuration Supabase - Domtom Connect
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// Initialisation
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
window._supabase = _supabase; // Expose for console debugging

async function signInWithGoogle() {
    // Sauvegarder l'intention avant redirection si présente dans l'URL
    persistOnboardingIntent();
    
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/mon-espace'
        }
    });
    if (error) throw error;
}

async function signUpWithEmail(email, password, fullName) {
    const { data, error } = await _supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            },
            emailRedirectTo: window.location.origin + '/registration/onboarding'
        }
    });
    if (error) throw error;
    return data;
}

async function signInWithEmail(email, password) {
    const { data, error } = await _supabase.auth.signInWithPassword({
        email,
        password
    });
    if (error) throw error;
    return data;
}

async function signOut() {
    const { error } = await _supabase.auth.signOut();
    if (error) console.error('Erreur Déconnexion:', error.message);
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    window.location.href = isLocal ? '/login.html' : '/login';
}

async function getSession() {
    const { data: { session }, error } = await _supabase.auth.getSession();
    if (error) {
        console.error("Erreur session:", error.message);
        return null;
    }
    return session;
}

async function updateUserProfile(data) {
    // Met à jour les métadonnées d'authentification
    const { data: user, error } = await _supabase.auth.updateUser({
        data: data
    });
    if (error) throw error;

    // Synchronise aussi dans la table publique profiles
    const session = await getSession();
    if (session) {
        await upsertProfile(session.user.id, data);
    }
    return user;
}

// Écrit ou met à jour le profil dans la table Supabase `profiles`
async function upsertProfile(userId, data) {
    const profileData = {
        id: userId,
        full_name: data.full_name,
        role: data.role,
        skills: data.skills || null,
        tjm: data.tjm ? parseInt(data.tjm) : null,
        territory: data.territory || null,
        bio: data.bio || null,
        company_name: data.company_name || null,
        needs: data.needs || null,
        subscription_tier: data.subscription_tier || 'free',
        subscription_status: data.subscription_status || 'active',
        domtom_verified: data.domtom_verified !== undefined ? data.domtom_verified : undefined
    };

    // Supprimer les clés undefined pour ne pas écraser les données existantes
    Object.keys(profileData).forEach(key => {
        if (profileData[key] === undefined) delete profileData[key];
    });

    const { error } = await _supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'id' });

    if (error) console.error('Erreur upsert profile:', error.message);
}

// Lit le profil complet d'un utilisateur depuis la table profiles
async function getProfile(userId) {
    const { data, error } = await _supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data;
}

// Retourne la liste des experts validés pour l'annuaire
async function getExperts({ territory } = {}) {
    let query = _supabase
        .from('profiles')
        .select('*')
        .eq('role', 'expert')
        .neq('full_name', 'Domtom Connect'); // Exclure le profil système/test de l'annuaire

    if (territory) {
        query = query.eq('territory', territory);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
}

// Fonction utilitaire pour vérifier si l'utilisateur a déjà choisi un rôle
async function checkUserRole(session) {
    if (!session || !session.user) return null;
    return session.user.user_metadata.role || null;
}

/**
 * Calcule le score de maturité d'un projet (0-100)
 * Unifiée pour tout l'écosystème Domtom Connect.
 */
/**
 * Calcule le score de maturité d'un projet (0-100)
 * Aligné sur le parcours premium en 5 phases : Stratégie -> Arsenal -> Boussole -> Sûreté -> Orbite.
 */
function calculateProjectMaturity(p) {
    if (!p) return 0;
    let score = 0;

    // Phase 01: Stratégie (Titre + Vision + Mission + Enjeu)
    if (p.title && p.title !== 'Nouvelle Épopée') score += 5;
    
    // Support tant pour les nouveaux champs que pour l'ancien système de description
    if (p.vision && p.vision.length > 20) {
        score += 5;
    } else if (p.description && p.description.includes('[[VISION]]')) {
        score += 5;
    }

    if (p.mission && p.mission.length > 20) {
        score += 5;
    } else if (p.description && p.description.includes('[[MISSION]]')) {
        score += 5;
    }

    if (p.enjeu && p.enjeu.length > 20) {
        score += 5;
    } else if (p.description && p.description.includes('[[PROBLEM]]')) {
        score += 5;
    }

    // PHASE 2 : ARSENAL (BESOINS) - 20 pts
    if (p.needs && p.needs.length > 10) score += 20;

    // PHASE 3 : BOUSSOLE (FINANCE) - 20 pts
    if (p.funding_goal && p.funding_goal > 0) score += 5;
    if (p.milestones_count > 0) score += 10;
    if (p.rewards_count > 0) score += 5;

    // PHASE 4 : SÛRETÉ (COMPLIANCE) - 20 pts
    if (p.identity_verified) score += 10;
    if (p.siret && p.siret.length > 5) score += 5;
    if (p.social_links) score += 5;

    // PHASE 5 : ORBITE (LANCEMENT) - 20 pts
    if (p.video_url) score += 5;
    if (p.is_listed) score += 15;

    const finalScore = Math.min(100, score);
    
    // Sync with dashboard badge if present
    const dashBadge = document.getElementById('epopee-score-badge');
    if (dashBadge) dashBadge.textContent = finalScore + '%';

    return finalScore;
}

/**
 * Retourne le label de statut selon le score de maturité
 * Adapté au Fundraising Cockpit (5 phases)
 */
function getProjectStatus(score) {
    if (score < 20) return { label: "Stratégie", step: 1, next: "Arsenal" };
    if (score < 40) return { label: "Arsenal", step: 2, next: "Boussole" };
    if (score < 60) return { label: "Boussole", step: 3, next: "Sûreté" };
    if (score < 80) return { label: "Sûreté", step: 4, next: "Orbite" };
    if (score < 100) return { label: "Prêt pour Orbite", step: 5, next: "Lancement" };
    return { label: "Épopée Certifiée", step: 5, next: "Déployé" };
}

// Exposition globale
window.calculateProjectMaturity = calculateProjectMaturity;
window.getProjectStatus = getProjectStatus;

// Mise à jour globale de la Navbar
let isNavbarProcessed = false;
async function loadGlobalNavbar() {
    if (isNavbarProcessed) return; // Éviter l'exécution double
    
    const session = await getSession();
    const navLinks = document.getElementById('nav-links-container');
    const navActions = document.getElementById('nav-actions-container');
    
    if (navLinks) navLinks.innerHTML = '';
    if (navActions) navActions.innerHTML = '';

    const loginLink = document.getElementById('login-link');
    const startButton = document.getElementById('start-button');
    
    isNavbarProcessed = true;

    if (session) {
        const meta = session.user.user_metadata || {};
        const role = meta.role || null;
        const name = meta.full_name || (session.user.email ? session.user.email.split('@')[0] : 'Membre');

        // Masquer login/start si présents (fallback)
        if (loginLink) loginLink.style.display = 'none';
        if (startButton) startButton.style.display = 'none';

        // Mettre à jour le CTA SoloPrice si présent sur la page
        const solopriceCta = document.getElementById('soloprice-cta');
        if (solopriceCta) {
            solopriceCta.href = '/mon-espace';
            solopriceCta.textContent = 'Accéder à mon espace';
        }

        // Liens de directory (Strategic regrouping)
        // Détection d'environnement robuste (Local vs Prod/Vercel)
        const isLocal = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' || 
                        window.location.hostname.startsWith('192.168.') || 
                        window.location.port !== '';
        
        const ext = isLocal ? '.html' : '';

        if (navLinks) {
            navLinks.innerHTML = `
                <a href="/marketplace/directory${ext}" class="nav-market-link">Talents</a>
                <a href="/marketplace/jobs${ext}" class="nav-market-link">Missions</a>
                <a href="/marketplace/projects${ext}" class="nav-market-link">Projets</a>
                <a href="/marketplace/evenements${ext}" class="nav-market-link">Événements</a>
                <a href="/marketplace/companies${ext}" class="nav-market-link">Entreprises</a>
            `;
        }

        // Actions utilisateur (Profil + Espace + Logout) - Improved for premium feel
        if (navActions) {
            navActions.innerHTML = `
                    <div class="user-menu-wrapper" style="display:flex; align-items:center; gap:16px;">
                        <a href="/profile${ext}" class="nav-user-link desktop-only" style="color:var(--text-primary); text-decoration:none; font-weight:600; font-size:0.9rem; transition: color 0.2s;">
                            Bonjour, ${name}
                        </a>
                        <a href="/mon-espace${ext}" class="cta-button primary" style="font-size:0.85rem; padding: 8px 16px;">
                            Mon Espace
                        </a>
                        <button onclick="signOut()" class="cta-button secondary" style="font-size:0.85rem; padding: 8px 16px;">
                            Déconnexion
                        </button>
                    </div>
                `;
        }

        // Initialize Mobile Toggle globally (Moved outside session block)
        initNavToggle();
    } else {
        // Fallback for non-logged in users (ensure toggle works for guests)
        initNavToggle();
    }
}

function initNavToggle() {
    const navToggle = document.querySelector('.nav-toggle');
    const navContent = document.querySelector('.nav-content');
    if (navToggle && navContent) {
        // Remove existing listener if any to avoid double triggers
        const newToggle = navToggle.cloneNode(true);
        navToggle.parentNode.replaceChild(newToggle, navToggle);

        newToggle.addEventListener('click', () => {
            const isOpen = navContent.classList.toggle('is-open');
            newToggle.classList.toggle('is-open', isOpen);
            newToggle.setAttribute('aria-expanded', isOpen);
        });
    }
}

// Re-init on DOMContentLoaded for pages that load it statically
document.addEventListener('DOMContentLoaded', initNavToggle);

// ── Auto-load notification system on all authenticated pages ──
(function loadNotifications() {
    if (document.querySelector('script[src*="notifications.js"]')) return;
    const s = document.createElement('script');
    // Resolve path relative to auth.js itself (works at any depth)
    const basePath = (() => {
        const scripts = document.querySelectorAll('script[src]');
        for (const sc of scripts) {
            if (sc.src && sc.src.includes('auth.js')) {
                return sc.src.replace(/auth\.js.*$/, '');
            }
        }
        return '/assets/js/';
    })();
    s.src = basePath + 'notifications.js?v=1.0';
    s.async = true;
    document.head.appendChild(s);
})();
// ── Système de persistance de l'intention (Onboarding Fluide) ──
function persistOnboardingIntent() {
    try {
        const params = new URLSearchParams(window.location.search);
        const role = params.get('role');
        const plan = params.get('plan');

        if (role) {
            localStorage.setItem('onboarding_role', role);
            console.log("Onboarding: Rôle sauvegardé (" + role + ")");
        }
        if (plan) {
            localStorage.setItem('onboarding_plan', plan);
            console.log("Onboarding: Plan sauvegardé (" + plan + ")");
        }
    } catch (e) {
        console.error("Erreur lors de la persistance de l'intention:", e);
    }
}

// Capturer l'intention dès le chargement de n'importe quelle page incluant auth.js
document.addEventListener('DOMContentLoaded', () => {
    persistOnboardingIntent();
    // Auto-load navbar if not already handled by the page script
    loadGlobalNavbar();
});
