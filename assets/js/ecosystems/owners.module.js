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
            case 'billetterie':
                const tickView = document.getElementById('billetterie-view');
                if (tickView && window.TicketingModule) {
                    tickView.style.display = 'block';
                    window.TicketingModule.loadMyTicketing(params);
                }
                break;
            case 'business':
                break;
            case 'overview':
            default:
                OwnersModule.renderDashboard(target, profile, session);
                break;
        }
    },

    /**
     * Dashboard Home - Epic Presentation (Mobile Corrected & UI Improved)
     */
    renderDashboard: async (container, profile, session) => {
        if (!container) return;

        // Fetch latest project for this owner
        let project = null;
        try {
            const { data, error } = await window._supabase
                .from('projects')
                .select('*')
                .eq('owner_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(1);
            if (!error && data && data.length > 0) {
                project = data[0];
            }
        } catch (err) {
            console.error("Error fetching latest project:", err);
        }

        const hasProject = !!project;

        // --- STATE 1: NEW USER (No project) - Streamlined Funnel ---
        if (!hasProject) {
            container.innerHTML = `
                <div style="font-family: 'Plus Jakarta Sans', sans-serif; max-width: 900px; margin: 0 auto; padding: 40px 20px;">
                    
                    <div style="text-align: center; margin-bottom: 60px; animation: slideDown 0.5s ease-out;">
                        <div style="display: inline-block; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Bienvenue dans votre Cockpit</div>
                        <h1 style="font-size: 3.5rem; font-weight: 950; color: #0f172a; margin: 0 0 20px 0; letter-spacing: -0.04em; line-height: 1.1;">
                            Prêt à lancer votre<br><span style="color: #10b981;">Projet d'Impact ?</span>
                        </h1>
                        <p style="font-size: 1.2rem; color: #64748b; font-weight: 500; max-width: 600px; margin: 0 auto; line-height: 1.6;">
                            Le <b>Success Engine</b> est notre algorithme exclusif qui vous guide pas-à-pas pour structurer, financer et valider votre projet sur le territoire.
                        </p>
                    </div>

                    <div style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 32px; padding: 60px 40px; text-align: center; box-shadow: 0 25px 50px rgba(0,0,0,0.15); position: relative; overflow: hidden; margin-bottom: 40px;">
                        <!-- Decorative shapes -->
                        <div style="position: absolute; top: -50px; left: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%);"></div>
                        <div style="position: absolute; bottom: -100px; right: -50px; width: 300px; height: 300px; background: radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%);"></div>
                        
                        <div style="position: relative; z-index: 10;">
                            <h2 style="font-size: 2rem; font-weight: 950; color: white; margin-bottom: 30px;">Démarrer ma première Épopée</h2>
                            <button onclick="window.Router.navigate('#success-engine')" style="background: #10b981; color: white; border: none; padding: 20px 48px; border-radius: 100px; font-weight: 950; font-size: 1.2rem; cursor: pointer; box-shadow: 0 10px 25px rgba(16,185,129,0.3); transition: transform 0.2s, box-shadow 0.2s; display: inline-flex; align-items: center; gap: 12px;">
                                🚀 Lancer le Success Engine
                            </button>
                        </div>
                    </div>

                    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 24px; padding: 32px; display: flex; align-items: center; justify-content: space-between; gap: 24px; flex-wrap: wrap;">
                        <div style="max-width: 500px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 8px;">
                                <span style="font-size: 1.5rem;">🎯</span>
                                <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0;">Besoin d'aide pour structurer ?</h3>
                            </div>
                            <p style="color: #64748b; font-size: 0.95rem; margin: 0; font-weight: 500; line-height: 1.5;">Profitez d'un diagnostic stratégique offert de 30 minutes avec notre équipe pour faire le point sur vos objectifs.</p>
                        </div>
                        <a href="https://calendly.com/domtomconnect/30min" target="_blank" style="background: white; color: #0f172a; text-decoration: none; padding: 14px 24px; border-radius: 12px; font-weight: 800; font-size: 0.95rem; border: 1px solid #e2e8f0; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: all 0.2s;">
                            📅 Prendre RDV
                        </a>
                    </div>
                </div>
            `;
            return;
        }

        // --- STATE 2: PROJECT OWNER (Has active project) ---
        
        // Calculate maturity dynamically using the core function if possible
        const maturity = window.calculateProjectMaturity ? window.calculateProjectMaturity(project) : 50;
        const goal = project.budget || 5000;
        const current = project.total_raised || 0;
        const percent = Math.min(Math.round((current / goal) * 100), 100);

        container.innerHTML = `
            <div class="dash-grid-layout" style="font-family: 'Plus Jakarta Sans', sans-serif;">
                
                <!-- COMPACT HERO BANNER -->
                <div class="epic-hero" style="grid-column: span 12; background: linear-gradient(135deg, #020617 0%, #0f172a 100%); border-radius: 24px; padding: 40px; position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: space-between; box-shadow: 0 15px 35px rgba(0,0,0,0.2); flex-wrap: wrap; gap: 20px;">
                    <div style="position: relative; z-index: 10; max-width: 600px;">
                        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 6px 12px; border-radius: 100px; font-size: 0.65rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px; border: 1px solid rgba(16,185,129,0.2);">Cockpit de Commandement</div>
                        <h1 style="font-size: 2.5rem; font-weight: 950; color: white; margin: 0; letter-spacing: -0.03em; line-height: 1.1;">${project.title || 'Mon Épopée'}</h1>
                        <p style="color: rgba(255,255,255,0.5); font-size: 1rem; margin-top: 12px; font-weight: 500;">
                            ${project.territory || 'Guyane'} • Pilotage stratégique & Impact territorial.
                        </p>
                    </div>
                    <div style="z-index: 10;">
                        <button onclick="window.Router.navigate('#success-engine')" style="background: rgba(255,255,255,0.1); color: white; border: 1px solid rgba(255,255,255,0.2); padding: 14px 28px; border-radius: 14px; font-weight: 800; font-size: 0.95rem; cursor: pointer; backdrop-filter: blur(10px); transition: background 0.2s;">
                            ✏️ Éditer le projet
                        </button>
                    </div>
                </div>

                <!-- 2. MODULAR BLOCKS GRID -->
                
                <!-- Block A: Strategic Maturity -->
                <div style="grid-column: span 4; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column; align-items: center; text-align: center;">
                    <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px; width: 100%;">Maturité Stratégique</h4>
                    <div style="width: 120px; height: 120px; border-radius: 50%; background: conic-gradient(#10b981 ${maturity}%, #f1f5f9 0); display: flex; align-items: center; justify-content: center; position: relative; margin-bottom: 20px;">
                        <div style="width: 100px; height: 100px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 950; font-size: 2rem; color: #0f172a; letter-spacing: -0.05em;">
                            <span id="maturity-score-dash">${maturity}%</span>
                        </div>
                    </div>
                    <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">${maturity >= 80 ? 'Structure Optimale' : (maturity >= 40 ? 'En développement' : 'Phase initiale')}</div>
                    <div style="font-size: 0.85rem; color: #64748b; margin-top: 4px;">${maturity >= 100 ? 'Prêt pour la validation' : 'Complétez votre cockpit'}</div>
                </div>

                <!-- Block B: Financing Card -->
                <div style="grid-column: span 4; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); display: flex; flex-direction: column; justify-content: center;">
                    <h4 style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 24px;">Cagnotte en Temps Réel</h4>
                    <div id="collected-amount-dash" style="font-size: 2.8rem; font-weight: 950; color: #0f172a; letter-spacing: -0.04em;">${current.toLocaleString()} €</div>
                    <div style="font-size: 0.9rem; font-weight: 700; color: #10b981; margin-top: 8px;">Objectif : ${goal.toLocaleString()} €</div>
                    <div style="height: 8px; background: #f1f5f9; border-radius: 100px; margin-top: 24px; overflow: hidden;">
                        <div style="width: ${percent}%; height: 100%; background: #10b981; border-radius: 100px;"></div>
                    </div>
                </div>

                <!-- Block C: Diagnostic Card (Replacing empty Mobilisation block) -->
                <div style="grid-column: span 4; background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 20px; padding: 32px 24px; box-shadow: 0 10px 25px rgba(16,185,129,0.2); color: white; display: flex; flex-direction: column; justify-content: center; position: relative; overflow: hidden;">
                    <div style="position: absolute; top: -20px; right: -20px; font-size: 8rem; opacity: 0.1;">🎯</div>
                    <h4 style="font-size: 0.75rem; font-weight: 900; color: rgba(255,255,255,0.7); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px; position: relative; z-index: 10;">Diagnostic</h4>
                    <h3 style="font-size: 1.4rem; font-weight: 950; margin: 0 0 12px 0; letter-spacing: -0.03em; position: relative; z-index: 10;">Besoin d'affiner votre stratégie ?</h3>
                    <p style="color: rgba(255,255,255,0.9); font-size: 0.85rem; margin: 0 0 24px 0; font-weight: 500; line-height: 1.5; position: relative; z-index: 10;">Réservez 30min de coaching gratuit avec le comité.</p>
                    <a href="https://calendly.com/domtomconnect/30min" target="_blank" style="background: white; color: #059669; text-decoration: none; padding: 12px 20px; border-radius: 12px; font-weight: 900; font-size: 0.9rem; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.1); position: relative; z-index: 10; transition: transform 0.2s;">
                        📅 Planifier l'appel
                    </a>
                </div>

                <!-- 3. STRATEGIC SNAPSHOTS -->
                <div style="grid-column: span 12; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-top: 8px;">
                    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 20px; padding: 24px; transition: background 0.2s;">
                        <div style="font-size: 0.7rem; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Vision Snapshot</div>
                        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin: 0; font-weight: 600; white-space: pre-wrap; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${project.vision || 'Non défini'}</p>
                    </div>

                    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 20px; padding: 24px; transition: background 0.2s;">
                        <div style="font-size: 0.7rem; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Mission Snapshot</div>
                        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin: 0; font-weight: 600; white-space: pre-wrap; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${project.mission || 'Non défini'}</p>
                    </div>

                    <div style="background: #f8fafc; border: 1px dashed #cbd5e1; border-radius: 20px; padding: 24px; transition: background 0.2s;">
                        <div style="font-size: 0.7rem; font-weight: 900; color: #10b981; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em;">Enjeu Snapshot</div>
                        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6; margin: 0; font-weight: 600; white-space: pre-wrap; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">${project.enjeu || 'Non défini'}</p>
                    </div>
                </div>

                <!-- 4. ACTION CENTER -->
                <div style="grid-column: span 12; background: white; border: 1px solid #e2e8f0; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); margin-top: 8px;">
                    <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 24px;">
                        <div>
                            <h4 style="font-size: 0.75rem; font-weight: 950; color: #10b981; text-transform: uppercase; margin-bottom: 8px; letter-spacing: 0.05em;">Extensions</h4>
                            <div style="font-size: 1.4rem; font-weight: 900; color: #0f172a;">Billetterie & Évènements</div>
                            <div style="font-size: 0.95rem; color: #64748b; margin-top: 4px; font-weight: 500;">Organisez des évènements pour votre communauté.</div>
                        </div>
                        <div style="display: flex; gap: 16px;">
                            <button onclick="window.Router.navigate('#billetterie')" style="padding: 14px 24px; background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: background 0.2s;">Gérer mes Évènements</button>
                            <button onclick="window.Router.navigate('#billetterie?action=create')" style="padding: 14px 24px; background: #0f172a; color: white; border: none; border-radius: 12px; font-weight: 800; font-size: 0.95rem; cursor: pointer; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(15,23,42,0.2);">+ Nouvel Évènement</button>
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
