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
    const container = document.getElementById('my-projects-list');
    if (!container) return;

    const { data: projects, error } = await _supabase
        .from('projects')
        .select('id, title, status, description, territory, vision, mission, enjeu, needs, roadmap, total_raised, funding_goal, is_listed, created_at')
        .eq('owner_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error loading projects:", error);
        container.innerHTML = `
            <div style="color:#ef4444; padding:20px; text-align:center;">
                <p><strong>Erreur de chargement :</strong> ${error.message}</p>
            </div>
        `;
        return;
    }

    const session = await getSession();
    const pendingProjectName = session?.user?.user_metadata?.pending_project_name;

    let firstProj = projects && projects.length > 0 ? projects[0] : {
        id: 'new',
        title: pendingProjectName || 'Ma Nouvelle Épopée',
        vision: '',
        mission: '',
        enjeu: '',
        total_raised: 0,
        funding_goal: 0,
        is_listed: false,
        needs: ''
    };

    // If we have a pending name and no project yet, we could auto-create it or just let the user save.
    // For now, we pre-fill the title.

    const totalScore = calculateProjectMaturity(firstProj);
    const headerContainer = document.getElementById('success-engine-header');
    const engineStepContainer = document.getElementById('success-engine-step');
    
    if (!headerContainer || !engineStepContainer) return;

    headerContainer.innerHTML = `
        <div class="success-engine-header-card">
            <div class="success-engine-title-group">
                <div class="success-engine-icon">🚀</div>
                <div>
                    <h2 class="success-engine-project-title">${firstProj.title || 'Ma Nouvelle Épopée'}</h2>
                    <p class="success-engine-subtitle">Tableau de bord de pilotage</p>
                </div>
            </div>
            <a href="/epopee" class="cta-button primary success-engine-cta">Piloter mon Épopée →</a>
        </div>
    `;

    // Maturity labels removed as per user request
    const dashBadge = document.getElementById('epopee-score-badge');
    if (dashBadge) dashBadge.style.display = 'none';

    // Render Phases on the Hub
    let phasesHTML = `
        <div id="phase-card-1" class="cockpit-section dash-card active">
            <div class="card-title">01. Stratégie & Vision</div>
            <p class="card-desc" style="margin-bottom:24px;">Le socle de votre projet : expliquez votre vision pour convaincre les financeurs.</p>
            <div class="cockpit-grid">
                <div class="cockpit-column">
                    <div class="form-group">
                        <label>Votre Vision (Futur)</label>
                        <textarea id="manifesto-vision" placeholder="Où voyez-vous ce projet dans 5 ans ?">${firstProj.vision || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Votre Mission (Présent)</label>
                        <textarea id="manifesto-mission" placeholder="Que faites-vous concrètement aujourd'hui ?">${firstProj.mission || ''}</textarea>
                    </div>
                </div>
                <div class="cockpit-column">
                    <div class="form-group">
                        <label>L'Enjeu (Pourquoi ?)</label>
                        <textarea id="manifesto-enjeu" placeholder="Quel problème majeur résolvez-vous ?">${firstProj.enjeu || ''}</textarea>
                    </div>
                    <button onclick="updateProjectManifesto('${firstProj.id}')" class="btn-cockpit primary" style="width:100%;">Enregistrer ma Stratégie →</button>
                </div>
            </div>
        </div>
    `;

    engineStepContainer.innerHTML = phasesHTML;
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
