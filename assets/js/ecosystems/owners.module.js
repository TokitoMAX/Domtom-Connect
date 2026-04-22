/**
 * Domtom Connect - Project Owner Ecosystem Module
 * Logic for Project Owners (Epic Project Management)
 */
const OwnersModule = {
    role: 'owner',

    /**
     * Module Router
     */
    route: async (view_id, container, profile, session, params) => {
        const target = container || document.getElementById('ecosystem-grid-container');
        if (!target) return;

        switch (view_id) {
            case 'profile':
                if (window.StandardModule) {
                    window.StandardModule.renderProfile(target, profile, session);
                }
                break;
            case 'success-engine':
                if (window.loadMyProjects) {
                    const engineContainer = document.getElementById('success-engine-view-fixed');
                    if (engineContainer) {
                        engineContainer.style.display = 'block';
                        window.loadMyProjects(session.user.id);
                    }
                }
                break;
            case 'overview':
            default:
                OwnersModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Epic Presentation (Mobile Corrected)
     */
    renderDashboard: (container, profile, session) => {
        if (!container) return;

        // Funding Calculation
        const goal = profile.budget || 5000;
        const current = profile.current_funding || 0;
        const percent = Math.min(Math.round((current / goal) * 100), 100);

        container.innerHTML = `
            <style>
                .epic-grid-container {
                    display: grid;
                    grid-template-columns: 1fr 340px;
                    gap: 32px;
                }
                .epic-hero-h1 {
                    font-size: 4rem;
                    line-height: 1.1;
                }
                @media (max-width: 1024px) {
                    .epic-grid-container {
                        grid-template-columns: 1fr;
                        gap: 24px;
                    }
                    .epic-hero {
                        padding: 40px 24px !important;
                    }
                    .epic-hero-h1 {
                        font-size: 2.5rem !important;
                    }
                    .dash-side-col {
                        order: 2;
                    }
                    .dash-left-col {
                        order: 1;
                    }
                    .epic-tabs {
                        gap: 20px !important;
                        overflow-x: auto;
                        padding-bottom: 10px;
                    }
                    .epic-tabs button {
                        white-space: nowrap;
                    }
                }
            </style>

            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- EPIC HERO BANNER -->
                <div class="epic-hero" style="background: linear-gradient(rgba(15,23,42,0.8), rgba(15,23,42,0.95)), url('https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200'); background-size: cover; background-position: center; border-radius: 28px; padding: 60px; margin-bottom: 32px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.1);">
                    <div style="position: relative; z-index: 2;">
                        <span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 6px 14px; border-radius: 100px; font-size: 0.7rem; font-weight: 800; border: 1px solid rgba(16, 185, 129, 0.3); text-transform: uppercase; letter-spacing: 0.05em;">Projet Impact & Innovation</span>
                        <h1 class="epic-hero-h1" style="color: white; font-weight: 950; margin: 20px 0 12px 0; letter-spacing: -0.04em;">${profile.project_name || 'Nouvelle &Eacute;pop&eacute;e'}</h1>
                        <div style="display: flex; align-items: center; gap: 12px; color: rgba(255,255,255,0.6); font-weight: 700;">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                            ${profile.zone || 'Guyane'}
                        </div>
                    </div>
                </div>

                <!-- EPIC TABS -->
                <div class="epic-tabs" style="display: flex; gap: 40px; margin-bottom: 32px; border-bottom: 1px solid #e2e8f0; padding: 0 10px;">
                    <button class="active" style="padding: 16px 0; background: none; border: none; font-weight: 900; font-size: 0.85rem; color: #10b981; border-bottom: 3px solid #10b981; text-transform: uppercase;">Le Manifeste</button>
                    <button style="padding: 16px 0; background: none; border: none; font-weight: 900; font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; cursor: pointer;">Strat&eacute;gie</button>
                    <button style="padding: 16px 0; background: none; border: none; font-weight: 900; font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; cursor: pointer;">&Eacute;quipe & Impact</button>
                    <button style="padding: 16px 0; background: none; border: none; font-weight: 900; font-size: 0.85rem; color: #94a3b8; text-transform: uppercase; cursor: pointer;">Propulsion</button>
                </div>

                <!-- TWO COLUMN LAYOUT (Responsive Grid) -->
                <div class="epic-grid-container">
                    
                    <!-- MAIN CONTENT: MANIFESTO -->
                    <div class="dash-left-col dash-card" style="padding: 40px;">
                        <h4 style="font-size: 0.7rem; font-weight: 900; color: #10b981; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 32px; display: flex; align-items: center; gap: 10px;">
                            <span style="width:8px; height:8px; background:#10b981; border-radius:50%;"></span> Manifeste & Impact
                        </h4>
                        
                        <div style="display: grid; gap: 40px;">
                            <div class="manifesto-item">
                                <h3 style="font-size: 1.25rem; font-weight: 950; color: #0f172a; margin-bottom: 8px;">Vision Strat&eacute;gique</h3>
                                <p style="font-size: 1.05rem; color: #475569; line-height: 1.7;">${profile.vision || 'D&eacute;finissez votre ambition long terme pour le territoire.'}</p>
                            </div>
                            <div class="manifesto-item">
                                <h3 style="font-size: 1.25rem; font-weight: 950; color: #0f172a; margin-bottom: 8px;">Notre Mission</h3>
                                <p style="font-size: 1.05rem; color: #475569; line-height: 1.7;">${profile.mission || 'Quelle est l\'action concr&egrave;te au quotidien de votre projet ?'}</p>
                            </div>
                            <div class="manifesto-item">
                                <h3 style="font-size: 1.25rem; font-weight: 950; color: #0f172a; margin-bottom: 8px;">L'Enjeu du Projet</h3>
                                <p style="font-size: 1.05rem; color: #475569; line-height: 1.7;">${profile.enjeu || 'Pourquoi ce projet est-il indispensable aujourd\'hui ?'}</p>
                            </div>
                        </div>

                        <div style="margin-top: 60px; padding-top: 40px; border-top: 1.5px solid #f1f5f9; display: grid; grid-template-columns: 1fr 1fr; gap: 40px;">
                            <div>
                                <span style="font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">PORTEUR</span>
                                <div style="font-size:1.1rem; font-weight:900; color:#0f172a; margin-top:4px;">${profile.full_name}</div>
                            </div>
                            <div>
                                <span style="font-size:0.65rem; font-weight:900; color:#94a3b8; text-transform:uppercase;">INNOVATION TIER</span>
                                <div style="font-size:1.1rem; font-weight:900; color:#10b981; margin-top:4px;">Strat&eacute;gique</div>
                            </div>
                        </div>
                    </div>

                    <!-- SIDEBAR: CAGNOTTE -->
                    <div class="dash-side-col">
                        <div class="dash-card" style="padding: 32px; background: white; border: 2px solid #0f172a; position: sticky; top: 20px;">
                            <h4 style="font-size: 0.85rem; font-weight: 950; color: #10b981; margin-bottom: 24px;">Cagnotte &Eacute;pique</h4>
                            
                            <div style="margin-bottom: 24px;">
                                <div style="font-size: 3rem; font-weight: 950; color: #0f172a; letter-spacing: -0.05em;">${current.toLocaleString()} &euro;</div>
                                <div style="font-size: 0.85rem; font-weight: 800; color: #2563eb; margin-top: 4px;">Objectif Impact : ${goal.toLocaleString()} &euro;</div>
                            </div>

                            <!-- Progress Bar -->
                            <div style="height: 12px; width: 100%; background: #f1f5f9; border-radius: 100px; overflow: hidden; margin: 24px 0;">
                                <div style="height: 100%; width: ${percent}%; background: #10b981; border-radius: 100px;"></div>
                            </div>

                            <div style="display: flex; justify-content: space-between; margin-bottom: 32px;">
                                <span style="font-size: 0.75rem; font-weight: 900; color: #0f172a;">${percent}% Engag&eacute;</span>
                                <span style="font-size: 0.75rem; font-weight: 800; color: #94a3b8;">${(goal - current).toLocaleString()} &euro; restant(s)</span>
                            </div>

                            <button class="cta-button primary" style="width: 100%; padding: 20px; background: #10b981; color: white; border: none; border-radius: 14px; font-weight: 950; font-size: 1.1rem; cursor: pointer; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">Propulser l'&Eacute;pop&eacute;e</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * RESTORED: Epic Specific Manifesto Fields
     */
    renderProfileFields: (profile) => {
        return `
            <div style="background:#f1f5f9; padding:24px; border-radius:24px; border:1.5px solid #e2e8f0; margin-bottom:24px;">
                <h3 style="font-size:0.85rem; font-weight:900; color:#0f172a; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:24px;">Manifeste de l'&Eacute;pop&eacute;e</h3>
                <div style="display: grid; gap: 20px;">
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">Vision Strat&eacute;gique (Objectif long terme)</label>
                        <textarea id="profile-vision" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.vision || ''}</textarea>
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">Notre Mission (Action quotidiennes)</label>
                        <textarea id="profile-mission" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.mission || ''}</textarea>
                    </div>
                    <div class="info-field">
                        <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #475569; margin-bottom:8px;">L'Enjeu du Projet (Pourquoi maintenant ?)</label>
                        <textarea id="profile-enjeu" style="width: 100%; min-height: 80px; padding: 14px; border-radius: 12px; border: 1.5px solid #cbd5e1; font-weight: 600;">${profile.enjeu || ''}</textarea>
                    </div>
                </div>
            </div>
            
            <div style="background:#fff; padding:24px; border-radius:24px; border:1.5px solid #e2e8f0; display:grid; grid-template-columns: 1fr 1fr; gap:24px;">
                 <div class="info-field">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom:8px;">Nom de l'&Eacute;pop&eacute;e</label>
                    <input type="text" id="profile-project_name" value="${profile.project_name || ''}" placeholder="Ex: Énergies Vertes Martinique" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
                <div class="info-field">
                    <label style="display: block; font-size: 0.7rem; font-weight: 800; color: #94a3b8; margin-bottom:8px;">Objectif Cagnotte (&euro;)</label>
                    <input type="number" id="profile-budget" value="${profile.budget || 5000}" style="width: 100%; padding: 14px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-weight: 700;">
                </div>
            </div>
        `;
    }
};

window.OwnersModule = OwnersModule;
