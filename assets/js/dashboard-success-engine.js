// --- 1. COORDINATION & STEPPER ---

function updateSuccessStepper(score, projectId) {
    const steps = [
        { id: 'cockpit-step-1', threshold: 0, label: '01. Vision', hint: 'Concept & Vision' },
        { id: 'cockpit-step-2', threshold: 16, label: '02. Équipe', hint: 'Le Commando' },
        { id: 'cockpit-step-3', threshold: 32, label: '03. Marché', hint: 'Le Terrain' },
        { id: 'cockpit-step-4', threshold: 49, label: '04. Impact', hint: 'Valeur & Jobs' },
        { id: 'cockpit-step-5', threshold: 66, label: '05. Budget', hint: 'Financement' },
        { id: 'cockpit-step-6', threshold: 83, label: '06. Lancement', hint: 'Pitch & Soumission' }
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

async function loadMyProjects(userId, forceRenderList = false, inspectId = null) {
    if (!userId && !inspectId) return;
    try {
        let query = window._supabase.from('projects').select('*');
        if (inspectId) {
            query = query.eq('id', inspectId).single();
        } else {
            query = query.eq('owner_id', userId).order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;
        const projects = inspectId ? [data] : (data || []);

        // --- 1. SYNCHRONISATION AVEC L'OVERVIEW (Maturité & Collecte) ---
        if (projects && projects.length > 0) {
            const latest = projects[0];
            const maturityEl = document.getElementById('maturity-score-dash');
            const collectedEl = document.getElementById('collected-amount-dash');
            
            if (maturityEl) {
                const score = typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity(latest) : 0;
                maturityEl.textContent = `${score} %`;
            }
            if (collectedEl) {
                const total = projects.reduce((acc, p) => acc + (parseFloat(p.total_raised) || 0), 0);
                collectedEl.textContent = `${total.toLocaleString()} €`;
            }
        }

        // --- 2. RENDU DE LA VUE "L'ÉPOPÉE" (Pilotage Central) ---
        const engineView = document.getElementById('success-engine-view-fixed');
        if (engineView) {
            const hash = window.location.hash;
            const isListView = hash === '#success-engine' && !hash.includes('id=');
            
            if (isListView || forceRenderList || inspectId) {
                let listHTML = `
                    <div id="project-list-view" style="animation: fadeIn 0.4s ease-out; width:100%; max-width:1400px; margin:0 auto; padding:20px;">
                        <div class="dash-pilotage-header" style="margin-bottom:48px; display:flex; justify-content:space-between; align-items:flex-end;">
                            <div>
                                <h1 style="font-size: 3.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.06em;">L'ÉPOPÉE</h1>
                                <p style="color: #64748b; font-size: 1.2rem; font-weight: 500; margin-top: 12px; max-width:600px;">Gérez vos projets à impact territorial et pilotez vos ambitions stratégiques pas à pas.</p>
                            </div>
                            <div style="background: white; padding: 16px 32px; border-radius: 20px; border: 1px solid #e2e8f0; display: flex; align-items: center; gap: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
                                <div style="text-align:right;">
                                    <span style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; display:block;">Total Épopées</span>
                                    <span style="font-size: 1.8rem; font-weight: 950; color: #10b981;">${projects.length}</span>
                                </div>
                            </div>
                        </div>

                        <div class="ecosystem-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px;">
                            <!-- Card : Nouvelle Épopée -->
                            <div class="dash-card-premium" style="background: linear-gradient(135deg, #020617 0%, #0f172a 100%); color: white; display:flex; flex-direction:column; justify-content:space-between; padding:48px; border:none; position:relative; overflow:hidden; border-radius: 40px; min-height: 420px; cursor: pointer; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 20px 40px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-12px)'; this.style.boxShadow='0 40px 70px rgba(0,0,0,0.25)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 20px 40px rgba(0,0,0,0.15)';" onclick="startNewProjectWizard()">
                                <div style="position:relative; z-index:2;">
                                    <div style="background:#10b981; width:70px; height:70px; border-radius:24px; display:flex; align-items:center; justify-content:center; margin-bottom:40px; box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);">
                                         <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3.5"><path d="M12 5v14M5 12h14"/></svg>
                                    </div>
                                    <h2 style="color: white; margin: 0; font-size: 2.5rem; font-weight: 950; letter-spacing:-0.05em; line-height:1.1;">Commencer une<br><span style="color:#10b981;">Nouvelle Épopée</span></h2>
                                    <p style="color: rgba(255,255,255,0.5); margin: 20px 0 0 0; font-size: 1.1rem; font-weight:500; line-height:1.6;">Créez un nouveau projet et profitez de notre moteur de succès.</p>
                                </div>
                                <div style="position:relative; z-index:2; margin-top: auto;">
                                    <button class="cta-button primary" style="background: #10b981; color: white; font-weight:950; border:none; padding:22px 32px; width:100%; justify-content:center; border-radius:20px; font-size: 1.15rem;">Démarrer l'Aventure →</button>
                                </div>
                                <div style="position:absolute; bottom:-80px; right:-80px; width:250px; height:250px; background:rgba(16, 185, 129, 0.15); border-radius:50%; filter:blur(80px);"></div>
                            </div>

                            ${projects.length > 0 ? projects.map(p => {
                                const score = typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity(p) : 0;
                                return `
                                <div class="cockpit-card-premium" style="position:relative; display:flex; flex-direction:column; padding:48px; border-radius:40px; background: white; border: 1px solid #e2e8f0; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); box-shadow: 0 15px 35px rgba(0,0,0,0.03);" onmouseover="this.style.transform='translateY(-12px)'; this.style.boxShadow='0 40px 80px rgba(0,0,0,0.1)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 15px 35px rgba(0,0,0,0.03)';" onclick="openProjectCockpit('${p.id}')">
                                    <button onclick="event.stopPropagation(); deleteSREProject('${p.id}')" style="position:absolute; top:32px; right:32px; background:#f8fafc; border:1px solid #e2e8f0; color:#94a3b8; width:40px; height:40px; border-radius:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-weight:800; transition:0.2s;" title="Supprimer ce projet">×</button>
                                    
                                    <div style="display:flex; align-items:center; gap:16px; margin-bottom:32px;">
                                        <div style="background:${p.status === 'approved' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)'}; color:${p.status === 'approved' ? '#10b981' : '#64748b'}; padding:10px 20px; border-radius:100px; font-size:0.7rem; font-weight:950; letter-spacing:0.08em; text-transform:uppercase; border:1px solid ${p.status === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(0,0,0,0.05)'}">${p.status === 'approved' ? 'Épopée Validée' : 'Mode Brouillon'}</div>
                                    </div>

                                    <h2 style="font-size: 2.2rem; font-weight:950; color:#0f172a; margin:0 0 16px 0; letter-spacing:-0.05em; line-height:1.2;">${p.title || p.name || 'Sans titre'}</h2>
                                    <div style="font-size:1.1rem; color:#64748b; margin-bottom:48px; font-weight:600; display:flex; align-items:center; gap:10px;">
                                        <span style="opacity:0.6;">📍</span> ${p.territory || 'Territoire à définir'}
                                    </div>
                                    
                                    <div style="margin-top:auto; padding-top:40px; border-top:1.5px solid #f8fafc;">
                                        <div style="display: flex; justify-content: space-between; align-items:flex-end; margin-bottom: 24px;">
                                            <div>
                                                <span style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">Maturité Stratégique</span>
                                                <span style="font-size:3rem; font-weight:950; color: #0f172a; letter-spacing:-0.06em;">${score}%</span>
                                            </div>
                                            <div style="text-align:right;">
                                                <span style="display:block; font-size:0.75rem; font-weight:900; color:#94a3b8; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:12px;">Collecté</span>
                                                <span style="font-size:1.5rem; font-weight:950; color: #10b981; background:rgba(16, 185, 129, 0.05); padding:10px 20px; border-radius:16px; border:1px solid rgba(16,185,129,0.1);">${(p.total_raised || 0).toLocaleString()} €</span>
                                            </div>
                                        </div>

                                        <div class="dash-progress-container" style="height:18px; margin-bottom:40px; background:#f1f5f9; border-radius:100px; overflow:hidden; border: 1px solid #f1f5f9; padding:2px;">
                                            <div class="dash-progress-bar" style="width: ${score}%; height:100%; border-radius:100px; background:linear-gradient(90deg, #10b981 0%, #34d399 100%); box-shadow: 0 4px 15px rgba(16, 185, 129, 0.2);"></div>
                                        </div>

                                        <button class="cta-button primary" style="width:100%; justify-content:center; font-weight:950; background:#0f172a; border-radius:24px; font-size:1.15rem; padding:22px; border:none; color:white; cursor:pointer; transition:0.3s; box-shadow:0 20px 40px rgba(15, 23, 42, 0.15);">PILOTER L'ÉPOPÉE →</button>
                                    </div>
                                </div>
                                `;
                            }).join('') : ''}
                        </div>
                    </div>
                    
                    <div id="project-cockpit-view" style="display: none; animation: fadeIn 0.4s ease-out;">
                        <div id="cockpit-content-internal"></div>
                    </div>
                `;
                engineView.innerHTML = listHTML;
                engineView.style.display = 'block';
            }
        }

        // --- 3. RENDU DE LA BARRE LATÉRALE (OwnersModule) ---
        const sidebarContainer = document.getElementById('owners-projects-view');
        if (sidebarContainer) {
            if (!projects || projects.length === 0) {
                sidebarContainer.innerHTML = `
                    <div style="text-align: center; border: 2px dashed #f1f5f9; padding: 24px; border-radius: 20px;">
                        <p style="color: #94a3b8; font-weight: 600; font-size: 0.85rem;">Aucune épopée active.</p>
                    </div>
                `;
            } else {
                sidebarContainer.innerHTML = `
                    <div style="display: grid; gap: 12px;">
                        ${projects.map(p => {
                            const score = typeof calculateProjectMaturity === 'function' ? calculateProjectMaturity(p) : 0;
                            return `
                                <div onclick="openProjectCockpit('${p.id}')" style="cursor:pointer; padding:16px; background:#f8fafc; border:1px solid #e2e8f0; border-radius:16px; transition:0.2s;" onmouseover="this.style.borderColor='#10b981'" onmouseout="this.style.borderColor='#e2e8f0'">
                                    <div style="font-size:0.85rem; font-weight:800; color:#0f172a; margin-bottom:4px;">${p.title || 'Sans titre'}</div>
                                    <div class="dash-progress-container" style="height:4px; background:#e2e8f0; margin-bottom:4px;">
                                        <div class="dash-progress-bar" style="width:${score}%; background:#10b981;"></div>
                                    </div>
                                    <div style="display:flex; justify-content:space-between; font-size:0.65rem; font-weight:700; color:#64748b;">
                                        <span>${score}%</span>
                                        <span>${(p.total_raised || 0).toLocaleString()} €</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }
        }
    } catch (err) {
        console.error("[SuccessEngine] Error loading projects:", err);
    }
}

async function openProjectCockpit(projectId, initialStep = 1) {
    const list = document.getElementById('project-list-view');
    const cockpit = document.getElementById('project-cockpit-view');
    const content = document.getElementById('cockpit-content-internal');
    
    if (!list || !cockpit || !content) return;

    try {
        const { data: p, error } = await window._supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;

        // Mise à jour de l'URL pour la persistance au rafraîchissement
        const newPath = `#success-engine?id=${projectId}`;
        if (window.Router) window.Router.updateUrl(newPath);

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
        { num: 1, title: '01. Vision', subtitle: 'Concept & Identité' },
        { num: 2, title: '02. Équipe', subtitle: 'Le Commando' },
        { num: 3, title: '03. Marché', subtitle: 'Opportunités' },
        { num: 4, title: '04. Impact', subtitle: 'Valeur Locale' },
        { num: 5, title: '05. Budget', subtitle: 'Financement' },
        { num: 6, title: '06. Soumission', subtitle: 'Validation Finale' }
    ];

    const current = stepsInfo.find(s => s.num === step);
    let stepHTML = `
        <div class="cockpit-container" style="max-width: 1100px; margin: 0 auto; padding-bottom: 100px;">
            <div class="cockpit-header" style="margin-bottom: 48px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px;">
                    <a href="#success-engine" onclick="event.preventDefault(); window.Router.navigate('#success-engine');" 
                       class="cta-button secondary" style="border-radius: 100px; padding: 12px 24px; font-weight: 800; font-size: 0.85rem; border: 1px solid #e2e8f0; background: white; box-shadow: 0 4px 12px rgba(0,0,0,0.02);">
                        &larr; Retour aux Projets
                    </a>
                    <div style="display: flex; align-items: center; gap: 16px;">
                        <span style="font-size: 0.75rem; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em;">Progression</span>
                        <div style="width: 150px; height: 8px; background: #f1f5f9; border-radius: 100px; overflow: hidden; border: 1px solid #f1f5f9;">
                            <div style="width: ${Math.round((step/6)*100)}%; height: 100%; background: #10b981; border-radius: 100px;"></div>
                        </div>
                        <span style="font-size: 1rem; font-weight: 900; color: #0f172a;">${step}/6</span>
                    </div>
                </div>

                <div style="text-align: center; margin-bottom: 48px;">
                    <span style="background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; display: inline-block; margin-bottom: 16px;">PILOTAGE : ${p.title || 'SANS TITRE'}</span>
                    <h1 style="font-size: 3.5rem; font-weight: 950; color: #0f172a; margin: 0; letter-spacing: -0.05em; line-height: 1;">${current.title}</h1>
                    <p style="color: #64748b; font-size: 1.25rem; font-weight: 500; margin-top: 12px;">${current.subtitle}</p>
                </div>

                <div class="cockpit-stepper" style="display: flex; gap: 8px; background: white; padding: 8px; border-radius: 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.03); margin-bottom: 48px;">
                    ${stepsInfo.map(s => `
                        <div onclick="renderCockpitWithStep(${JSON.stringify(p).replace(/"/g, '&quot;')}, ${s.num})" 
                             style="flex: 1; padding: 16px 8px; border-radius: 18px; text-align: center; cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); ${s.num === step ? 'background: #0f172a; color: white;' : 'color: #94a3b8;'}">
                            <div style="font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; opacity: ${s.num === step ? '0.7' : '1'}">ÉTAPE ${s.num}</div>
                            <div style="font-size: 0.9rem; font-weight: 900; letter-spacing: -0.02em;">${s.title.split('. ')[1]}</div>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="cockpit-card-premium" style="background: white; border-radius: 40px; border: 1px solid #e2e8f0; box-shadow: 0 20px 50px rgba(0,0,0,0.04); animation: slideUp 0.5s ease-out; padding: 56px;">
                ${renderStepFields(step, p)}
                
                <div class="cockpit-footer-buttons" style="margin-top: 64px; padding-top: 48px; border-top: 1px solid #f1f5f9; display: flex; justify-content: space-between; gap: 24px;">
                    <button onclick="${step > 1 ? `renderCockpitWithStep(${JSON.stringify(p).replace(/"/g, '&quot;')}, ${step-1})` : 'closeProjectCockpit()'}" 
                            class="cta-button secondary" style="flex: 1; justify-content: center; padding: 20px; border-radius: 18px; font-weight: 800; font-size: 1rem; border: 1px solid #e2e8f0; cursor: pointer;">
                         ${step > 1 ? '← Étape Précédente' : 'Quitter le Pilote'}
                    </button>
                    
                    ${window.isAdminInspection ? `
                        <button onclick="approveProjectFromInspection('${p.id}')" class="cta-button primary" style="flex: 2; justify-content: center; background: #10b981; color: white; padding: 20px; border-radius: 18px; font-weight: 900; font-size: 1.1rem; border: none; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.25); cursor: pointer;">APPROUVER L'ÉPOPÉE ✓</button>
                    ` : `
                        <button onclick="saveProjectStep('${p.id}', ${step})" 
                                class="cta-button primary" style="flex: 2; justify-content: center; background: #10b981; color: white; padding: 20px; border-radius: 18px; font-weight: 900; font-size: 1.1rem; border: none; box-shadow: 0 15px 30px rgba(16, 185, 129, 0.25); cursor: pointer;">
                                ${step === 6 ? 'SOUMETTRE MON ÉPOPÉE 🚀' : 'Enregistrer & Étape Suivante →'}
                        </button>
                    `}
                </div>
            </div>
        </div>
    `;

    content.innerHTML = stepHTML;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Initialisation dynamique des données de crowdfunding à l'étape 5
    if (step === 5) {
        loadDashboardRewards(p.id);
        loadDashboardMilestones(p.id);
    }
}

function renderStepFields(step, p) {
    if (step === 1) {
        return `
            <div class="ecosystem-grid" style="display:grid; grid-template-columns: 1fr 1fr; gap:32px;">
                
                <!-- LEFT: BRANDING & IDENTITY -->
                <div style="display:flex; flex-direction:column; gap:24px;">
                    <div class="cockpit-field">
                        <label class="cockpit-field-label">IMAGE DE COUVERTURE</label>
                        <div class="cover-upload-container" style="border-radius:20px; overflow:hidden; border:1px solid #e2e8f0; background:#f8fafc; padding:12px;">
                            <input type="file" id="cover-upload" style="display:none;" onchange="handleCoverUpload(this, '${p.id}')">
                            <div id="cover-preview" class="cover-preview ${p.cover_url ? 'has-image' : ''}" 
                                 style="height:180px; border-radius:14px; background-color:#e2e8f0; ${p.cover_url ? `background-image: url('${p.cover_url}')` : ''} background-position:center; background-size:cover; margin-bottom:12px; display:flex; align-items:center; justify-content:center;">
                                ${!p.cover_url ? '<span style="color:#94a3b8; font-weight:800; font-size:0.85rem;">AUCUNE IMAGE</span>' : ''}
                            </div>
                            <button onclick="document.getElementById('cover-upload').click()" class="cta-button secondary" style="width:100%; justify-content:center; border-radius:12px; font-weight:800; font-size:0.75rem;">${p.cover_url ? 'CHANGER L\'IMAGE' : 'TÉLÉVERSER UN VISUEL'}</button>
                            <input type="hidden" id="cover_url" value="${p.cover_url || ''}">
                        </div>
                    </div>

                    <div class="cockpit-field">
                        <label class="cockpit-field-label">TITRE DE L'ÉPOPÉE *</label>
                        <input type="text" id="title" class="cockpit-input-premium" value="${p.title || ''}" placeholder="Ex: Horizon Caraïbe 2026" style="padding:18px; font-size:1.1rem; font-weight:800;">
                    </div>

                    <div class="cockpit-field">
                        <label class="cockpit-field-label">BASSIN TERRITORIAL</label>
                        <select id="territory" class="cockpit-input-premium" style="padding:18px; font-weight:700;">
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
                </div>

                <!-- RIGHT: STRATEGIC NARRATIVE -->
                <div style="display:flex; flex-direction:column; gap:24px;">
                    <div class="cockpit-field">
                        <label class="cockpit-field-label">L'ACCROCHE (SHORT PITCH)</label>
                        <input type="text" id="short_description" class="cockpit-input-premium" value="${p.short_description || ''}" placeholder="Votre projet en une phrase choc" style="padding:18px; font-weight:700;">
                        <span style="font-size:0.7rem; color:#94a3b8; font-weight:700; text-transform:uppercase; margin-top:6px; display:block;">Visible sur la marketplace</span>
                    </div>

                    <div class="cockpit-field">
                        <label class="cockpit-field-label">VOTRE VISION (LE FUTUR)</label>
                        <textarea id="vision" class="cockpit-input-premium" style="height:100px; font-size:0.95rem; line-height:1.6;" placeholder="Où voyez-vous l'impact de ce projet dans 5 ans ?">${p.vision || ''}</textarea>
                    </div>
                    
                    <div class="cockpit-field">
                        <label class="cockpit-field-label">L'ENJEU (LE POURQUOI ?)</label>
                        <textarea id="enjeu" class="cockpit-input-premium" style="height:100px; font-size:0.95rem; line-height:1.6;" placeholder="Quel problème critique ce projet résout-il pour le territoire ?">${p.enjeu || ''}</textarea>
                    </div>
                    
                    <div class="cockpit-field">
                        <label class="cockpit-field-label">VOTRE MISSION (L'ACTION MAINTENANT)</label>
                        <textarea id="mission" class="cockpit-input-premium" style="height:120px; font-size:0.95rem; line-height:1.6;" placeholder="Quelle est la prochaine étape majeure de votre exécution ?">${p.mission || ''}</textarea>
                    </div>
                </div>
            </div>

        `;
    } else if (step === 2) {
        return `
            <div class="ecosystem-grid">
                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <label class="cockpit-field-label">Présentation de l'équipe (Le Commando)</label>
                    <textarea id="equipe" class="cockpit-input-premium" style="min-height:180px;" placeholder="Qui sont les fondateurs et contributeurs clés ?">${p.equipe || ''}</textarea>
                </div>
            </div>
        `;
    } else if (step === 3) {
        return `
            <div class="ecosystem-grid">
                <div class="cockpit-field">
                    <label class="cockpit-field-label">Secteur d'activité</label>
                    <select id="sector" class="cockpit-input-premium">
                        <!-- Options identiques -->
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

                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <label class="cockpit-field-label">Opportunité & Marché local</label>
                    <textarea id="marche" class="cockpit-input-premium" style="min-height:150px;" placeholder="À qui s'adresse votre projet ? Quel est le potentiel local ?">${p.marche || ''}</textarea>
                </div>
            </div>
        `;
    } else if (step === 4) {
        return `
            <div class="ecosystem-grid">
                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <label class="cockpit-field-label">Niveau d'Innovation</label>
                    <select id="innovation_tier" class="cockpit-input-premium">
                        <option value="Incremental" ${p.innovation_tier==='Incremental'?'selected':''}>Incrémentale (Amélioration simple)</option>
                        <option value="Radical" ${p.innovation_tier==='Radical'?'selected':''}>Radicale (Changement profond)</option>
                        <option value="Disruptive" ${p.innovation_tier==='Disruptive'?'selected':''}>Disruptive (Rupture du marché)</option>
                        <option value="Social" ${p.innovation_tier==='Social'?'selected':''}>Sociale (Réponse à un besoin social)</option>
                    </select>
                </div>

                <div class="cockpit-field">
                    <label class="cockpit-field-label">Impact Territorial</label>
                    <textarea id="impact_local" class="cockpit-input-premium" placeholder="Qu'apportez-vous concrètement au territoire ?">${p.impact_local || ''}</textarea>
                </div>
                <div class="cockpit-field">
                    <label class="cockpit-field-label">Innovation / Différenciation</label>
                    <textarea id="innovation" class="cockpit-input-premium" placeholder="Pourquoi votre projet est-il unique ?">${p.innovation || ''}</textarea>
                </div>
                <div class="cockpit-field">
                    <label class="cockpit-field-label">Emplois Visés (Chiffre)</label>
                    <input type="text" id="emplois" class="cockpit-input-premium" value="${p.emplois || ''}" placeholder="Ex: 5 emplois créés">
                </div>
            </div>
        `;
    } else if (step === 5) {
        return `
            <div class="ecosystem-grid">
                <!-- Colonne Gauche : Objectif & Paliers -->
                <div class="cockpit-field">
                    <label class="cockpit-field-label">Montant Global Recherché (€)</label>
                    <input type="number" id="funding_goal" class="cockpit-input-premium" value="${p.funding_goal || 0}" placeholder="Ex: 50000">
                </div>

                <div class="cockpit-field">
                    <label class="cockpit-field-label">Usage des fonds</label>
                    <textarea id="budget" class="cockpit-input-premium" style="min-height:100px;" placeholder="Recrutement, R&D, Stock...">${p.budget || ''}</textarea>
                </div>

                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <label class="cockpit-field-label" style="margin:0;">Paliers d'Impact</label>
                        <button onclick="openMilestoneModal('${p.id}')" class="cta-button secondary" style="padding:4px 12px; font-size:0.7rem;">+ AJOUTER</button>
                    </div>
                    <div id="dash-milestones-list" class="crowdfunding-list-container">
                        <p style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Chargement des paliers...</p>
                    </div>
                </div>

                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <label class="cockpit-field-label" style="margin:0;">Offres & Récompenses</label>
                        <button onclick="openRewardModal('${p.id}')" class="cta-button primary" style="padding:4px 12px; font-size:0.7rem; background:#7c3aed; border:none;">+ CRÉER</button>
                    </div>
                    <div id="dash-rewards-list" class="crowdfunding-list-container">
                        <p style="color:#94a3b8; font-size:0.8rem; font-style:italic;">Chargement des récompenses...</p>
                    </div>
                </div>
            </div>
        `;
    } else if (step === 6) {
        return `
            <div class="ecosystem-grid">
                <div class="cockpit-field" style="grid-column: 1 / -1;">
                    <label class="cockpit-field-label">Votre Pitch Final (Le Grand Récit)</label>
                    <textarea id="pitch_texte" class="cockpit-input-premium" style="min-height:200px;" placeholder="Votre argumentaire pour convaincre.">${p.pitch_texte || ''}</textarea>
                </div>

                <div class="cockpit-card-premium" style="grid-column: 1 / -1; background: #f0fdf4; border-color: #10b981; text-align:center;">
                    <h4 style="margin:0 0 12px 0; color:#10b981; font-weight:900; font-size: 1.5rem;">Prêt pour le décollage ?</h4>
                    <p style="font-size:1.1rem; color:#065f46; margin:0 auto; line-height: 1.6; max-width:600px;">
                        Votre dossier sera examiné par l'équipe Domtom Connect. Vous recevrez une notification dès sa validation officielle.
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

        const { data, error } = await window._supabase.storage
            .from('avatars')
            .upload(filePath, file);

        if (error) throw error;

        const { data: { publicUrl } } = window._supabase.storage
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
        const { error } = await window._supabase.from('projects').update(payload).eq('id', projectId);
        if (error) throw error;

        if (step === 6) {
            alert("Votre projet a été soumis avec succès ! L'administrateur va l'examiner très prochainement.");
            window.location.reload();
        } else {
            // Re-load maturity and go to next step
            const { data: p } = await window._supabase.from('projects').select('*').eq('id', projectId).single();
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
        
        const { data: p, error } = await window._supabase.from('projects').insert([{
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
        const { data: profile } = await window._supabase.from('profiles').select('subscription_tier, role').eq('id', userId).single();
        if (!profile) return;

        const tier = profile.subscription_tier || 'free';
        const role = profile.role || 'user';
        const isExpert = (role === 'expert' || role === 'prestataire');
        const isPartner = (tier !== 'free') || !isExpert; // Pour les non-experts, on considère qu'ils ont accès
        
        section.style.display = 'block';

        // Récupérer les 3 derniers matchs (Experts)
        const { data: experts, error } = await window._supabase
            .from('profiles')
            .select('*')
            .eq('role', 'expert')
            .eq('listed', true)
            .limit(3);

        if (error) throw error;

        if (experts && experts.length > 0) {
            container.innerHTML = experts.map(expert => renderMatchCard(expert, !isPartner)).join('');
            
            // Add teaser overlay if not partner
            if (!isPartner) {
                const teaserHTML = `
                    <div class="gateway-teaser-overlay" style="border-radius:12px; height:auto; padding:20px; background:rgba(255,255,255,0.4); backdrop-filter:blur(1px);">
                        <div class="teaser-card" style="padding:24px; max-width:400px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
                            <h4 style="font-weight:900; margin:0 0 10px 0;">Pépites Détectées 💎</h4>
                            <p style="font-size:0.85rem; color:#64748b; margin-bottom:16px;">
                                Notre algorithme a identifié ${experts.length} experts pour votre projet. 
                                **Activez votre collaboration** pour débloquer ces recommandations.
                            </p>
                            <button onclick="openSubModal('authority')" class="cta-button primary" style="font-size:0.8rem; padding:10px 20px; border:none; background:#10b981;">🚀 Voir mes Pépites</button>
                        </div>
                    </div>
                `;
                container.style.position = 'relative';
                container.insertAdjacentHTML('beforeend', teaserHTML);
            }
        } else {
            container.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding:20px;">Aucune pépite trouvée pour le moment.</p>';
        }
    } catch (err) {
        console.error("Load Matchmaking Error:", err);
    }
}

function renderMatchCard(expert, isTeaser = false) {
    const name = expert.full_name || 'Expert';
    const initials = name.slice(0, 2).toUpperCase();
    const avatar = expert.avatar_url 
        ? `<img src="${expert.avatar_url}" alt="${name}">`
        : `<span>${initials}</span>`;

    return `
        <div class="match-card ${isTeaser ? 'teaser' : ''}">
            <div class="match-header">
                <div class="match-avatar">${avatar}</div>
                <div class="match-info">
                    <h4>${isTeaser ? 'Expert Certifié' : name}</h4>
                    <span>${expert.title || 'Expert Stratégique'}</span>
                </div>
            </div>
            <p style="font-size:0.85rem; color:#64748b; margin-bottom:12px; line-height:1.4;">
                ${isTeaser ? 'Expertise territoriale de haut niveau en attente de déblocage.' : `Expert en ${expert.sector || 'Expertise'}.`}
            </p>
            ${isTeaser ? '' : `<a href="messages.html?to=${expert.id}" class="cta-button primary" style="width:100%; justify-content:center; padding:10px; font-size:0.8rem;">Contacter</a>`}
        </div>
    `;
}

function closeProjectCockpit() {
    // On force le rendu de la vue liste pour vider le cockpit en cas de blocage d'URL
    if (window.Router) {
        window.Router.updateUrl('#success-engine');
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
            const { data, error } = await window._supabase
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
            const { error } = await window._supabase
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

    const { data: p } = await window._supabase.from('projects')
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
        const { error } = await window._supabase.from('project_rewards').insert([{
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
        const { error } = await window._supabase.from('project_milestones').insert([{
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
        
        const { error } = await window._supabase.storage.from('avatars').upload(fileName, file);
        if (error) throw error;

        const { data: { publicUrl } } = window._supabase.storage.from('avatars').getPublicUrl(fileName);
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
        const { data: rewards, error } = await window._supabase
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
                <div class="amount">${r.amount_threshold} €</div>
                <div style="font-weight:800; font-size:0.8rem; margin:4px 0;">${r.title}</div>
                <button onclick="deleteReward('${r.id}', '${projectId}')" class="delete-btn" style="position:absolute; top:12px; right:12px; background:none; border:none; color:#ef4444; opacity:0.3; cursor:pointer;">×</button>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function loadDashboardMilestones(projectId) {
    const list = document.getElementById('dash-milestones-list');
    if (!list) return;

    try {
        const { data: milestones, error } = await window._supabase
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
            <div class="milestone-mini-card">
                <div>
                    <div class="amount">${m.funding_goal.toLocaleString()} €</div>
                    <div style="font-weight:700; font-size:0.75rem;">${m.title}</div>
                </div>
                <button onclick="deleteMilestone('${m.id}', '${projectId}')" class="cta-button secondary" style="padding:4px 8px; font-size:0.6rem;">Suppr.</button>
            </div>
        `).join('');
    } catch (err) { console.error(err); }
}

async function deleteReward(rewardId, projectId) {
    if (!confirm("Supprimer cette récompense ?")) return;
    const { error } = await window._supabase.from('project_rewards').delete().eq('id', rewardId);
    if (!error) loadDashboardRewards(projectId);
}

async function deleteMilestone(milestoneId, projectId) {
    if (!confirm("Supprimer ce palier ?")) return;
    const { error } = await window._supabase.from('project_milestones').delete().eq('id', milestoneId);
    if (!error) loadDashboardMilestones(projectId);
}

async function openProjectModal() {
    let modal = document.getElementById('project-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="project-modal" style="display:none;">
                <div class="hero-modal" style="max-width:550px;">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:32px;">
                        <h2 style="margin:0; font-size:1.6rem; font-weight:900;">Nouvelle Épopée</h2>
                        <button onclick="document.getElementById('project-modal').style.display='none'" class="modal-close">×</button>
                    </div>
                    <div style="display:grid; gap:24px;">
                        <div class="cockpit-field">
                            <label class="cockpit-field-label">Nom de votre aventure</label>
                            <input type="text" id="new-project-title" class="cockpit-input-premium" placeholder="Ex: Mon Projet Impact">
                        </div>
                        <div class="cockpit-field">
                            <label class="cockpit-field-label">Territoire d'Impact</label>
                            <select id="new-project-territory" class="cockpit-input-premium">
                                <option value="Guadeloupe">Guadeloupe</option>
                                <option value="Martinique">Martinique</option>
                                <option value="Guyane">Guyane</option>
                                <option value="Réunion">Réunion</option>
                                <option value="Mayotte">Mayotte</option>
                                <option value="Hexagone">Hexagone / Diaspora</option>
                            </select>
                        </div>
                        <button onclick="saveNewProject()" class="cta-button primary" style="width:100%; justify-content:center; padding:18px; font-weight:900;">CRÉER MON PROJET →</button>
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

        const { error } = await window._supabase.from('projects').insert([payload]);
        if (error) throw error;
        alert("✅ Épopée créée avec succès !");
        window.location.reload();
    } catch (err) { alert(err.message); }
}

async function deleteSREProject(id) {
    if (!confirm("⚠️ Cette action est irréversible.\n\nSouhaitez-vous vraiment supprimer cette Épopée ?")) return;
    
    try {
        // Step 1: Delete associated rewards
        const { error: errRewards } = await window._supabase.from('project_rewards').delete().eq('project_id', id);
        if (errRewards) throw errRewards;

        // Step 2: Delete associated milestones
        const { error: errMilestones } = await window._supabase.from('project_milestones').delete().eq('project_id', id);
        if (errMilestones) throw errMilestones;

        // Step 3: Delete the project itself
        const { error: errProject } = await window._supabase.from('projects').delete().eq('id', id);
        if (errProject) throw errProject;
        
        const session = await getSession();
        if (session) await loadMyProjects(session.user.id);
        
        alert("✅ Épopée supprimée.");
    } catch (err) {
        alert("Erreur suppression: " + err.message);
    }
}

async function handleIDUpload(input) {
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    const btn = document.getElementById('id-upload-btn');
    const progContainer = document.getElementById('id-upload-progress');
    
    if (btn) btn.style.display = 'none';
    if (progContainer) {
        progContainer.style.display = 'block';
        progContainer.innerHTML = `<div style="font-size:0.75rem; color:#64748b; font-weight:700;">📤 Upload en cours...</div>`;
    }

    try {
        const session = await getSession();
        if (!session) throw new Error("Session expirée");
        
        const path = `${session.user.id}/${Date.now()}_${file.name}`;
        const { data, error: uploadError } = await window._supabase.storage
            .from('verifications-id')
            .upload(path, file);

        if (uploadError) throw uploadError;

        // Mise à jour optionnelle du projet courant si on est dans un cockpit
        const projectId = window.location.hash.includes('id=') ? window.location.hash.split('id=')[1] : null;
        if (projectId) {
            await window._supabase.from('projects').update({ 
                kyc_status: 'pending_verification',
                kyc_document_path: path 
            }).eq('id', projectId);
        }

        if (progContainer) {
            progContainer.innerHTML = `<div style="color:#10b981; font-weight:800; font-size:0.75rem;">✅ Document transmis !</div>`;
        }
        
        alert("Votre pièce d'identité a été transmise avec succès.");

    } catch (err) {
        console.error("Upload Error:", err);
        alert("Erreur lors de l'envoi : " + err.message);
        if (btn) btn.style.display = 'block';
        if (progContainer) progContainer.style.display = 'none';
    }
}

async function approveProjectFromInspection(projectId) {
    if (!confirm("Voulez-vous APPROUVER cette Épopée ? Elle deviendra visible sur la marketplace.")) return;
    
    try {
        const { error } = await window._supabase
            .from('projects')
            .update({ status: 'approved', is_listed: true })
            .eq('id', projectId);
            
        if (error) throw error;
        
        alert("✅ Épopée Approuvée !");
        window.location.reload();
        
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

window.viewProjectContributions = async (projectId) => {
    let modal = document.getElementById('contributions-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="contributions-modal">
                <div class="hero-modal" style="max-width: 750px; background: white; color: var(--text-primary); padding: 32px; border-radius: 20px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:32px;">
                        <div>
                            <h2 style="color:var(--text-primary); margin:0; font-size:1.8rem; font-weight:900;">Suivi des Financements</h2>
                            <p style="color:var(--text-secondary); font-size:0.9rem; margin-top:4px;">Historique des contributions et soutiens reçus.</p>
                        </div>
                        <button class="modal-close" onclick="document.getElementById('contributions-modal').style.display='none'" style="color:var(--text-muted); background:none; border:none; font-size:1.5rem; cursor:pointer;">×</button>
                    </div>

                    <div id="contributions-stats-row" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:16px; margin-bottom:32px;">
                        <div style="background:#f8fafc; padding:20px; border-radius:16px; border:1px solid #e2e8f0;">
                            <div style="font-size:0.7rem; color:#64748b; font-weight:800; text-transform:uppercase; margin-bottom:4px;">Total Récolté</div>
                            <div id="contrib-total-amount" style="font-size:1.5rem; font-weight:900; color:#10b981;">0 €</div>
                        </div>
                        <div style="background:#f8fafc; padding:20px; border-radius:16px; border:1px solid #e2e8f0;">
                            <div style="font-size:0.7rem; color:#64748b; font-weight:800; text-transform:uppercase; margin-bottom:4px;">Contributeurs</div>
                            <div id="contrib-total-count" style="font-size:1.5rem; font-weight:900; color:#0f172a;">0</div>
                        </div>
                        <div style="background:#f8fafc; padding:20px; border-radius:16px; border:1px solid #e2e8f0;">
                            <div style="font-size:0.7rem; color:#64748b; font-weight:800; text-transform:uppercase; margin-bottom:4px;">Moyenne / Don</div>
                            <div id="contrib-avg-amount" style="font-size:1.5rem; font-weight:900; color:#3b82f6;">0 €</div>
                        </div>
                    </div>

                    <div style="max-height: 400px; overflow-y: auto; background:#ffffff; border:1px solid #e2e8f0; border-radius:16px;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead style="background:#f8fafc; position:sticky; top:0; z-index:1;">
                                <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
                                    <th style="padding: 16px; color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 0.7rem;">Donateur</th>
                                    <th style="padding: 16px; color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 0.7rem;">Montant</th>
                                    <th style="padding: 16px; color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 0.7rem;">Contrepartie</th>
                                    <th style="padding: 16px; color: #64748b; font-weight: 800; text-transform: uppercase; font-size: 0.7rem;">Date</th>
                                </tr>
                            </thead>
                            <tbody id="contributions-tbody">
                                <!-- Rempli dynamiquement -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('contributions-modal');
    }

    const tbody = document.getElementById('contributions-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:32px; color:#64748b;">Analyse des données en cours...</td></tr>';
    modal.style.display = 'flex';

    try {
        const { data: contribs, error } = await window._supabase
            .from('contributions')
            .select('*, profiles(full_name), project_rewards(title)')
            .eq('project_id', projectId)
            .eq('status', 'completed')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!contribs || contribs.length === 0) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:32px; color:#94a3b8; font-weight:500;">Aucune contribution enregistrée pour le moment.</td></tr>';
            document.getElementById('contrib-total-amount').innerText = "0 €";
            document.getElementById('contrib-total-count').innerText = "0";
            document.getElementById('contrib-avg-amount').innerText = "0 €";
            return;
        }

        // Stats
        const total = contribs.reduce((sum, c) => sum + (parseFloat(c.amount) || 0), 0);
        const count = contribs.length;
        const avg = total / count;

        document.getElementById('contrib-total-amount').innerText = `${total.toLocaleString()} €`;
        document.getElementById('contrib-total-count').innerText = count;
        document.getElementById('contrib-avg-amount').innerText = `${Math.round(avg).toLocaleString()} €`;

        if (tbody) {
            tbody.innerHTML = contribs.map(c => {
                const name = c.donor_name || c.profiles?.full_name || 'Contributeur Anonyme';
                const date = new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
                return `
                    <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 16px; font-weight: 700; color:#0f172a;">${name}</td>
                        <td style="padding: 16px; font-weight: 800; color:#10b981;">${c.amount.toLocaleString()} €</td>
                        <td style="padding: 16px; font-size:0.8rem; color:#64748b;">${c.project_rewards?.title || 'Don libre'}</td>
                        <td style="padding: 16px; font-size:0.8rem; color:#94a3b8;">${date}</td>
                    </tr>
                `;
            }).join('');
        }

    } catch (err) {
        console.error("Error fetching contributions:", err);
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:32px; color:#ef4444;">Erreur : ${err.message}</td></tr>`;
    }
};

window.viewProjectContributions = viewProjectContributions;
window.openProjectModal = openProjectModal;
window.saveNewProject = saveNewProject;
window.loadMyProjects = loadMyProjects;
window.closeProjectCockpit = closeProjectCockpit;
window.startNewProjectWizard = startNewProjectWizard;
window.renderCockpitWithStep = renderCockpitWithStep;
window.saveProjectStep = saveProjectStep;
window.deleteSREProject = deleteSREProject;
window.approveProjectFromInspection = approveProjectFromInspection;
window.handleIDUpload = handleIDUpload;
window.openProjectCockpit = openProjectCockpit;
