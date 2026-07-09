// Webhook désactivé car Brevo n'est plus utilisé.
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
    }
    // On renvoie 200 OK pour ne pas créer d'erreurs chez Formspree
    return res.status(200).json({
        success: true,
        message: 'Webhook désactivé, aucune action effectuée.'
    });
}

