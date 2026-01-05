/**
 * Webhook Formspree → Brevo
 * 
 * Script simple pour recevoir les données de Formspree et les envoyer à Brevo
 * 
 * DÉPLOIEMENT :
 * Option 1 : Vercel (GRATUIT et simple)
 * Option 2 : Netlify Functions (GRATUIT)
 * Option 3 : Node.js sur votre serveur
 * 
 * CONFIGURATION :
 * 1. Remplacez BREVO_API_KEY par votre clé API Brevo
 * 2. Remplacez BREVO_LIST_ID par l'ID de votre liste (#3)
 * 3. Déployez le script
 * 4. Configurez Formspree pour envoyer vers l'URL du webhook
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
        const email = formspreeData.email || formspreeData.Email || '';
        const prenom = formspreeData.prenom || formspreeData.Prénom || formspreeData.prenom || '';
        const nom = formspreeData.nom || formspreeData.Nom || '';
        const profil = formspreeData.profil || formspreeData.Profil || '';
        const territoire = formspreeData.ile || formspreeData['Île/Territoire'] || formspreeData.Territoire || '';
        const newsletter = formspreeData.newsletter || formspreeData.Newsletter || '';

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

// Export pour Vercel/Netlify Functions
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

// Export pour Node.js standard (si vous utilisez Express)
export async function expressHandler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Méthode non autorisée' });
    }

    try {
        const result = await processFormspreeToBrevo(req.body);
        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error('Erreur:', error);
        return res.status(500).json({ success: false, error: error.message });
    }
}

