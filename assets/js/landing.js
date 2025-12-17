// Landing Pages functionality

function handleLandingFormSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
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
    
    // Préparer les données au format FormData (comme le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Nouvelle inscription Landing - ${data.prenom} ${data.nom} (${data.profil || pageType})`);
    formDataToSend.append('_replyto', data.email);
    
    // Construire le message
    let messageBody = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 NOUVELLE INSCRIPTION - LANDING PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page: ${pageType}
Source: ${data.lead_source}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 INFORMATIONS PERSONNELLES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Prénom: ${data.prenom}
Nom: ${data.nom}
Email: ${data.email}
Téléphone: ${data.telephone || 'Non renseigné'}
Profil: ${data.profil || pageType}
`;
    
    if (data.services) {
        messageBody += `Services: ${data.services}\n`;
    }
    if (data.secteur) {
        messageBody += `Secteur: ${data.secteur}\n`;
    }
    if (data.besoin) {
        messageBody += `Besoin: ${data.besoin}\n`;
    }
    if (data.entreprise) {
        messageBody += `Entreprise: ${data.entreprise}\n`;
    }
    if (data.ile) {
        messageBody += `Territoire: ${data.ile}\n`;
    }
    if (data.besoin && typeof data.besoin === 'string') {
        messageBody += `\nDétails:\n${data.besoin}\n`;
    }
    
    messageBody += `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📞 PROCHAINES ÉTAPES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Contacter la personne pour un appel
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

