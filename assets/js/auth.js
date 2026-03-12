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
        subscription_status: data.subscription_status || 'active',
        is_email_verified: data.is_email_verified !== undefined ? data.is_email_verified : false
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

// Fonction utilitaire pour envoyer un email de validation via Brevo
async function sendVerificationEmail(email, fullName, userId) {
    const BREVO_API_KEY = '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';
    const validationLink = window.location.origin + `/registration/confirm-email.html?uid=${userId}`;

    const emailData = {
        sender: { name: "Domtom Connect", email: "domtomconnect@gmail.com" },
        to: [{ email: email, name: fullName }],
        subject: "Validez votre compte Domtom Connect",
        htmlContent: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                <h2 style="color: #00BFA6; text-align: center;">Bienvenue sur Domtom Connect !</h2>
                <p>Bonjour ${fullName},</p>
                <p>Merci de rejoindre notre réseau d'expertise stratégique. Pour activer votre compte et accéder à votre dashboard, veuillez valider votre adresse email en cliquant sur le bouton ci-dessous :</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${validationLink}" style="background-color: #00BFA6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Valider mon email</a>
                </div>
                <p style="color: #64748b; font-size: 0.9rem;">Si le bouton ne fonctionne pas, vous pouvez copier et coller ce lien dans votre navigateur :<br>${validationLink}</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;">
                <p style="font-size: 0.8rem; color: #94a3b8; text-align: center;">L'équipe Domtom Connect</p>
            </div>
        `
    };

    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(emailData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email');
        }

        console.log("Email de validation envoyé à:", email);
    } catch (err) {
        console.error("Erreur Brevo:", err);
    }
}

// Fonction utilitaire pour vérifier si l'utilisateur a déjà choisi un rôle
async function checkUserRole(session) {
    if (!session || !session.user) return null;
    return session.user.user_metadata.role || null;
}
