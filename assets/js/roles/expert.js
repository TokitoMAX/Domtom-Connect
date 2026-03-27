/**
 * Domtom Connect - Expert Role Module
 * Explicit logic for Expert profiles (Malt-Style)
 */
const ExpertModule = {
    role: 'expert',

    // UI Terminology & State
    initUI: () => {
        // Labels
        const labelName = document.querySelector('label[for="full_name"]');
        const labelTitle = document.querySelector('label[for="title"]');
        const labelBio = document.querySelector('label[for="bio"]');
        const labelLogo = document.querySelector('label[for="avatar_url"]');
        const labelWritten = document.querySelector('label[for="written_presentation"]');

        if (labelName) labelName.textContent = "Nom complet";
        if (labelTitle) labelTitle.textContent = "Titre Professionnel Accrocheur";
        if (labelBio) labelBio.textContent = "Ma Présentation Professionnelle (À propos)";
        if (labelLogo) labelLogo.textContent = "Photo de profil";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Consultant en Stratégie, Développeur Full-Stack...";
        if (inputBio) inputBio.placeholder = "Malt-style : Racontez votre parcours, vos compétences et ce que vous proposez.";

        // Hide redundant blocks (Unification Malt)
        const companyNameGroup = document.getElementById('company-name-group');
        const writtenParent = labelWritten ? labelWritten.parentElement : null;
        if (companyNameGroup) companyNameGroup.style.display = 'none';
        if (writtenParent) writtenParent.style.display = 'none';

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'block';
        if (videoGroup) videoGroup.style.display = 'block';
        if (portfolioCard) portfolioCard.style.display = 'block';
        if (companyFields) companyFields.style.display = 'grid';

        // Metrics & Banners
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'none';
        if (bannerCard) bannerCard.style.display = 'none';

        console.log("ExpertModule: UI Initialized (Malt-Style)");
    },

    // Public Profile Rendering
    renderPublicUI: (profileData) => {
        const nameStr = profileData.full_name || 'Expert';
        const indicatorHtml = profileData.availability === 'disponible' 
            ? `<span class="status-dot-pulse" title="Disponible" style="margin-left:10px;"></span>` 
            : '';
        
        return {
            nameHtml: `${nameStr} ${indicatorHtml}`,
            title: profileData.title || 'Expert Domtom Connect',
            roleLabel: 'Profil Expert / Talent',
            roleClass: 'expert'
        };
    }
};

window.ExpertModule = ExpertModule;
