// Configuration Supabase-Client (MVP)
// À remplacer par vos propres clés Supabase
const SUPABASE_URL = 'https://your-project-url.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// Initialisation (à inclure via CDN dans les fichiers HTML)
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin + '/dashboard.html'
        }
    });

    if (error) console.error('Erreur Auth:', error.message);
}

async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Erreur Déconnexion:', error.message);
    window.location.href = '/login.html';
}

async function getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
}
