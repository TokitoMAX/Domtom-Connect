// Configuration Supabase - Domtom Connect
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// Initialisation
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signInWithGoogle() {
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/mon-projet'
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
    window.location.href = '/login';
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
        .eq('role', 'expert');

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

// Mise à jour globale de la Navbar
async function loadGlobalNavbar() {
    const session = await getSession();
    const navLinks = document.getElementById('nav-links-container');
    const navActions = document.getElementById('nav-actions-container');
    const loginLink = document.getElementById('login-link');
    const startButton = document.getElementById('start-button');

    if (session) {
        const role = await checkUserRole(session);
        const name = session.user.user_metadata.full_name || session.user.email.split('@')[0];

        // Masquer login/start si présents (fallback)
        if (loginLink) loginLink.style.display = 'none';
        if (startButton) startButton.style.display = 'none';

        // Mettre à jour le CTA SoloPrice si présent sur la page
        const solopriceCta = document.getElementById('soloprice-cta');
        if (solopriceCta) {
            solopriceCta.href = '/mon-espace';
            solopriceCta.textContent = 'Accéder à mon espace';
        }

        // Calculer le préfixe selon la profondeur
        const depth = window.location.pathname.split('/').filter(p => p).length;
        // Si c'est un fichier à la racine (ex: /index.html ou /), depth peut varier
        // Note: On utilise des chemins absolus (ex: /mon-espace) pour garantir
        // que les liens fonctionnent depuis n'importe quelle profondeur (blog, territoires).
        let prefix = '';
        if (window.location.pathname.includes('/marketplace/') ||
            window.location.pathname.includes('/registration/') ||
            window.location.pathname.includes('/landing/')) {
            prefix = '../';
        }
        if (window.location.pathname.includes('/territoires/')) {
            prefix = '../../';
        }
        // Cas spécifique pour landing avec 2 niveaux (ex: landing/porteurs-projets/index.html)
        const pathParts = window.location.pathname.split('/').filter(p => p);
        if (pathParts.length >= 2) {
            if (pathParts[0] === 'territoires' || (pathParts[0] === 'landing' && pathParts.length > 2)) {
                prefix = '../../';
            } else if (pathParts[0] === 'marketplace' || pathParts[0] === 'registration' || pathParts[0] === 'landing') {
                prefix = '../';
            }
        }

        // Liens de directory
        if (navLinks) {
            navLinks.innerHTML = `
                <a href="/marketplace/directory">Talents</a>
                <a href="/marketplace/companies">Entreprises</a>
                <a href="/marketplace/jobs">Missions</a>
                <a href="/messages" class="nav-mobile-link" style="display:none;">Messages</a>
                <a href="/profile" class="nav-mobile-link" style="display:none;">Mon Profil</a>
            `;
        }

        // Actions utilisateur (Profil + Espace + Logout)
        if (navActions) {
            navActions.innerHTML = `
                    <div class="user-menu-wrapper" style="display:flex; align-items:center; gap:16px;">
                        <a href="/profile" class="nav-user-link desktop-only" style="color:var(--text-primary); text-decoration:none; font-weight:600; font-size:0.9rem;">
                            Bonjour, ${name}
                        </a>
                        <a href="/mon-espace" class="cta-button primary" style="font-size:0.85rem; padding: 8px 16px;">
                            Mon Espace
                        </a>
                        <button onclick="signOut()" class="cta-button secondary" style="font-size:0.85rem; padding: 8px 16px;">
                            Déconnexion
                        </button>
                        <style>
                            @media (max-width: 960px) {
                                .user-menu-wrapper { flex-direction: column; width: 100%; gap: 12px !important; }
                                .user-menu-wrapper .cta-button { width: 100%; justify-content: center; }
                                .desktop-only { display: none !important; }
                                .nav-mobile-link { display: flex !important; width: 100%; justify-content: center; padding: 12px; border-radius: 8px; background: rgba(0,0,0,0.02); }
                                .navbar .container { display: flex; justify-content: space-between; align-items: center; }
                            }
                        </style>
                    </div>
                `;
        }

        // Initialize Mobile Toggle globally
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
