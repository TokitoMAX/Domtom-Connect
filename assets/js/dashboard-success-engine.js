// --- 1. COORDINATION & STEPPER ---
window.showView = null; // Sera défini dans dashboard-core.js, mais on réserve le namespace

function updateSuccessStepper(score, projectId) {
    const steps = [
        { id: 'cockpit-step-1', threshold: 0, label: '01. Identité', hint: 'Vision & Mission' },
        { id: 'cockpit-step-2', threshold: 16, label: '02. Humain', hint: 'L\'Équipe' },
        { id: 'cockpit-step-3', threshold: 32, label: '03. Terrain', hint: 'Le Marché' },
        { id: 'cockpit-step-4', threshold: 49, label: '04. Valeur', hint: 'Impact & Jobs' },
        { id: 'cockpit-step-5', threshold: 66, label: '05. Objectifs', hint: 'Financement' },
        { id: 'cockpit-step-6', threshold: 83, label: '06. Envol', hint: 'Pitch & Soumission' }
    ];

    let activeIndex = -1;
    steps.forEach((s, i) => {
        const el = document.getElementById(s.id);
        if (!el) return;

        if (score >= s.threshold) {
            el.classList.add('completed');
            el.classList.remove('locked', 'active');
            el.title = "Phase complétée";
            const icon = el.querySelector('.step-status-icon');
            if (icon) {
                icon.innerHTML = '✓';
                icon.className = 'step-status-icon status-completed';
            }
        } else if (activeIndex === -1) {
            activeIndex = i;
            el.classList.add('active');
            el.classList.remove('locked', 'completed');
            el.title = "Phase en cours";
            const icon = el.querySelector('.step-status-icon');
            if (icon) {
                icon.innerHTML = '●';
                icon.className = 'step-status-icon status-active';
            }
        } else {
            el.classList.add('locked');
            el.classList.remove('active', 'completed');
            el.title = `Verrouillé : ${s.hint}`;
            const icon = el.querySelector('.step-status-icon');
            if (icon) {
                icon.innerHTML = '🔒';
                icon.className = 'step-status-icon status-locked';
            }
        }
    });
}

// --- 2. PROJECT LOADING & HUB ---

async function loadMyProjects(userId) {
    const headerContainer = document.getElementById('success-engine-header');
    const engineStepContainer = document.getElementById('success-engine-step');
    if (!headerContainer || !engineStepContainer) return;

    try {
        const { data: projects, error } = await _supabase
            .from('projects')
            .select('*')
            .eq('owner_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        // --- 1. HEADER (Simple & Direct) ---
        headerContainer.innerHTML = ''; // Nettoyage

        // --- 2. LISTE DES PROJETS ---
        let listHTML = `
            <div id="project-list-view">
                <div class="dash-section-pilotage">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="flex: 1;">
                            <h2 style="color: white; margin: 0; font-size: 1.2rem; font-weight: 800;">Nouvelle Épopée</h2>
                            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0 0; font-size: 0.85rem;">Lancez une aventure.</p>
                        </div>
                        <button onclick="startNewProjectWizard()" class="cta-button primary" style="background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.1); padding: 10px 16px; font-size: 0.8rem;">+ Nouveau</button>
                    </div>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">Mes Épopées</h3>
                <div class="ecosystem-grid">
                    ${projects && projects.length > 0 ? projects.map(p => `
                        <div class="dash-card-premium" style="border-left: 4px solid #10b981; background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1); position:relative;">
                            <button onclick="deleteSREProject('${p.id}')" style="position:absolute; top:12px; right:12px; background:none; border:none; color:#ef4444; cursor:pointer; opacity:0.6;" title="Supprimer">×</button>
                            <div class="dash-card-icon" style="background: rgba(16,185,129,0.1); color: #10b981; font-weight:800; font-size:0.7rem;">PROJET</div>
                            <div class="card-title" style="font-size: 1.3rem;">${p.title || p.name || 'Sans titre'}</div>
                            <div style="font-size:0.85rem; color:#64748b; margin-bottom:12px; font-weight:700;">📍 ${p.territory || 'Territoire à définir'}</div>
                            
                            <div style="margin: 16px 0; background: #f1f5f9; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="width: ${Math.min((p.total_raised || 0) / (p.funding_goal || 1) * 100, 100)}%; background: #10b981; height: 100%;"></div>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 20px;">
                                <span style="font-weight: 800; color: #1e293b;">${(p.total_raised || 0).toLocaleString()} €</span>
                                <span style="color: #64748b;">Objectif: ${(p.funding_goal || 0).toLocaleString()} €</span>
                            </div>

                            <button onclick="openProjectCockpit('${p.id}')" class="cta-button primary" style="background:#0f172a; justify-content:center; margin-top:auto; font-weight:900;">Piloter mon projet</button>
                        </div>
                    `).join('') : '<p style="color: #94a3b8; font-style: italic;">Aucune épopée en cours.</p>'}
                </div>
            </div>

            <!-- CONTENEUR COCKPIT (MASQUÉ) -->
            <div id="project-cockpit-view" style="display: none; padding: 0 10px;">
                <a href="#success-engine" class="cta-button secondary" style="display:inline-flex; align-items:center; text-decoration:none; margin-bottom: 24px; font-weight:800; border-radius: 12px; font-size: 0.85rem; padding: 10px 16px;">&larr; Mes Projets</a>
                <div id="cockpit-content-internal"></div>
            </div>
        `;

        engineStepContainer.innerHTML = listHTML;

        // --- 3. SYNCHRONISATION (Désactivée pour éviter les doublons) ---

    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

async function openProjectCockpit(projectId, initialStep = 1) {
    const list = document.getElementById('project-list-view');
    const cockpit = document.getElementById('project-cockpit-view');
    const content = document.getElementById('cockpit-content-internal');
    
    if (!list || !cockpit || !content) return;

    try {
        const { data: p, error } = await _supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;

        // Mise à jour de l'URL pour la persistance au rafraîchissement
        const newHash = `success-engine?id=${projectId}`;
        if (window.location.hash !== `#${newHash}`) {
            window.location.hash = newHash;
        }

        if (list) list.style.display = 'none';
        if (cockpit) cockpit.style.display = 'block';
        
        // Load matchmaking (Pépites)
        if (typeof loadMatchmaking === 'function') loadMatchmaking(p.owner_id);

        // Calcul de la maturité actuelle (depuis core)
        const score = typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity(p) : 0;

        renderCockpitWithStep(p, initialStep, score);

    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

function renderCockpitWithStep(p, step, score) {
    const content = document.getElementById('cockpit-content-internal');
    if (!content) return;

    const stepsInfo = [
        { num: 1, title: '01. Identité', subtitle: 'Manifeste, Vision & Mission' },
        { num: 2, title: '02. Humain', subtitle: 'L\'Équipe & Le Commando' },
        { num: 3, title: '03. Terrain', subtitle: 'Le Marché & L\'Opportunité' },
        { num: 4, title: '04. Valeur', subtitle: 'Impact Local, Innovation & Emploi' },
        { num: 5, title: '05. Objectifs', subtitle: 'Besoins de Financement' },
        { num: 6, title: '06. Propulsion Finale', subtitle: 'Pitch Final & Validation Admin' }
    ];

    const current = stepsInfo.find(s => s.num === step);

    let stepHTML = `
        <div class="cockpit-stepper-header" style="margin-bottom: 40px;">
            <a href="#overview" class="cta-button secondary" style="display:inline-flex; align-items:center; text-decoration:none; margin-bottom: 24px; padding: 10px 20px; font-size: 0.8rem; border-radius: 12px; background: rgba(0,0,0,0.05); color:#64748b; font-weight:800;">
                &larr; Retour au tableau de bord
            </a>

            <div class="cockpit-stepper" style="display: grid; grid-template-columns: repeat(6, 1fr); gap: 10px; margin-bottom: 32px;">
                ${stepsInfo.map(s => `
                    <div onclick="renderCockpitWithStep(${JSON.stringify(p).replace(/"/g, '&quot;')}, ${s.num})" 
                         class="cockpit-step ${s.num === step ? 'active' : ''}" 
                         style="padding:12px; border-radius:12px; border:1px solid ${s.num === step ? '#3b82f6' : '#e2e8f0'}; cursor:pointer; text-align:center; transition: all 0.2s;">
                        <div style="font-size:0.55rem; font-weight:900; opacity:0.6; text-transform: uppercase; letter-spacing: 0.05em;">ÉTAPE ${s.num}</div>
                        <div style="font-size:0.7rem; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${s.title.split('. ')[1]}</div>
                    </div>
                `).join('')}
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:24px; border-bottom: 1px solid var(--gray-100); padding-bottom: 24px;">
                <div>
                    <div style="font-size:0.75rem; font-weight:700; color:#10b981; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:8px;">ÉPOPÉE : ${p.title || 'SANS TITRE'}</div>
                    <h2 style="font-size:2rem; font-weight:900; margin:0; letter-spacing: -0.02em;">${current.title}</h2>
                    <p style="color:var(--text-secondary); margin:4px 0 0 0; font-size: 1.1rem; font-weight: 500;">${current.subtitle}</p>
                </div>
            </div>
        </div>

        <div class="success-engine-card" id="cockpit-step-container">
            ${renderStepFields(step, p)}
        </div>

        <div style="margin-top:40px; display:flex; justify-content:space-between; gap:20px; padding-top: 32px; border-top: 1px solid var(--gray-100);">
            <button onclick="${step > 1 ? `renderCockpitWithStep(${JSON.stringify(p).replace(/"/g, '&quot;')}, ${step-1})` : 'closeProjectCockpit()'}" 
                    class="cta-button secondary" style="flex:1; justify-content:center; border-radius: 16px; font-weight: 800;">${step > 1 ? '← Précédent' : 'Annuler'}</button>
            
            <button onclick="saveProjectStep('${p.id}', ${step})" 
                    class="cta-button primary" style="flex:2; justify-content:center; background:#10b981; border-radius: 16px; font-weight: 900; box-shadow: 0 10px 20px rgba(16,185,129,0.2);">
                    ${step === 6 ? 'SOUMETTRE À L\'ADMINISTRATION' : 'Enregistrer & Continuer'}
            </button>
        </div>
    `;

    content.innerHTML = stepHTML;
    window.scrollTo(0, 0);

    // Initialisation dynamique des données de crowdfunding à l'étape 5
    if (step === 5) {
        loadDashboardRewards(p.id);
        loadDashboardMilestones(p.id);
    }
}

function renderStepFields(step, p) {
    if (step === 1) {
        return `
            <div class="success-engine-grid">
                <div class="success-engine-field" style="grid-column: 1 / -1; margin-bottom: 24px;">
                    <label class="success-engine-label">Image de Couverture (Optionnel)</label>
                    <div style="display:flex; flex-direction:column; gap:16px;">
                        <input type="file" id="cover-upload" style="display:none;" onchange="handleCoverUpload(this, '${p.id}')">
                        <div id="cover-preview" style="width:100%; height:${p.cover_url ? '250px' : '150px'}; border-radius:24px; background:${p.cover_url ? `url('${p.cover_url}') center/cover` : '#f1f5f9'}; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; overflow:hidden;">
                            ${!p.cover_url ? '<p style="color:#64748b; font-size:0.9rem; font-weight:600;">L\'image s\'affichera ici après l\'upload</p>' : ''}
                        </div>
                        <button onclick="document.getElementById('cover-upload').click()" class="cta-button secondary" style="width:fit-content; font-size: 0.85rem;">
                            ${p.cover_url ? 'MODIFIER L\'IMAGE' : 'DÉFINIR L\'IMAGE DE COUVERTURE'}
                        </button>
                        <input type="hidden" id="cover_url" value="${p.cover_url || ''}">
                    </div>
                </div>

                <div class="success-engine-field">
                    <label class="success-engine-label">Territoire d'Épopée</label>
                    <select id="territory" class="sre-input">
                        <optgroup label="Antilles & Guyane Françaises">
                            <option value="Martinique" ${p.territory === 'Martinique' ? 'selected' : ''}>Martinique 🇲🇶</option>
                            <option value="Guadeloupe" ${p.territory === 'Guadeloupe' ? 'selected' : ''}>Guadeloupe 🇬🇵</option>
                            <option value="Guyane" ${p.territory === 'Guyane' ? 'selected' : ''}>Guyane Française 🇬🇫</option>
                            <option value="Saint-Martin" ${p.territory === 'Saint-Martin' ? 'selected' : ''}>Saint-Martin 🇸🇽</option>
                            <option value="Saint-Barthélemy" ${p.territory === 'Saint-Barthélemy' ? 'selected' : ''}>Saint-Barthélemy 🇧🇱</option>
                        </optgroup>
                        <optgroup label="Océan Indien">
                            <option value="Réunion" ${p.territory === 'Réunion' ? 'selected' : ''}>La Réunion 🇷🇪</option>
                            <option value="Mayotte" ${p.territory === 'Mayotte' ? 'selected' : ''}>Mayotte 🇾🇹</option>
                        </optgroup>
                        <optgroup label="Antilles & Caraïbes (International)">
                            <option value="Anguilla" ${p.territory === 'Anguilla' ? 'selected' : ''}>Anguilla 🇦🇮</option>
                            <option value="Antigua & Barbuda" ${p.territory === 'Antigua & Barbuda' ? 'selected' : ''}>Antigua & Barbuda 🇦🇬</option>
                            <option value="Bahamas" ${p.territory === 'Bahamas' ? 'selected' : ''}>Bahamas 🇧🇸</option>
                            <option value="Barbados" ${p.territory === 'Barbados' ? 'selected' : ''}>Barbados 🇧🇧</option>
                            <option value="Cuba" ${p.territory === 'Cuba' ? 'selected' : ''}>Cuba 🇨🇺</option>
                            <option value="Dominican Republic" ${p.territory === 'Dominican Republic' ? 'selected' : ''}>Dominican Republic 🇩🇴</option>
                            <option value="Dominica" ${p.territory === 'Dominica' ? 'selected' : ''}>Dominica 🇩🇲</option>
                            <option value="Grenada" ${p.territory === 'Grenada' ? 'selected' : ''}>Grenada 🇬🇩</option>
                            <option value="Haiti" ${p.territory === 'Haiti' ? 'selected' : ''}>Haiti 🇭🇹</option>
                            <option value="Jamaica" ${p.territory === 'Jamaica' ? 'selected' : ''}>Jamaica 🇯🇲</option>
                            <option value="Puerto Rico" ${p.territory === 'Puerto Rico' ? 'selected' : ''}>Puerto Rico 🇵🇷</option>
                            <option value="St. Kitts & Nevis" ${p.territory === 'St. Kitts & Nevis' ? 'selected' : ''}>St. Kitts & Nevis 🇰🇳</option>
                            <option value="St. Lucia" ${p.territory === 'St. Lucia' ? 'selected' : ''}>St. Lucia 🇱🇨</option>
                            <option value="St. Vincent & Grenadines" ${p.territory === 'St. Vincent & Grenadines' ? 'selected' : ''}>St. Vincent & Grenadines 🇻🇨</option>
                            <option value="Trinidad & Tobago" ${p.territory === 'Trinidad & Tobago' ? 'selected' : ''}>Trinidad & Tobago 🇹🇹</option>
                            <option value="Turks & Caicos" ${p.territory === 'Turks & Caicos' ? 'selected' : ''}>Turks & Caicos 🇹🇨</option>
                        </optgroup>
                        <optgroup label="Amérique du Nord">
                            <option value="Canada - Montréal" ${p.territory === 'Canada - Montréal' ? 'selected' : ''}>Montréal, Canada 🇨🇦</option>
                            <option value="Canada - Québec" ${p.territory === 'Canada - Québec' ? 'selected' : ''}>Québec, Canada 🇨🇦</option>
                            <option value="Canada - Toronto" ${p.territory === 'Canada - Toronto' ? 'selected' : ''}>Toronto, Canada 🇨🇦</option>
                            <option value="USA - Miami" ${p.territory === 'USA - Miami' ? 'selected' : ''}>Miami, USA 🇺🇸</option>
                            <option value="USA - New York" ${p.territory === 'USA - New York' ? 'selected' : ''}>New York, USA 🇺🇸</option>
                            <option value="USA - Diaspora" ${p.territory === 'USA - Diaspora' ? 'selected' : ''}>USA (Autre), Diaspora 🇺🇸</option>
                        </optgroup>
                        <optgroup label="Europe & Diaspora">
                            <option value="France Hexagonale" ${p.territory === 'France Hexagonale' ? 'selected' : ''}>France Hexagonale 🇫🇷</option>
                            <option value="Europe - Diaspora" ${p.territory === 'Europe - Diaspora' ? 'selected' : ''}>Europe (Autre), Diaspora 🇪🇺</option>
                        </optgroup>
                        <option value="Autre" ${p.territory === 'Autre' ? 'selected' : ''}>Autre territoire 🌍</option>
                    </select>
                </div>

                <div class="success-engine-field">
                    <label class="success-engine-label">L'Accroche (Short Description)</label>
                    <input type="text" id="short_description" class="sre-input" value="${p.short_description || ''}" placeholder="Votre pitch en une phrase percutante.">
                </div>

                <div class="success-engine-field">
                    <label class="success-engine-label">Votre Vision (Le Futur)</label>
                    <textarea id="vision" class="success-engine-textarea" placeholder="Où voyez-vous ce projet dans 5 ans ?">${p.vision || ''}</textarea>
                </div>
                <div class="success-engine-field">
                    <label class="success-engine-label">L'Enjeu (Pourquoi ?)</label>
                    <textarea id="enjeu" class="success-engine-textarea" placeholder="Quel problème majeur résolvez-vous ?">${p.enjeu || ''}</textarea>
                </div>
                <div class="success-engine-field" style="grid-column: 1 / -1;">
                    <label class="success-engine-label">Votre Mission (Maintenant)</label>
                    <textarea id="mission" class="success-engine-textarea" style="height:120px;" placeholder="Que faites-vous concrètement aujourd'hui ?">${p.mission || ''}</textarea>
                </div>
            </div>
        `;
    } else if (step === 2) {
        return `
            <div class="success-engine-grid">
                <div class="success-engine-field" style="grid-column: 1 / -1;">
                    <label class="success-engine-label">Présentation de l'équipe</label>
                    <textarea id="equipe" class="success-engine-textarea" style="height:150px;" placeholder="Qui sont les fondateurs et contributeurs clés ?">${p.equipe || ''}</textarea>
                </div>
            </div>
        `;
    } else if (step === 3) {
        return `
            <div class="success-engine-grid">
                <div class="success-engine-field">
                    <label class="success-engine-label">Secteur d'activité</label>
                    <select id="sector" class="sre-input">
                        <option value="" disabled ${!p.sector ? 'selected' : ''}>Sélectionnez un secteur...</option>
                        <option value="Agriculture & Alimentation" ${p.sector==='Agriculture & Alimentation'?'selected':''}>Agriculture & Alimentation</option>
                        <option value="Tourisme & Patrimoine" ${p.sector==='Tourisme & Patrimoine'?'selected':''}>Tourisme & Patrimoine</option>
                        <option value="Énergie & Environnement" ${p.sector==='Énergie & Environnement'?'selected':''}>Énergie & Environnement</option>
                        <option value="Numérique & Tech" ${p.sector==='Numérique & Tech'?'selected':''}>Numérique & Tech</option>
                        <option value="Social & Éducation" ${p.sector==='Social & Éducation'?'selected':''}>Social & Éducation</option>
                        <option value="Commerce & Artisanat" ${p.sector==='Commerce & Artisanat'?'selected':''}>Commerce & Artisanat</option>
                        <option value="Santé & Bien-être" ${p.sector==='Santé & Bien-être'?'selected':''}>Santé & Bien-être</option>
                    </select>
                </div>

                <div class="success-engine-field" style="grid-column: 1 / -1;">
                    <label class="success-engine-label">Opportunité & Marché</label>
                    <textarea id="marche" class="success-engine-textarea" style="height:150px;" placeholder="À qui s'adresse votre projet ? Quel est le potentiel local ?">${p.marche || ''}</textarea>
                </div>
            </div>
        `;
    } else if (step === 4) {
        return `
            <div class="success-engine-grid">
                <div class="success-engine-field" style="grid-column: 1 / -1; margin-bottom: 16px;">
                    <label class="success-engine-label">Innovation Tier</label>
                    <select id="innovation_tier" class="sre-input">
                        <option value="Incremental" ${p.innovation_tier==='Incremental'?'selected':''}>Incrémentale (Amélioration simple)</option>
                        <option value="Radical" ${p.innovation_tier==='Radical'?'selected':''}>Radicale (Changement profond)</option>
                        <option value="Disruptive" ${p.innovation_tier==='Disruptive'?'selected':''}>Disruptive (Rupture du marché)</option>
                        <option value="Social" ${p.innovation_tier==='Social'?'selected':''}>Sociale (Réponse à un besoin social)</option>
                    </select>
                </div>

                <div class="success-engine-field">
                    <label class="success-engine-label">Impact Local</label>
                    <textarea id="impact_local" class="success-engine-textarea" placeholder="Qu'apportez-vous au territoire ?">${p.impact_local || ''}</textarea>
                </div>
                <div class="success-engine-field">
                    <label class="success-engine-label">Innovation / Différenciation</label>
                    <textarea id="innovation" class="success-engine-textarea" placeholder="Pourquoi votre projet est-il unique ?">${p.innovation || ''}</textarea>
                </div>
                <div class="success-engine-field">
                    <label class="success-engine-label">Emplois Visés (Chiffre)</label>
                    <input type="text" id="emplois" class="sre-input" value="${p.emplois || ''}" placeholder="Ex: 5 emplois créés">
                </div>
            </div>
        `;
    } else if (step === 5) {
        return `
            <div class="success-engine-grid" style="grid-template-columns: 1fr;">
                <div style="display:grid; grid-template-columns: 1fr 1.5fr; gap:40px;">
                    <!-- Colonne Gauche : Objectif & Paliers -->
                    <div style="display:flex; flex-direction:column; gap:32px;">
                        <div class="success-engine-field">
                            <label class="success-engine-label">Montant Global Recherché (€)</label>
                            <input type="number" id="funding_goal" class="sre-input" value="${p.funding_goal || 0}" placeholder="Ex: 50000">
                        </div>

                        <div class="success-engine-field">
                            <label class="success-engine-label">À quoi servira cette somme ?</label>
                            <textarea id="budget" class="success-engine-textarea" style="height:100px;" placeholder="Expliquez brièvement l'usage des fonds (ex: Recrutement, R&D, Stock...)">${p.budget || ''}</textarea>
                        </div>

                        <div class="success-engine-field">
                            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                                <label class="success-engine-label" style="margin:0;">Paliers d'Impact</label>
                                <button onclick="openMilestoneModal('${p.id}')" class="cta-button secondary" style="padding:6px 12px; font-size:0.75rem;">+ AJOUTER UN PALIER</button>
                            </div>
                            <div id="dash-milestones-list" class="crowdfunding-list-container">
                                <!-- Paliers chargés en JS -->
                                <p style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Chargement des paliers...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Colonne Droite : Récompenses -->
                    <div class="success-engine-field">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                            <label class="success-engine-label" style="margin:0;">Offres & Récompenses (Contreparties)</label>
                            <button onclick="openRewardModal('${p.id}')" class="cta-button primary" style="padding:6px 16px; font-size:0.75rem; background:#7c3aed; border:none;">+ CRÉER UNE RÉCOMPENSE</button>
                        </div>
                        <div id="dash-rewards-list" class="crowdfunding-list-container" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:16px;">
                            <!-- Récompenses chargées en JS -->
                            <p style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Chargement des récompenses...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 6) {
        return `
            <div class="success-engine-grid">
                <div class="success-engine-field" style="grid-column: 1 / -1;">
                    <label class="success-engine-label">Texte du Pitch Final (Le Grand Récit)</label>
                    <textarea id="pitch_texte" class="success-engine-textarea" style="height:200px;" placeholder="Votre argumentaire de vente en 300 mots max pour convaincre les institutionnels.">${p.pitch_texte || ''}</textarea>
                </div>

                <div style="background:#f0fdf4; border:1px solid #10b981; padding:40px; border-radius:32px; grid-column: 1 / -1; margin-top: 24px; text-align:center;">
                    <h4 style="margin:0 0 12px 0; color:#10b981; font-weight:900; font-size: 1.5rem;">C'est l'heure de la Propulsion</h4>
                    <p style="font-size:1.1rem; color:#065f46; margin:0 auto 24px; line-height: 1.6; max-width:600px;">
                        Votre dossier est désormais complet. Un administrateur Domtom Connect va examiner vos données pour <strong>valider (ou non)</strong> la mise en ligne officielle de votre Épopée sur la plateforme.
                    </p>
                </div>
            </div>
        `;
    }
}

async function handleCoverUpload(input, projectId) {
    const file = input.files[0];
    if (!file) return;
    
    try {
        const session = await getSession();
        if (!session) return;
        
        const preview = document.getElementById('cover-preview');
        if (preview) {
            preview.innerHTML = '<p style="color:#64748b; font-size:0.9rem; font-weight:800;">Upload en cours...</p>';
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/cover_${projectId}_${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { data, error } = await _supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = _supabase.storage
            .from('avatars')
            .getPublicUrl(filePath);

        document.getElementById('cover_url').value = publicUrl;
        
        if (preview) {
            preview.style.background = `url('${publicUrl}') center/cover`;
            preview.style.height = '250px';
            preview.innerHTML = '';
        }
        
        alert("✅ Image de couverture mise en ligne !");
    } catch (err) {
        alert("Erreur lors de l'upload: " + err.message);
    }
}

async function saveProjectStep(projectId, step) {
    const payload = {};
    if (step === 1) {
        payload.title = document.getElementById('title').value;
        payload.territory = document.getElementById('territory').value;
        payload.short_description = document.getElementById('short_description').value;
        payload.cover_url = document.getElementById('cover_url').value;
        payload.vision = document.getElementById('vision').value;
        payload.mission = document.getElementById('mission').value;
        payload.enjeu = document.getElementById('enjeu').value;
    } else if (step === 2) {
        payload.equipe = document.getElementById('equipe').value;
    } else if (step === 3) {
        payload.sector = document.getElementById('sector').value;
        payload.marche = document.getElementById('marche').value;
    } else if (step === 4) {
        payload.innovation_tier = document.getElementById('innovation_tier').value;
        payload.impact_local = document.getElementById('impact_local').value;
        payload.innovation = document.getElementById('innovation').value;
        payload.emplois = document.getElementById('emplois').value;
    } else if (step === 5) {
        payload.funding_goal = parseFloat(document.getElementById('funding_goal').value);
        payload.budget = document.getElementById('budget').value;
    } else if (step === 6) {
        payload.pitch_texte = document.getElementById('pitch_texte').value;
        payload.verification_status = 'pending';
        payload.status = 'active';
    }

    try {
        const { error } = await _supabase.from('projects').update(payload).eq('id', projectId);
        if (error) throw error;

        if (step === 6) {
            alert("Votre projet a été soumis avec succès ! L'administrateur va l'examiner très prochainement.");
            window.location.reload();
        } else {
            // Re-load maturity and go to next step
            const { data: p } = await _supabase.from('projects').select('*').eq('id', projectId).single();
            renderCockpitWithStep(p, step + 1);
        }
    } catch (err) {
        alert("Erreur de sauvegarde: " + err.message);
    }
}

async function startNewProjectWizard() {
    let title = prompt("Nom de votre nouvelle épopée :");
    if (!title) return;
    
    try {
        const session = await getSession();
        if (!session) return;
        
        const { data: p, error } = await _supabase.from('projects').insert([{
            owner_id: session.user.id,
            title: title,
            description: "",
            vision: "",
            mission: "",
            enjeu: "",
            equipe: "",
            marche: "",
            impact_local: "",
            innovation: "",
            pitch_texte: "",
            funding_goal: 0,
            territory: 'À définir',
            status: 'draft',
            verification_status: 'none'
        }]).select().single();
        
        if (error) throw error;
        
        // Open the cockpit directly at step 1
        openProjectCockpit(p.id, 1);
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function loadMatchmaking(userId, projectId) {
    const container = document.getElementById('matches-container');
    const section = document.getElementById('matchmaking-section');
    if (!container || !section) return;

    try {
        const { data: profile } = await _supabase.from('profiles').select('subscription_tier, role').eq('id', userId).single();
        if (!profile) return;

        const isPremium = profile.subscription_tier === 'business' || profile.subscription_tier === 'enterprise' || profile.role === 'admin';
        
        // On débloque la vue pour le porteur du projet lui-même
        const canSeeMatches = true; // User specifically asked to re-enable access for project owners

        section.style.display = 'block';

        if (!canSeeMatches) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 16px; color: #64748b; font-weight: 900;">PRIVÉ</div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Activez vos Pépites</h3>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px;">Le pack Business débloque l'algorithme qui trouve les meilleurs experts pour votre projet.</p>
                    <a href="/#pricing" class="cta-button primary" style="background:#10b981; border:none;">Découvrir le Pack Business</a>
                </div>
            `;
            return;
        }

        // Récupérer les 3 derniers matchs (Experts)
        const { data: experts, error } = await _supabase
            .from('profiles')
            .select('*')
            .eq('role', 'expert')
            .eq('listed', true)
            .limit(3);

        if (error) throw error;

        if (experts && experts.length > 0) {
            container.innerHTML = experts.map(renderMatchCard).join('');
        } else {
            container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">Aucune pépite trouvée pour le moment.</p>';
        }
    } catch (err) {
        console.error("Load Matchmaking Error:", err);
    }
}

function renderMatchCard(expert) {
    const name = expert.full_name || 'Expert';
    const initials = name.slice(0, 2).toUpperCase();
    const avatar = expert.avatar_url 
        ? `<img src="${expert.avatar_url}" style="width:40px; height:40px; border-radius:8px; object-fit:cover;">`
        : `<div style="width:40px; height:40px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-weight:800; color:#475569;">${initials}</div>`;

    return `
        <div class="dash-card-premium" style="padding: 20px; border: 1px solid #e2e8f0; border-radius: 20px; background: white;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                ${avatar}
                <div style="overflow:hidden;">
                    <div style="font-size:0.95rem; font-weight:800; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${name}</div>
                    <div style="font-size:0.75rem; color:#7c3aed; font-weight:700;">${expert.title || 'Expert Stratégique'}</div>
                </div>
            </div>
            <p style="font-size:0.85rem; color:#64748b; margin-bottom:16px; line-height:1.4;">Match basé sur vos besoins en ${expert.sector || 'Expertise'}.</p>
            <a href="messages.html?to=${expert.id}" class="cta-button primary" style="background:#0f172a; padding:8px 16px; font-size:0.8rem; height:auto; width:100%; justify-content:center;">Contacter cet expert</a>
        </div>
    `;
}

function closeProjectCockpit() {
    // On force le rendu de la vue liste pour vider le cockpit en cas de blocage d'URL
    if (typeof showView === 'function') {
        showView('success-engine', true);
        window.location.hash = 'success-engine';
    } else {
        window.location.hash = 'success-engine';
    }
}

function openImpulsionModal(projectId) {
    alert("Phase d'Impulsion : Cette fonctionnalité (Certificat de Maturité) arrive très prochainement dans votre cockpit !");
}

// --- 3. MANIFESTO & STRATEGY ---

async function updateProjectManifesto(projectId) {
    const vision = document.getElementById('manifesto-vision').value.trim();
    const mission = document.getElementById('manifesto-mission').value.trim();
    const enjeu = document.getElementById('manifesto-enjeu').value.trim();

    try {
        const session = await getSession();
        if (!session) throw new Error("Veuillez vous reconnecter.");

        if (projectId === 'new') {
            const { data, error } = await _supabase
                .from('projects')
                .insert([{ 
                    owner_id: session.user.id, 
                    vision, mission, enjeu,
                    title: 'Nouvelle Épopée',
                    description: '',
                    status: 'draft'
                }])
                .select();
            if (error) throw error;
            alert("✅ Épopée créée !");
            window.location.reload();
        } else {
            const { error } = await _supabase
                .from('projects')
                .update({ vision, mission, enjeu })
                .eq('id', projectId);
            if (error) throw error;
            alert("✅ Manifeste enregistré !");
        }
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

// --- 4. ARSENAL (RESOURCES & BUDGET) ---

async function openArsenalModal(projectId) {
    const session = await getSession();
    if (!session) return;

    const { data: p } = await _supabase.from('projects')
        .select('id, title, status, description, territory, vision, mission, enjeu, needs, roadmap, budget, cover_url')
        .eq('id', projectId).single();
    if (!p) return;

    let modal = document.getElementById('arsenal-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="arsenal-modal">
                <div class="hero-modal">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px;">
                        <div>
                            <h2>L'Arsenal Commando</h2>
                            <p style="color:rgba(255,255,255,0.6); font-size:0.9rem; margin:0;">Étape 3 : Définissez vos moyens.</p>
                        </div>
                        <button class="modal-close" onclick="closeArsenalModal()">×</button>
                    </div>
                    <form id="arsenal-form" onsubmit="saveArsenal(event)">
                        <input type="hidden" id="arsenal-proj-id" value="${projectId}">
                        <div style="margin-bottom:24px;">
                            <label class="form-label">Budget Estimé</label>
                            <select id="arsenal-budget" required>
                                <option value="bootstrap" ${p.budget==='bootstrap'?'selected':''}>Bootstrap / 0€</option>
                                <option value="seed" ${p.budget==='seed'?'selected':''}>Amorçage (1k - 10k€)</option>
                                <option value="growth" ${p.budget==='growth'?'selected':''}>Croissance (10k - 50k€)</option>
                                <option value="scale" ${p.budget==='scale'?'selected':''}>Accélération (50k€+)</option>
                            </select>
                        </div>
                        <div style="margin-bottom:24px;">
                            <label class="form-label">Image de Couverture</label>
                            <input type="file" id="arsenal-cover-file" accept="image/*" onchange="handleArsenalFileSelect(this)">
                            <input type="hidden" id="arsenal-cover-url" value="${p.cover_url || ''}">
                        </div>
                        <div style="margin-bottom:32px;">
                            <label class="form-label">Besoins Techniques</label>
                            <textarea id="arsenal-needs">${p.needs || ''}</textarea>
                        </div>
                        <button type="submit" class="btn-cockpit primary" id="btn-save-arsenal" style="width:100%;">Valider mon Arsenal</button>
                    </form>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('arsenal-modal');
    }
    modal.classList.add('open');
}

function closeArsenalModal() {
    document.getElementById('arsenal-modal').classList.remove('open');
}

// --- CROWDFUNDING LOADERS ---

function openRewardModal(projectId) {
    const modal = document.getElementById('reward-modal');
    if (!modal) return;
    document.getElementById('reward-proj-id').value = projectId;
    modal.style.display = 'flex';
}

function openMilestoneModal(projectId) {
    const modal = document.getElementById('milestone-modal');
    if (!modal) return;
    document.getElementById('milestone-proj-id').value = projectId;
    modal.style.display = 'flex';
}

async function saveReward(projectId) {
    const title = document.getElementById('reward-title').value;
    const desc = document.getElementById('reward-desc').value;
    const amount = parseFloat(document.getElementById('reward-amount').value);
    const stock = document.getElementById('reward-stock').value;
    const imageUrl = document.getElementById('reward-image-url').value;

    if (!title || !amount) return alert("Veuillez remplir le titre et le montant.");

    try {
        const { error } = await _supabase.from('project_rewards').insert([{
            project_id: projectId,
            title,
            description: desc,
            amount_threshold: amount,
            stock: stock ? parseInt(stock) : null,
            image_url: imageUrl
        }]);

        if (error) throw error;
        document.getElementById('reward-modal').style.display = 'none';
        loadDashboardRewards(projectId);
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function saveMilestone(projectId) {
    const title = document.getElementById('milestone-title').value;
    const threshold = parseFloat(document.getElementById('milestone-threshold').value);
    const desc = document.getElementById('milestone-desc').value;

    if (!title || !threshold) return alert("Veuillez remplir le titre et l'objectif.");

    try {
        const { error } = await _supabase.from('project_milestones').insert([{
            project_id: projectId,
            title,
            funding_goal: threshold,
            description: desc
        }]);

        if (error) throw error;
        document.getElementById('milestone-modal').style.display = 'none';
        loadDashboardMilestones(projectId);
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function handleRewardImageUpload(input) {
    const file = input.files[0];
    if (!file) return;
    
    const projectId = document.getElementById('reward-proj-id').value;
    const preview = document.getElementById('reward-visual-preview');
    
    try {
        const session = await getSession();
        const fileExt = file.name.split('.').pop();
        const fileName = `${session.user.id}/reward_${projectId}_${Math.random()}.${fileExt}`;
        
        const { error } = await _supabase.storage.from('avatars').upload(fileName, file);
        if (error) throw error;

        const { data: { publicUrl } } = _supabase.storage.from('avatars').getPublicUrl(fileName);
        document.getElementById('reward-image-url').value = publicUrl;
        if (preview) preview.style.background = `url('${publicUrl}') center/cover`;
    } catch (err) {
        alert("Erreur upload: " + err.message);
    }
}

async function loadDashboardRewards(projectId) {
    const list = document.getElementById('dash-rewards-list');
    if (!list) return;

    try {
        const { data: rewards, error } = await _supabase
            .from('project_rewards')
            .select('*')
            .eq('project_id', projectId)
            .order('amount_threshold', { ascending: true });

        if (error) throw error;

        if (!rewards || rewards.length === 0) {
            list.innerHTML = `
                <div style="grid-column: 1 / -1; background:#f8fafc; border:1px dashed #e2e8f0; border-radius:16px; padding:24px; text-align:center;">
                    <p style="color:#64748b; font-size:0.85rem; margin:0;">Aucune récompense créée.<br>Offrez des contreparties pour attirer des contributeurs.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = rewards.map(r => `
            <div class="reward-mini-card">
                <div style="font-weight:900; font-size:1rem; color:#7c3aed;">${r.amount_threshold} €</div>
                <div style="font-weight:800; font-size:0.85rem; margin:4px 0;">${r.title}</div>
                <button onclick="deleteReward('${r.id}', '${projectId}')" style="position:absolute; top:8px; right:8px; background:none; border:none; color:#ef4444; cursor:pointer; font-size:0.75rem;">×</button>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function loadDashboardMilestones(projectId) {
    const list = document.getElementById('dash-milestones-list');
    if (!list) return;

    try {
        const { data: milestones, error } = await _supabase
            .from('project_milestones')
            .select('*')
            .eq('project_id', projectId)
            .order('funding_goal', { ascending: true });

        if (error) throw error;

        if (!milestones || milestones.length === 0) {
            list.innerHTML = `
                <div style="background:#f8fafc; border:1px dashed #e2e8f0; border-radius:16px; padding:16px; text-align:center;">
                    <p style="color:#64748b; font-size:0.8rem; margin:0;">Définissez vos paliers de financement.</p>
                </div>
            `;
            return;
        }

        list.innerHTML = milestones.map(m => `
            <div style="background:white; border:1px solid #e2e8f0; border-radius:12px; padding:12px; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-weight:900; font-size:0.85rem; color:#10b981;">${m.funding_goal.toLocaleString()} €</div>
                    <div style="font-weight:700; font-size:0.75rem;">${m.title}</div>
                </div>
                <button onclick="deleteMilestone('${m.id}', '${projectId}')" style="background:#fee2e2; color:#ef4444; border:none; padding:4px 8px; border-radius:6px; cursor:pointer; font-size:0.65rem;">Suppr.</button>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function deleteReward(rewardId, projectId) {
    if (!confirm("Supprimer cette récompense ?")) return;
    const { error } = await _supabase.from('project_rewards').delete().eq('id', rewardId);
    if (!error) loadDashboardRewards(projectId);
}

async function deleteMilestone(milestoneId, projectId) {
    if (!confirm("Supprimer ce palier ?")) return;
    const { error } = await _supabase.from('project_milestones').delete().eq('id', milestoneId);
    if (!error) loadDashboardMilestones(projectId);
}

async function openProjectModal() {
    let modal = document.getElementById('project-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="project-modal" style="display:none; align-items:center; justify-content:center; z-index:10000; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5);">
                <div class="hero-modal" style="max-width:600px; background:white; padding:40px; border-radius:32px; color:#0f172a; border:none;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
                        <h2 style="margin:0; font-size:1.5rem; font-weight:900;">Nouvelle Épopée</h2>
                        <button onclick="document.getElementById('project-modal').style.display='none'" style="background:none; border:none; font-size:1.5rem; cursor:pointer;">×</button>
                    </div>
                    <div style="display:grid; gap:20px;">
                        <div class="form-group">
                            <label style="display:block; font-size:0.75rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Nom de votre projet</label>
                            <input type="text" id="new-project-title" placeholder="Ex: Mon Application Mobile" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-weight:700;">
                        </div>
                        <div class="form-group">
                            <label style="display:block; font-size:0.75rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Territoire d'Impact</label>
                            <select id="new-project-territory" style="width:100%; padding:14px; border:1px solid #e2e8f0; border-radius:12px; font-weight:700;">
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Guyane">Guyane</option>
                                <option value="Réunion">Réunion</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Hexagone">Hexagone / Diaspora</option>
                            </select>
                        </div>
                        <button onclick="saveNewProject()" class="btn-cockpit primary" style="width:100%; padding:16px; background:#10b981; border:none; color:white; font-weight:900; border-radius:12px; cursor:pointer;">CRÉER MON PROJET →</button>
                    </div>
                </div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('project-modal');
    }
    modal.style.display = 'flex';
}

async function saveNewProject() {
    const title = document.getElementById('new-project-title').value.trim();
    const territory = document.getElementById('new-project-territory').value;
    if (!title) return alert("Veuillez donner un nom à votre épopée.");

    try {
        const session = await getSession();
        if (!session) return;

        const payload = {
            owner_id: session.user.id,
            title: title,
            territory: territory,
            description: "", 
            status: 'draft'
        };
        // Sécurité anti-cache: s'assurer qu'aucun champ 'name' résiduel ne pollue l'objet
        delete payload.name; 

        const { error } = await _supabase.from('projects').insert([payload]);
        if (error) throw error;
        alert("✅ Épopée créée avec succès !");
        window.location.reload();
    } catch (err) { alert(err.message); }
}

async function deleteSREProject(id) {
    if (!confirm("⚠️ Cette action est irréversible.\n\nSouhaitez-vous vraiment supprimer cette Épopée ?")) return;
    
    try {
        // Step 1: Delete associated rewards
        const { error: errRewards } = await _supabase.from('project_rewards').delete().eq('project_id', id);
        if (errRewards) throw errRewards;

        // Step 2: Delete associated milestones
        const { error: errMilestones } = await _supabase.from('project_milestones').delete().eq('project_id', id);
        if (errMilestones) throw errMilestones;

        // Step 3: Delete the project itself
        const { error: errProject } = await _supabase.from('projects').delete().eq('id', id);
        if (errProject) throw errProject;
        
        const session = await getSession();
        if (session) await loadMyProjects(session.user.id);
        alert("✅ Épopée supprimée.");
    } catch (err) {
        alert("Erreur suppression: " + err.message);
    }
}

window.openProjectModal = openProjectModal;
window.saveNewProject = saveNewProject;
window.loadMyProjects = loadMyProjects;
window.calculateProjectMaturity = calculateProjectMaturity;
window.closeProjectCockpit = closeProjectCockpit;
window.startNewProjectWizard = startNewProjectWizard;
window.renderCockpitWithStep = renderCockpitWithStep;
window.saveProjectStep = saveProjectStep;
window.deleteSREProject = deleteSREProject;
window.handleIDUpload = handleIDUpload;
window.openProjectCockpit = openProjectCockpit;
window.loadMyProjects = loadMyProjects;
window.calculateProjectMaturity = calculateProjectMaturity;
