// Landing Pages functionality

// Initialiser le suivi du temps de remplissage pour tous les formulaires de landing
document.addEventListener('DOMContentLoaded', function() {
    const landingForm = document.getElementById('landing-form');
    if (landingForm && window.formSecurity) {
        window.formSecurity.initFillTimeTracking(landingForm);
    }
});

function handleLandingFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Vérification de sécurité (anti-bot)
    if (window.formSecurity) {
        const securityCheck = window.formSecurity.secureFormSubmission(form, data);
        if (!securityCheck.success) {
            // Afficher les erreurs de sécurité
            const errorMessage = securityCheck.errors.join('\n');
            alert(errorMessage);
            return;
        }
    }
    
    // Get landing page type
    const pageType = window.location.pathname.includes('prestataires') ? 'prestataires' :
                     window.location.pathname.includes('porteurs-projets') ? 'porteurs-projets' :
                     'entreprises';
    
    // Add tracking data
    data.lead_source = `landing-${pageType}`;
    data.page_url = window.location.href;
    data.timestamp = new Date().toISOString();
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: `landing-${pageType}`,
            type: pageType,
            email: data.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Envoi en cours...';
    
    // Send to Formspree (même endpoint que le formulaire principal)
    const formspreeUrl = 'https://formspree.io/f/myzbqepy';
    
    // Déterminer le profil clairement
    const profil = data.profil || pageType;
    let profilLabel = '';
    if (profil === 'entreprise' || pageType === 'entreprises') {
        profilLabel = '🏢 ENTREPRISE';
    } else if (profil === 'prestataire' || pageType === 'prestataires') {
        profilLabel = '💼 PRESTATAIRE';
    } else if (profil === 'porteur-projet' || pageType === 'porteurs-projets') {
        profilLabel = '🚀 PORTEUR DE PROJET';
    } else {
        profilLabel = '👤 ' + profil.toUpperCase();
    }
    
    // Préparer les données au format FormData (comme le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `${profilLabel} - ${data.entreprise ? data.entreprise + ' - ' : ''}${data.prenom} ${data.nom}`);
    formDataToSend.append('_replyto', data.email);
    
    // Construire le message de manière claire selon le profil
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${profilLabel} - NOUVELLE INSCRIPTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Source: Landing Page ${pageType}
Date: ${new Date().toLocaleString('fr-FR')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 CONTACT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Territoire: ${data.ile || 'Non renseigné'}
`;
    
    // Informations spécifiques selon le profil
    if (data.entreprise) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏢 ENTREPRISE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Nom de l'entreprise: ${data.entreprise}
`;
    }
    
    if (data.services) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 SERVICES PROPOSÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.services}
`;
    }
    
    if (data.secteur) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏭 SECTEUR D'ACTIVITÉ
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.secteur}
`;
    }
    
    if (data.besoin) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 BESOIN PRINCIPAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.besoin}
`;
    }
    
    if (data.besoin && typeof data.besoin === 'string' && data.besoin.length > 50) {
        messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📝 DÉTAILS DU PROJET
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${data.besoin}
`;
    }
    
    messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter ${data.prenom} ${data.nom}${data.entreprise ? ' (' + data.entreprise + ')' : ''} pour un appel
2. Après l'appel, décider (oui/non)
3. Si oui, ajouter à l'écosystème WhatsApp

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    formDataToSend.append('message', messageBody);
    
    // Données structurées
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Téléphone', data.telephone || '');
    formDataToSend.append('Profil', data.profil || pageType);
    if (data.services) formDataToSend.append('Services', data.services);
    if (data.secteur) formDataToSend.append('Secteur', data.secteur);
    if (data.ile) formDataToSend.append('Territoire', data.ile);
    if (data.entreprise) formDataToSend.append('Entreprise', data.entreprise);
    
    fetch(formspreeUrl, {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Show success message
            form.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem; font-size: 1.5rem;">✓ Inscription réussie !</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 1.5rem;">Merci ! Nous vous contacterons très prochainement.</p>
                    <a href="/" class="cta-button primary">Retour à l'accueil</a>
                </div>
            `;
        } else {
            return response.json().then(errData => {
                throw new Error(errData.error || 'Erreur lors de l\'envoi');
            });
        }
    })
    .catch(error => {
        console.error('Erreur détaillée:', error);
        // Message d'erreur plus informatif
        const errorMessage = error.message || 'Une erreur est survenue. Veuillez réessayer ou nous contacter directement.';
        alert(errorMessage);
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

