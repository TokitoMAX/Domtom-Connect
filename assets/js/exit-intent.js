// Exit Intent Popup functionality

let exitIntentShown = false;
let mouseY = 0;

document.addEventListener('DOMContentLoaded', function() {
    // Check if popup was already shown (cookie)
    if (getCookie('exit_intent_shown') === 'true') {
        return;
    }
    
    // Track mouse movement
    document.addEventListener('mouseout', handleMouseOut);
    document.addEventListener('mousemove', handleMouseMove);
    
    initExitIntentPopup();
});

function handleMouseMove(e) {
    mouseY = e.clientY;
}

function handleMouseOut(e) {
    // Only trigger if mouse is moving upward (toward top of page)
    if (!e.toElement && !e.relatedTarget && mouseY < 10) {
        if (!exitIntentShown) {
            showExitIntentPopup();
            exitIntentShown = true;
            setCookie('exit_intent_shown', 'true', 24); // 24 hours
        }
    }
}

function initExitIntentPopup() {
    // Create popup HTML
    const popupHTML = `
        <div class="exit-intent-overlay" id="exit-intent-overlay">
            <div class="exit-intent-popup">
                <button class="exit-intent-close" onclick="closeExitIntentPopup()" aria-label="Fermer">×</button>
                <div class="exit-intent-header">
                    <span class="exit-intent-badge">Gratuit</span>
                    <h2>Ne partez pas sans votre guide !</h2>
                    <p>Recevez gratuitement notre guide complet pour trouver le bon prestataire</p>
                </div>
                <form class="exit-intent-form" id="exit-intent-form" onsubmit="handleExitIntentSubmit(event)">
                    <input type="text" name="prenom" placeholder="Prénom" required>
                    <input type="email" name="email" placeholder="Email" required>
                    <select name="profil" required>
                        <option value="">Votre profil</option>
                        <option value="porteur-projet">Porteur de projet</option>
                        <option value="entrepreneur">Entrepreneur</option>
                        <option value="entreprise">Entreprise</option>
                        <option value="prestataire">Prestataire</option>
                    </select>
                    <button type="submit" class="cta-button primary large">
                        Télécharger le guide gratuitement
                    </button>
                    <p class="exit-intent-privacy">
                        🔒 Vos données sont sécurisées. Pas de spam.
                    </p>
                </form>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', popupHTML);
}

function showExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.add('show');
        
        // Track popup shown
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'shown',
                page: window.location.pathname
            });
        }
    }
}

function closeExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay) {
        overlay.classList.remove('show');
        
        // Track popup closed
        if (window.trackLead) {
            window.trackLead({
                source: 'exit-intent-popup',
                action: 'closed'
            });
        }
    }
}

function handleExitIntentSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Add tracking data
    data.lead_source = 'exit-intent-popup';
    data.page_url = window.location.href;
    data.timestamp = new Date().toISOString();
    
    // Track the lead
    if (window.trackLead) {
        window.trackLead({
            source: 'exit-intent-popup',
            action: 'submitted',
            email: data.email
        });
    }
    
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Téléchargement...';
    
    // Send to Formspree
    fetch('https://formspree.io/f/xpwnqgqg', {
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
                    <h3 style="color: var(--primary-color); margin-bottom: 1rem;">✓ Merci !</h3>
                    <p style="color: var(--text-secondary);">Vérifiez votre email, le guide vous a été envoyé.</p>
                    <button type="button" class="cta-button primary" onclick="closeExitIntentPopup()" style="margin-top: 1.5rem;">
                        Fermer
                    </button>
                </div>
            `;
            
            // Redirect to lead magnet page after 2 seconds
            setTimeout(() => {
                window.location.href = '/lead-magnets/guide-prestataires.html';
            }, 2000);
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

// Cookie functions
function setCookie(name, value, hours) {
    const date = new Date();
    date.setTime(date.getTime() + (hours * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Close on overlay click
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('exit-intent-overlay');
    if (overlay && e.target === overlay) {
        closeExitIntentPopup();
    }
});

// Close on ESC key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeExitIntentPopup();
    }
});
