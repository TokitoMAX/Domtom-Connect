/**
 * Webhook Formspree → Brevo
 * 
 * Déployé sur Vercel
 * URL: https://votre-projet.vercel.app/api/webhook
 */

// Configuration
const BREVO_API_KEY = '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';
const BREVO_LIST_ID = 3; // ID de votre liste (#3)
const BREVO_API_URL = 'https://api.brevo.com/v3';

/**
 * Fonction principale : Traiter les données Formspree et les envoyer à Brevo
 */
async function processFormspreeToBrevo(formspreeData) {
    try {
        console.log('Données reçues de Formspree:', formspreeData);

        // Extraire les données du formulaire
        // Formspree envoie les données avec les noms exacts du formulaire
        const email = formspreeData.Email || formspreeData.email || '';
        const prenom = formspreeData.Prénom || formspreeData.prenom || '';
        const nom = formspreeData.Nom || formspreeData.nom || '';
        const profil = formspreeData.Profil || formspreeData.profil || '';
        const territoire = formspreeData['Île/Territoire'] || formspreeData.ile || formspreeData.Territoire || '';
        const newsletter = formspreeData.Newsletter || formspreeData.newsletter || '';

        // Vérifier que l'email existe
        if (!email) {
            throw new Error('Email manquant dans les données Formspree');
        }

        // Préparer les données pour Brevo
        const contactData = {
            email: email,
            attributes: {
                PRENOM: prenom,
                NOM: nom,
                PROFIL: profil,
                TERRITOIRE: territoire,
                SOURCE: 'formulaire-principal',
                DATE_INSCRIPTION: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
            },
            listIds: [BREVO_LIST_ID],
            updateEnabled: true // Mettre à jour si le contact existe déjà
        };

        // Ajouter le tag newsletter si coché
        const tags = [];
        if (newsletter === 'yes' || newsletter === 'Oui' || newsletter === 'oui') {
            tags.push('newsletter');
        }

        // Ajouter les tags selon le profil
        if (profil) {
            tags.push(`profil-${profil}`);
        }

        // Ajouter les tags selon le territoire
        if (territoire) {
            tags.push(`territoire-${territoire}`);
        }

        // Ajouter le tag new-subscriber
        tags.push('new-subscriber');

        if (tags.length > 0) {
            contactData.tags = tags;
        }

        // Appel API Brevo pour créer/mettre à jour le contact
        const response = await fetch(`${BREVO_API_URL}/contacts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify(contactData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erreur Brevo API:', errorData);
            throw new Error(`Erreur Brevo API: ${errorData.message || 'Erreur inconnue'}`);
        }

        const result = await response.json();
        console.log('Contact ajouté/mis à jour dans Brevo:', result);

        return {
            success: true,
            email: email,
            brevoId: result.id
        };

    } catch (error) {
        console.error('Erreur lors du traitement:', error);
        throw error;
    }
}

// Handler pour Vercel Serverless Functions
export default async function handler(req, res) {
    // Vérifier la méthode HTTP
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée. Utilisez POST.' });
    }

    try {
        // Traiter les données Formspree
        const result = await processFormspreeToBrevo(req.body);

        // Retourner une réponse réussie
        return res.status(200).json({
            success: true,
            message: 'Contact ajouté à Brevo avec succès',
            data: result
        });

    } catch (error) {
        console.error('Erreur dans le handler:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Erreur lors du traitement'
        });
    }
}

