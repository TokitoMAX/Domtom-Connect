const crypto = require('crypto');

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    const { email, name } = req.query;

    if (!email || !name) {
        return res.status(400).json({ error: 'Paramètres email et name manquants' });
    }

    // Secret partagé (devrait être dans les variables d'environnement en production)
    const secret = process.env.PARTNER_SSO_SECRET || 'dtc_sso_default_secret_2026';
    const timestamp = Date.now().toString();
    const payload = `${email}${name}${timestamp}`;

    const signature = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

    const solopriceUrl = `https://solopricepro.vercel.app/?partner=domtomconnect&email=${encodeURIComponent(email)}&name=${encodeURIComponent(name)}&timestamp=${timestamp}&signature=${signature}`;

    return res.status(200).json({ url: solopriceUrl });
}
