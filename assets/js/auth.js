// Configuration Supabase - Domtom Connect
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// Initialisation
const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signInWithGoogle() {
    const { data, error } = await _supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/dashboard.html'
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
            emailRedirectTo: window.location.origin + '/login.html'
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
    window.location.href = '/login.html';
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
    const { data: user, error } = await _supabase.auth.updateUser({
        data: data
    });
    if (error) throw error;
    return user;
}

// Fonction utilitaire pour vérifier si l'utilisateur a déjà choisi un rôle
async function checkUserRole(session) {
    if (!session || !session.user) return null;
    return session.user.user_metadata.role || null;
}
