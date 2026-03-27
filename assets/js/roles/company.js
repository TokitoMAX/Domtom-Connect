/**
 * Domtom Connect - Company Role Module
 * Explicit logic for Enterprise / Institution profiles
 */
const CompanyModule = {
    role: 'entreprise',

    // UI Terminology & State
    initUI: () => {
        // Labels
        const labelName = document.querySelector('label[for="full_name"]');
        const labelTitle = document.querySelector('label[for="title"]');
        const labelBio = document.querySelector('label[for="bio"]');
        const labelLogo = document.querySelector('label[for="avatar_url"]');
        const labelWritten = document.querySelector('label[for="written_presentation"]');

        if (labelName) labelName.textContent = "Nom de l'Entreprise / Institution";
        if (labelTitle) labelTitle.textContent = "Secteur d'Activité principal";
        if (labelBio) labelBio.textContent = "Présentation Institutionnelle (Vision & Offre)";
        if (labelLogo) labelLogo.textContent = "Logo de l'entreprise";

        // Placeholders
        const inputTitle = document.getElementById('title');
        const inputBio = document.getElementById('bio');
        if (inputTitle) inputTitle.placeholder = "Ex : Conseil Juridique, Agence Marketing...";
        if (inputBio) inputBio.placeholder = "Un récit unifié : Présentez votre mission, votre engagement et vos services phares en un seul texte structuré.";

        // UI Controls
        const companyNameGroup = document.getElementById('company-name-group');
        const writtenParent = labelWritten ? labelWritten.parentElement : null;
        if (companyNameGroup) companyNameGroup.style.display = 'block';
        if (writtenParent) writtenParent.style.display = 'none'; // Unification Malt

        // Layout blocks
        const tjmGroup = document.getElementById('tjm-group');
        const videoGroup = document.getElementById('video-presentation-group');
        const portfolioCard = document.getElementById('portfolio-card');
        const companyFields = document.getElementById('company-specific-fields');

        if (tjmGroup) tjmGroup.style.display = 'none';
        if (videoGroup) videoGroup.style.display = 'block';
        if (portfolioCard) portfolioCard.style.display = 'block';
        if (companyFields) companyFields.style.display = 'grid';

        // Metrics & Banners (Institutional Mode)
        const metricsRow = document.getElementById('metrics-row');
        const bannerCard = document.getElementById('banner-card');
        if (metricsRow) metricsRow.style.display = 'flex';
        if (bannerCard) bannerCard.style.display = 'block';

        console.log("CompanyModule: UI Initialized (Institutional Style)");
    },

    // Public Profile Rendering
    renderPublicUI: (profileData) => {
        const nameStr = profileData.full_name || 'Entreprise';
        // Business Verification Badge (Malt style - Blue)
        const indicatorHtml = `<span class="verified-badge" style="background:#1e40af; color:white; font-size:0.9rem; padding:4px 10px; border-radius:30px; margin-left:10px; display:inline-flex; align-items:center; gap:6px;"><i class="fas fa-check-circle"></i> Entreprise</span>`;

        return {
            nameHtml: `${nameStr} ${indicatorHtml}`,
            title: profileData.title || 'Institution / Entreprise',
            roleLabel: 'Profil Institutionnel',
            roleClass: 'company'
        };
    }
};

window.CompanyModule = CompanyModule;
