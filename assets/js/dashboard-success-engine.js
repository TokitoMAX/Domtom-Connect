/**
 * Success Engine (Mon Épopée) Logic for Domtom Connect Dashboard
 * Handles project creation, roadmap, arsenal, and certification.
 */

// --- 1. COORDINATION & STEPPER ---

function updateSuccessStepper(score, projectId) {
    const steps = [
        { id: 'cockpit-step-1', threshold: 0, label: '01. Manifeste', hint: 'Toujours accessible' },
        { id: 'cockpit-step-2', threshold: 25, label: '02. Arsenal', hint: 'Atteignez 25% de maturité' },
        { id: 'cockpit-step-3', threshold: 50, label: '03. Boussole', hint: 'Atteignez 50% de maturité' },
        { id: 'cockpit-step-4', threshold: 75, label: '04. Sûreté', hint: 'Atteignez 75% de maturité' },
        { id: 'cockpit-step-5', threshold: 90, label: '05. Orbite', hint: 'Atteignez 90% de maturité' }
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
            .order('created_at', { ascending: false });

        if (error) throw error;

        // --- 1. HEADER (Original) ---
        headerContainer.innerHTML = `
            <div class="dash-section-header" style="margin-bottom: 32px;">
                <h1 style="font-size: 2.5rem; font-weight: 900; color: #0f172a; margin-bottom: 8px;">MON ÉPOPÉE</h1>
                <p style="color: #64748b;">Tableau de bord de pilotage</p>
            </div>
        `;

        // --- 2. LISTE DES PROJETS ---
        let listHTML = `
            <div id="project-list-view">
                <div class="dash-section-pilotage" style="background: #0f172a; color: white; border: none; margin-bottom:40px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h2 style="color: white; margin: 0; font-size: 1.5rem;">Ma Nouvelle Épopée</h2>
                            <p style="color: rgba(255,255,255,0.7); margin: 4px 0 0 0;">Initiez un nouveau projet.</p>
                        </div>
                        <button onclick="openProjectModal()" class="cta-button primary" style="background: white; color: #0f172a;">+ Nouveau Projet</button>
                    </div>
                </div>

                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">Mes Épopées</h3>
                <div class="ecosystem-grid">
                    ${projects && projects.length > 0 ? projects.map(p => `
                        <div class="dash-card-premium">
                            <div class="dash-card-icon" style="background: rgba(16,185,129,0.1); color: #10b981; font-weight:800; font-size:0.7rem;">ESTRAT</div>
                            <div class="card-title">${p.title || 'Sans titre'}</div>
                            <p class="card-desc">Tableau de bord de pilotage</p>
                            <button onclick="openProjectCockpit('${p.id}')" class="cta-button primary" style="background:#0f172a; justify-content:center; margin-top:auto;">Piloter mon Épopée</button>
                        </div>
                    `).join('') : '<p style="color: #94a3b8; font-style: italic;">Aucune épopée en cours.</p>'}
                </div>
            </div>

            <!-- CONTENEUR COCKPIT (MASQUÉ) -->
            <div id="project-cockpit-view" style="display: none;">
                <button onclick="closeProjectCockpit()" class="cta-button secondary" style="margin-bottom: 32px;">&larr; Retour à mes projets</button>
                <div id="cockpit-content-internal"></div>
            </div>
        `;

        engineStepContainer.innerHTML = listHTML;

    } catch (err) {
        console.error("Error loading projects:", err);
    }
}

async function openProjectCockpit(projectId) {
    const list = document.getElementById('project-list-view');
    const cockpit = document.getElementById('project-cockpit-view');
    const content = document.getElementById('cockpit-content-internal');
    
    if (!list || !cockpit || !content) return;

    try {
        const { data: p, error } = await _supabase.from('projects').select('*').eq('id', projectId).single();
        if (error) throw error;

        list.style.display = 'none';
        cockpit.style.display = 'block';

        content.innerHTML = `
            <div class="success-engine-card">
                 <div class="success-engine-card-header">
                    <h3 class="success-engine-card-title">01. Stratégie & Vision</h3>
                    <p class="success-engine-card-subtitle">Le socle de votre projet : expliquez votre vision pour convaincre les financeurs.</p>
                </div>
                
                <div class="success-engine-grid">
                    <div class="success-engine-field">
                        <label class="success-engine-label">Votre Vision (Futur)</label>
                        <textarea id="manifesto-vision" class="success-engine-textarea" placeholder="Où voyez-vous ce projet dans 5 ans ?">${p.vision || ''}</textarea>
                    </div>
                    <div class="success-engine-field">
                        <label class="success-engine-label">L'Enjeu (Pourquoi ?)</label>
                        <textarea id="manifesto-enjeu" class="success-engine-textarea" placeholder="Quel problème majeur résolvez-vous ?">${p.enjeu || ''}</textarea>
                    </div>
                    <div class="success-engine-field">
                        <label class="success-engine-label">Votre Mission (Présent)</label>
                        <textarea id="manifesto-mission" class="success-engine-textarea" placeholder="Que faites-vous concrètement aujourd'hui ?">${p.mission || ''}</textarea>
                    </div>
                    <div style="display:flex; align-items:flex-end;">
                        <button onclick="updateProjectManifesto('${p.id}')" class="cta-button primary" style="width:100%; background:#0f172a; height: 50px; justify-content:center;">Enregistrer ma Stratégie</button>
                    </div>
                </div>
            </div>
        `;

    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

function closeProjectCockpit() {
    document.getElementById('project-list-view').style.display = 'block';
    document.getElementById('project-cockpit-view').style.display = 'none';
}

function openImpulsionModal(projectId) {
    alert("🚀 Phase d'Impulsion : Cette fonctionnalité (Certificat de Maturité) arrive très prochainement dans votre cockpit !");
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

async function handleArsenalFileSelect(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        // Preview logic if needed
    };
    reader.readAsDataURL(file);
}

// --- 5. REWARDS & MILESTONES ---

function openRewardModal(projId) {
    document.getElementById('reward-proj-id').value = projId;
    document.getElementById('reward-modal').style.display = 'flex';
}

async function saveReward(projId) {
    const btn = document.getElementById('btn-save-reward');
    btn.disabled = true;
    try {
        const payload = {
            project_id: projId,
            title: document.getElementById('reward-title').value,
            description: document.getElementById('reward-desc').value,
            amount_threshold: parseFloat(document.getElementById('reward-amount').value),
            stock: parseInt(document.getElementById('reward-stock').value) || null,
            image_url: document.getElementById('reward-image-url').value
        };
        const { error } = await _supabase.from('project_rewards').insert([payload]);
        if (error) throw error;
        alert("🎁 Récompense créée !");
        document.getElementById('reward-modal').style.display = 'none';
        loadMyProjects(null); // Refresh
    } catch (err) { alert(err.message); }
    finally { btn.disabled = false; }
}

async function saveMilestone(projId) {
    try {
        const payload = {
            project_id: projId,
            funding_goal: parseFloat(document.getElementById('milestone-threshold').value),
            title: document.getElementById('milestone-title').value,
            description: document.getElementById('milestone-desc').value
        };
        const { error } = await _supabase.from('project_milestones').insert([payload]);
        if (error) throw error;
        alert("🚩 Palier validé !");
        document.getElementById('milestone-modal').style.display = 'none';
        loadMyProjects(null);
    } catch (err) { alert(err.message); }
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

        const { error } = await _supabase.from('projects').insert([{
            owner_id: session.user.id,
            title,
            territory,
            status: 'draft'
        }]);
        if (error) throw error;
        alert("✅ Épopée créée avec succès !");
        window.location.reload();
    } catch (err) { alert(err.message); }
}

window.openProjectModal = openProjectModal;
window.saveNewProject = saveNewProject;
window.loadMyProjects = loadMyProjects;
window.calculateProjectMaturity = calculateProjectMaturity;
window.openProjectCockpit = openProjectCockpit;
window.closeProjectCockpit = closeProjectCockpit;
