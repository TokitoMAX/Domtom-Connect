// Configuration Supabase - Domtom Connect
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// Initialisation
let _supabase = null;

/**
 * Robust Supabase Initialization
 */
/**
 * Robust Supabase Initialization
 */
function initSupabase() {
    if (typeof supabase === 'undefined') {
        const sdk = window.supabase;
        if (!sdk) {
            console.warn("[Auth] Supabase SDK (supabase) not found. Retrying initialization via App orchestrator...");
            return null;
        }
    }
    
    const sdk = typeof supabase !== 'undefined' ? supabase : window.supabase;
    
    if (!window._supabase) {
        window._supabase = sdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
            global: {
                headers: {
                    'Cache-Control': 'no-cache',
                    'Pragma': 'no-cache'
                }
            }
        });
    }
    return window._supabase;
}

// Global variable initialization attempt
if (typeof supabase !== 'undefined' || typeof window.supabase !== 'undefined') {
    _supabase = initSupabase();
}

/**
 * Project Maturity Calculation
 * Computes completion percentage based on strategic fields
 */
function calculateProjectMaturity(p) {
    if (!p) return 0;
    
    const fields = [
        'title', 'territory', 'vision', 'mission', 
        'needs', 'team_description', 'funding_goal', 'cover_url'
    ];
    
    let filled = 0;
    fields.forEach(f => {
        if (p[f] && p[f].toString().trim().length > 0 && p[f] !== '...') {
            filled++;
        }
    });
    
    const percentage = (filled / fields.length) * 100;
    return Math.round(percentage);
}

/**
 * Standard Auth Functions
 */
async function signInWithGoogle() {
    const db = _supabase || initSupabase();
    if (!db) {
        alert("Services en cours de chargement... Veuillez patienter.");
        return;
    }

    persistOnboardingIntent();
    const { data, error } = await db.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/mon-espace'
        }
    });

    if (error) console.error('Error:', error.message);
}

async function signOut() {
    const db = _supabase || initSupabase();
    if (db) {
        await db.auth.signOut();
        window.location.href = '/';
    }
}

async function getUserProfile(userId) {
    const db = window._supabase || initSupabase();
    if (!db) return null;
    
    const { data, error } = await db
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) return null;
    return data;
}

function persistOnboardingIntent() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get('role');
    const territory = params.get('territory');
    if (role && territory) {
        localStorage.setItem('onboarding_intent', JSON.stringify({ role, territory, timestamp: Date.now() }));
    }
}

/**
 * Global Session Helper
 */
window.getSession = async function() {
    const db = window._supabase || initSupabase();
    if (!db) return null;
    const { data: { session } } = await db.auth.getSession();
    return session;
};

/**
 * Standard Email Auth
 */
async function signInWithEmail(email, password) {
    const db = _supabase || initSupabase();
    if (!db) throw new Error("Database not initialized");

    const { data, error } = await db.auth.signInWithPassword({
        email,
        password
    });

    if (error) throw error;
    return data;
}

async function signUpWithEmail(email, password, fullName) {
    const db = _supabase || initSupabase();
    if (!db) throw new Error("Database not initialized");

    const { data, error } = await db.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName
            }
        }
    });

    if (error) throw error;
    return data;
}

/**
 * Global Role Switching Logic
 */
async function switchRole(newRole) {
    try {
        const { data: { session } } = await window._supabase.auth.getSession();
        if (!session) throw new Error("Session expirée");

        const { error } = await window._supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', session.user.id);

        if (error) throw error;

        // Visual feedback
        if (window.Swal) {
            await Swal.fire({
                title: 'Écosystème Activé !',
                text: `Votre centre de commandement ${newRole} est prêt.`,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }

        // Reload to apply new role logic
        window.location.reload();
    } catch (err) {
        console.error("Role Switch Error:", err);
        alert("Erreur lors du changement de rôle : " + err.message);
    }
}

/**
 * Update User Profile Metadata (Sync with DB 'profiles' table)
 */
async function updateUserProfile(metadata) {
    const session = await getSession();
    if (!session) throw new Error("No active session");

    const userId = session.user.id;
    const updates = {
        id: userId,
        updated_at: new Date().toISOString(),
        ...metadata
    };

    // Handle field mapping for consistency
    if (metadata.company_name && !metadata.company) updates.company = metadata.company_name;
    if (metadata.expertise && !metadata.title) updates.title = metadata.expertise;
    if (metadata.bio && !metadata.bio_field) updates.bio = metadata.bio; // Ensure bio is mapped

    // Exclude fields not in profiles table schema to prevent schema cache errors
    delete updates.onboarding_done;
    delete updates.pending_project_name;

    const { error } = await window._supabase
        .from('profiles')
        .upsert(updates, { onConflict: 'id' });

    if (error) {
        console.error("Error updating profile:", error);
        throw error;
    }

    // Also update Auth Metadata for immediate session availability
    const { error: authError } = await window._supabase.auth.updateUser({
        data: { 
            role: metadata.role || session.user.user_metadata?.role,
            onboarding_done: true
        }
    });

    if (authError) console.warn("Auth metadata update failed:", authError);

    return { success: true };
}

window.initSupabase = initSupabase;
window.signInWithGoogle = signInWithGoogle;
window.signInWithEmail = signInWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.signOut = signOut;
window.getUserProfile = getUserProfile;
window.updateUserProfile = updateUserProfile;
window.switchRole = switchRole;
window.calculateProjectMaturity = calculateProjectMaturity;

/**
 * Fetch Unified Metrics for Businesses and Missions
 */
window.fetchBusinessStats = async (businessId) => {
    const db = _supabase || initSupabase();
    if (!db) return { views: 0, jobs: 0, applications: 0 };
    
    try {
        const { data: profile } = await db.from('profiles').select('views_count').eq('id', businessId).single();
        const { count: jobCount } = await db.from('job_offers').select('*', { count: 'exact', head: true }).eq('company_id', businessId);
        const { count: appCount } = await db.from('job_applications').select('*', { count: 'exact', head: true }).eq('company_id', businessId);
        
        return {
            views: profile?.views_count || 0,
            jobs: jobCount || 0,
            applications: appCount || 0
        };
    } catch (err) {
        console.error("[Auth] fetchBusinessStats error:", err);
        return { views: 0, jobs: 0, applications: 0 };
    }
};

