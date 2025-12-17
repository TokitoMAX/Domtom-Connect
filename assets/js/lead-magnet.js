// Lead Magnet functionality

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('lead-magnet-form');
    if (form) {
        form.addEventListener('submit', handleLeadMagnetSubmit);
    }
});

function handleLeadMagnetSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Get the page type (guide or checklist)
    const pageType = window.location.pathname.includes('guide-prestataires') ? 'guide-prestataires' : 'checklist-projet';
    
    // Add tracking data
    data.lead_source = 'lead-magnet';
    data.lead_magnet_type = pageType;
    data.page_url = window.location.href;
    data.timestamp = new Date().toISOString();
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: 'lead-magnet',
            type: pageType,
            email: data.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Téléchargement...';
    
    // Send to Formspree (même endpoint que le formulaire principal)
    const formDataToSend = new FormData();
    formDataToSend.append('_to', 'domtomconnect@gmail.com');
    formDataToSend.append('_subject', `🆕 Lead Magnet - ${data.prenom} ${data.nom}`);
    formDataToSend.append('_replyto', data.email);
    
    let messageBody = `Nouvelle demande de lead magnet\n\n`;
    messageBody += `Type: ${pageType}\n`;
    messageBody += `Prénom: ${data.prenom}\n`;
    messageBody += `Nom: ${data.nom}\n`;
    messageBody += `Email: ${data.email}\n`;
    messageBody += `Profil: ${data.profil}\n`;
    
    formDataToSend.append('message', messageBody);
    formDataToSend.append('Prénom', data.prenom);
    formDataToSend.append('Nom', data.nom);
    formDataToSend.append('Email', data.email);
    formDataToSend.append('Profil', data.profil);
    
    fetch('https://formspree.io/f/myzbqepy', {
        method: 'POST',
        body: formDataToSend,
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            // Simulate PDF download (in production, this would be a real PDF)
            simulatePDFDownload(pageType);
            
            // Show success message
            showSuccessMessage(form);
            
            // Redirect to full form after 3 seconds
            setTimeout(() => {
                window.location.href = '/#inscription-form';
            }, 3000);
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

function simulatePDFDownload(pageType) {
    // Create a temporary download link
    const link = document.createElement('a');
    link.href = '#'; // In production, this would be the actual PDF URL
    link.download = pageType === 'guide-prestataires' 
        ? 'Guide-Trouver-Bon-Prestataire-Domtom-Connect.pdf'
        : 'Checklist-Projet-Pret-Domtom-Connect.pdf';
    
    // Trigger download (in production, this would download the actual PDF)
    // For now, we'll just show a message
    console.log('PDF download simulated:', link.download);
}

function showSuccessMessage(form) {
    const successHTML = `
        <div class="lead-magnet-success" style="
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 1.5rem;
            border-radius: var(--border-radius);
            text-align: center;
            margin-top: 1rem;
        ">
            <h3 style="margin-bottom: 0.5rem; color: #155724;">✓ Téléchargement réussi !</h3>
            <p style="margin: 0; color: #155724;">Vérifiez votre email, le guide vous a été envoyé.</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">Redirection vers le formulaire complet...</p>
        </div>
    `;
    
    form.insertAdjacentHTML('afterend', successHTML);
    form.style.display = 'none';
}
