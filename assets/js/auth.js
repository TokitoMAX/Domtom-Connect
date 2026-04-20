// Configuration Supabase - Domtom Connect
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// Initialisation
let _supabase = null;

/**
 * Robust Supabase Initialization
 * Ensures the SDK is loaded before trying to create a client
 */
function initSupabase() {
    if (typeof supabase === 'undefined') {
        console.warn("[Auth] Supabase SDK global not found yet. Retrying via window...");
        if (typeof window.supabase === 'undefined') return null;
    }
    
    const sdk = typeof supabase !== 'undefined' ? supabase : window.supabase;
    
    if (!_supabase) {
        _supabase = sdk.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window._supabase = _supabase; // Ensure global visibility
    }
    return _supabase;
}

// Global variable initialization attempt
if (typeof supabase !== 'undefined' || typeof window.supabase !== 'undefined') {
    _supabase = initSupabase();
}

/**
 * Standard Auth Functions
 */
async function signInWithGoogle() {
    const db = _supabase || initSupabase();
    if (!db) {
        alert("Services en cours de chargement... Veuillez patienter 2 secondes et réessayer.");
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

/**
 * Profile Management
 */
async function getUserProfile(userId) {
    const db = _supabase || initSupabase();
    if (!db) return null;
    
    const { data, error } = await db
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        console.error('Error fetching profile:', error);
        return null;
    }
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

// Export to window for global access
window.initSupabase = initSupabase;
window.signInWithGoogle = signInWithGoogle;
window.signOut = signOut;
window.getUserProfile = getUserProfile;
