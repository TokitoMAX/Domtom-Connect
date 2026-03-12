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
            emailRedirectTo: window.location.origin + '/registration/onboarding.html'
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
        subscription_status: data.subscription_status || 'active'
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
