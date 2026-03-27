/**
 * Domtom Connect - Basic Role Module
 * Explicit logic for Project Holders / Basic Users
 */
const BasicModule = {
    role: 'basique',

    // UI Terminology & State
    initUI: () => {
        // Labels
        const labelName = document.querySelector('label[for="full_name"]');
        const labelTitle = document.querySelector('label[for="title"]');
        const labelBio = document.querySelector('label[for="bio"]');
        const labelLogo = document.querySelector('label[for="avatar_url"]');
        const labelWritten = document.querySelector('label[for="written_presentation"]');

        if (labelName) labelName.textContent = "Nom complet";
        if (labelTitle) labelTitle.textContent = "Expertises recherchées / Role";
        if (labelBio) labelBio.textContent = "Mon Projet & Historique";
        if (labelLogo) labelLogo.textContent = "Photo de profil";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Porteur de projet Tech, Entrepreneur...";
        if (inputBio) inputBio.placeholder = "Présentez brièvement votre profil et ce que vous recherchez sur la plateforme.";

        // Hide specific professional/company blocks
        const companyNameGroup = document.getElementById('company-name-group');
        const writtenParent = labelWritten ? labelWritten.parentElement : null;
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (companyNameGroup) companyNameGroup.style.display = 'none';
        if (writtenParent) writtenParent.style.display = 'none';
        if (tjmGroup) tjmGroup.style.display = 'none';
        if (videoGroup) videoGroup.style.display = 'none';
        if (portfolioCard) portfolioCard.style.display = 'none';
        if (companyFields) companyFields.style.display = 'none';

        console.log("BasicModule: UI Initialized (Simple Style)");
    },

    // Public Profile Rendering
    renderPublicUI: (profileData) => {
        return {
            nameHtml: profileData.full_name || 'Membre',
            title: profileData.title || 'Membre Domtom Connect',
            roleLabel: 'Porteur de Projet / Basique',
            roleClass: 'basique'
        };
    }
};

window.BasicModule = BasicModule;
