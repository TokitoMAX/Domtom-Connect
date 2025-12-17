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
    
    // Send to Formspree
    const formspreeUrl = 'https://formspree.io/f/xpwnqgqg';
    
    fetch(formspreeUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
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
            throw new Error('Erreur lors de l\'envoi');
        }
    })
    .catch(error => {
        console.error('Erreur:', error);
        alert('Une erreur est survenue. Veuillez réessayer.');
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

