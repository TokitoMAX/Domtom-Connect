/**
 * Script d'intégration Formspree → Brevo
 * 
 * À utiliser si vous préférez l'API directe plutôt que Zapier
 * 
 * INSTRUCTIONS :
 * 1. Remplacer BREVO_API_KEY par votre clé API Brevo
 * 2. Remplacer LIST_ID par l'ID de votre liste Brevo
 * 3. Configurer ce script comme webhook dans Formspree
 * 
 * Pour obtenir votre API Key Brevo :
 * - Aller dans Brevo → Paramètres → API Keys
 * - Créer une nouvelle clé : "Domtom Connect Integration"
 * 
 * Pour obtenir l'ID de votre liste :
 * - Aller dans Brevo → Contacts → Listes
 * - Cliquer sur votre liste → L'ID est dans l'URL
 */

// Configuration
const BREVO_API_KEY = 'VOTRE_CLE_API_BREVO_ICI';
const BREVO_LIST_ID = 'VOTRE_ID_LISTE_ICI';
const BREVO_API_URL = 'https://api.brevo.com/v3';

/**
 * Fonction principale : Ajouter un contact à Brevo
 */
async function addContactToBrevo(formData) {
    try {
        // Préparer les données pour Brevo
        const contactData = {
            email: formData.email,
            attributes: {
                PRENOM: formData.prenom || '',
                NOM: formData.nom || '',
                PROFIL: formData.profil || '',
                TERRITOIRE: formData.ile || formData.territoire || '',
                SOURCE: formData.source || 'formulaire-principal',
                DATE_INSCRIPTION: new Date().toISOString().split('T')[0] // Format YYYY-MM-DD
            },
            listIds: [parseInt(BREVO_LIST_ID)],
            updateEnabled: true // Mettre à jour si le contact existe déjà
        };

        // Ajouter le tag newsletter si coché
        if (formData.newsletter === 'yes' || formData.newsletter === 'Oui') {
            contactData.tags = ['newsletter'];
        }

        // Appel API Brevo
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
            throw new Error(`Erreur Brevo API: ${errorData.message || 'Erreur inconnue'}`);
        }

        const result = await response.json();
        console.log('Contact ajouté à Brevo:', result);
        return result;

    } catch (error) {
        console.error('Erreur lors de l\'ajout du contact à Brevo:', error);
        throw error;
    }
}

/**
 * Fonction pour ajouter des tags selon le profil
 */
async function addTagsToContact(email, profil, territoire) {
    try {
        const tags = [];

        // Tag selon le profil
        if (profil) {
            tags.push(`profil-${profil}`);
        }

        // Tag selon le territoire
        if (territoire) {
            tags.push(`territoire-${territoire}`);
        }

        // Tag "new-subscriber"
        tags.push('new-subscriber');

        if (tags.length === 0) {
            return;
        }

        // Ajouter les tags au contact
        const response = await fetch(`${BREVO_API_URL}/contacts/${encodeURIComponent(email)}/tags`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': BREVO_API_KEY
            },
            body: JSON.stringify({ tags: tags })
        });

        if (!response.ok) {
            console.warn('Erreur lors de l\'ajout des tags:', await response.text());
        }

    } catch (error) {
        console.error('Erreur lors de l\'ajout des tags:', error);
    }
}

/**
 * Fonction pour traiter les données Formspree
 * 
 * À appeler depuis votre webhook Formspree
 */
async function processFormspreeWebhook(formspreeData) {
    try {
        // Extraire les données du formulaire Formspree
        const formData = {
            email: formspreeData.email || formspreeData.Email,
            prenom: formspreeData.prenom || formspreeData.Prénom,
            nom: formspreeData.nom || formspreeData.Nom,
            profil: formspreeData.profil || formspreeData.Profil,
            ile: formspreeData.ile || formspreeData['Île/Territoire'] || formspreeData.Territoire,
            newsletter: formspreeData.newsletter || formspreeData.Newsletter,
            source: 'formulaire-principal'
        };

        // Ajouter le contact à Brevo
        await addContactToBrevo(formData);

        // Ajouter les tags
        if (formData.profil && formData.ile) {
            await addTagsToContact(formData.email, formData.profil, formData.ile);
        }

        console.log('Contact traité avec succès:', formData.email);
        return { success: true, email: formData.email };

    } catch (error) {
        console.error('Erreur lors du traitement:', error);
        throw error;
    }
}

// Export pour utilisation dans Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        addContactToBrevo,
        addTagsToContact,
        processFormspreeWebhook
    };
}

// Exemple d'utilisation dans un webhook (Node.js/Express)
/*
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook/formspree', async (req, res) => {
    try {
        const result = await processFormspreeWebhook(req.body);
        res.json({ success: true, result });
    } catch (error) {
        console.error('Erreur webhook:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});
*/

