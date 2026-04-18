/**
 * Core Dashboard Logic for Domtom Connect
 * Handles Navigation, Routing, Session, and Global Handlers.
 */

// --- 1. NAVIGATION
/**
 * --- ADMIN VALIDATION UTILITIES ---
 * Moved to core for global access from Dashboard & Epopee pages.
 */
let isAdminInspection = false;
let currentSREProject = null;
window.isEditing = false;
let originalProfileData = null;
window.activeBusinessId = null; // To handle Multi-Account / Collaborations

// --- 2. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    const session = await getSession();
    if (session && session.user) {
        // Handle incoming invitation link
        const urlParams = new URLSearchParams(window.location.search);
        const inviteId = urlParams.get('invite');
        if (inviteId) {
            await window.handleInviteToken(inviteId, session.user);
        }

        // Detect Collaborations
        const collabs = await window.checkCollaborations(session.user.email);
        if (collabs && collabs.length > 0) {
            // Wait for grid to be ready to render the switch
            setTimeout(() => window.renderCollaborationSwitch(collabs), 1000);
        }
    }
});

window.handleInviteToken = async function(inviteId, user) {
    try {
        // 1. Fetch the invitation
        const { data: invite, error } = await _supabase
            .from('collaborators')
            .select('*')
            .eq('id', inviteId)
            .single();

        if (error || !invite) return;

        // 2. Validate email match (Security)
        if (invite.collaborator_email.toLowerCase() !== user.email.toLowerCase()) {
            Swal.fire({
                icon: 'error',
                title: 'Invitation invalide',
                text: `Cette invitation est destinée à ${invite.collaborator_email}. Veuillez vous connecter avec le bon compte.`
            });
            return;
        }

        // 3. Accept if pending
        if (invite.status === 'pending') {
            await _supabase
                .from('collaborators')
                .update({ status: 'accepted' })
                .eq('id', inviteId);
            
            Swal.fire({
                icon: 'success',
                title: 'Équipe rejointe !',
                text: `Vous avez rejoint l'écosystème avec succès.`,
                confirmButtonColor: '#10b981'
            }).then(() => {
                // Clear URL param
                window.history.replaceState({}, document.title, window.location.pathname);
                location.reload();
            });
        }
    } catch (err) {
        console.error("Invite Handler Error:", err);
    }
};

window.isPremiumUser = function(p) {
    if (!p) return false;
    if (p.role === 'admin') return true;
    
    // For Experts and Companies, premium status depends on the paid subscription tier
    const isProfessional = (p.role === 'expert' || p.role === 'prestataire' || p.role === 'entreprise');
    return isProfessional && p.subscription_tier !== 'free';
};

window.showView = showView;
window.renderMobileNav = renderMobileNav;

function calculateProjectMaturity(p) {
    if (typeof OwnersModule !== 'undefined' && typeof OwnersModule.calculateMaturity === 'function') {
        return OwnersModule.calculateMaturity(p);
    }
    return 0; // Fallback
}

async function loadPendingProjects() {
    const container = document.getElementById('pending-projects-container');
    const badge = document.getElementById('pending-count-badge');
    const menuDot = document.getElementById('admin-notif-dot');
    
    try {
        // On récupère TOUS les projets qui ne sont pas explicitement approuvés (false ou null)
        const { data: projects, error } = await _supabase
            .from('projects')
            .select('*')
            .eq('verification_status', 'pending')
            .order('created_at', { ascending: false });


        if (error) {
            console.error("Supabase Query Error:", error);
            container.innerHTML = `<p style="color: #ef4444; font-size: 0.9rem;">⚠️ Erreur Supabase: ${error.message}</p>`;
            return;
        }

        if (!projects || projects.length === 0) {
            if (container) container.innerHTML = '<p style="color: var(--text-muted); font-size: 0.8rem;">✅ Aucun dossier en attente.</p>';
            if (badge) badge.style.display = 'none';
            if (menuDot) menuDot.style.display = 'none';
            return;
        }

        if (badge) {
            badge.textContent = `${projects.length} en attente`;
            badge.style.display = 'inline-block';
        }
        if (menuDot) menuDot.style.display = 'block';

        if (container) {
            container.innerHTML = `
                <div style="display: grid; gap: 12px;">
                    ${projects.map(p => `
                        <div style="background: white; border: 1px solid var(--gray-200); padding: 16px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center;">
                            <div>
                                <div style="font-weight: 800; color: #111827; font-size: 0.95rem;">${p.title}</div>
                                <div style="font-size: 0.8rem; color: var(--text-secondary);">Maturité : <strong>${calculateProjectMaturity(p)}%</strong> • Réf: ${p.id.substring(0,8)}...</div>
                            </div>
                            <div style="display: flex; gap: 10px;">
                                <button onclick="inspectSREProject('${p.id}')" class="cta-button secondary" style="font-size: 0.75rem; padding: 6px 12px; border-color: #7c3aed; color: #7c3aed;">Inspecter</button>
                                <button onclick="rejectSREProject('${p.id}')" class="cta-button secondary" style="font-size: 0.75rem; padding: 6px 12px; border-color: #ef4444; color: #ef4444;">Refuser</button>
                                <button onclick="approveSREProject('${p.id}')" class="cta-button primary" style="font-size: 0.75rem; padding: 6px 16px; background: #10b981;">Approuver</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    } catch (err) {
        console.error("Critical Load Error:", err.message);
    }
}

async function approveSREProject(projectId) {
    if (!confirm("Voulez-vous vraiment approuver et publier ce projet ?")) return;
    try {
        const { error } = await _supabase
            .from('projects')
            .update({ 
                is_approved: true, 
                verification_status: 'approved',
                updated_at: new Date().toISOString() 
            })
            .eq('id', projectId);
        if (error) throw error;
        alert("Projet approuvé et publié ! ✅");
        if (isAdminInspection) {
            isAdminInspection = false;
            showView('overview');
        }
        loadPendingProjects();
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function rejectSREProject(projectId) {
    const reason = prompt("Indiquez la raison du refus (optionnel) :");
    if (reason === null) return; // Annulé
    try {
        const { error } = await _supabase
            .from('projects')
            .update({ 
                is_approved: false, 
                verification_status: 'rejected',
                rejection_reason: reason,
                updated_at: new Date().toISOString() 
            })
            .eq('id', projectId);
        if (error) throw error;
        alert("Projet refusé. Le porteur en sera informé. ❌");
        if (isAdminInspection) {
            isAdminInspection = false;
            showView('overview');
        }
        loadPendingProjects();
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function inspectSREProject(projectId) {
    try {
        const { data: project, error } = await _supabase
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .single();

        if (error) throw error;
        if (!project) throw new Error("Projet non trouvé.");

        isAdminInspection = true;
        
        // Redirection vers epopee.html avec l'ID du projet et le flag d'inspection
        window.location.href = `epopee.html?inspect=${projectId}`;
    } catch (err) {
        alert("Erreur lors de l'inspection : " + err.message);
    }
}

window.showView = showView;
window.handleRouting = handleRouting;

function handleRouting() {
    const hash = window.location.hash.replace('#', '') || 'overview';
    showView(hash, true); // On force le rendu graphique
}

function showView(viewId, forceRender = false) {
    if (window.location.hash !== `#${viewId}` && !viewId.includes('?') && !forceRender) {
        window.location.hash = viewId;
        return;
    }

    let baseView = viewId;
    let params = {};
    if (viewId.includes('?')) {
        const parts = viewId.split('?');
        baseView = parts[0];
        const searchParams = new URLSearchParams(parts[1]);
        searchParams.forEach((v, k) => params[k] = v);
    }

    const viewMap = {
        'overview': 'overview-view',
        'success-engine': 'success-engine-view-fixed',
        'billetterie': 'billetterie-view',
        'missions': 'missions-view',
        'business': 'business-view',
        'mes-billets': 'mes-billets-view',
        'profile': 'profile-view'
    };

    const targetId = viewMap[baseView];
    const views = Object.values(viewMap);
    
    // 1. Masquer TOUTES les sections de vue proprement
    views.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = 'none';
    });

    // 2. Afficher la section cible
    const target = document.getElementById(targetId);
    
    // Cas spécial : Redirection Profil & Business Standalone
    if (baseView === 'profile') {
        window.location.href = '/profile';
        return;
    }
    if (baseView === 'business') {
        window.location.href = '/business.html';
        return;
    }

    if (target) {
        target.style.display = 'block';
        
        // 3. Gestion des headers et navbar specifiques
        const isOverview = baseView === 'overview';
        const isCommonView = ['overview', 'success-engine', 'billetterie', 'mes-billets'].includes(baseView);
        const greeting = document.querySelector('.dash-section-header');
        const topNav = document.querySelector('.top-nav');

        if (greeting) greeting.style.display = isOverview ? 'block' : 'none';
        if (topNav) topNav.style.display = isCommonView ? 'flex' : 'none';

        // 4. Chargements spécifiques
        if (baseView === 'billetterie') {
            if (typeof loadMyTicketing === 'function') loadMyTicketing();
        } else if (baseView === 'mes-billets') {
            if (typeof loadMyTickets === 'function') loadMyTickets();
        } else if (baseView === 'success-engine') {
            if (params.id && typeof openProjectCockpit === 'function') {
                openProjectCockpit(params.id);
            } else if (typeof loadMyProjects === 'function') {
                _supabase.auth.getSession().then(({data}) => {
                    if (data.session) loadMyProjects(data.session.user.id);
                });
            }
        } else if (baseView === 'missions') {
            if (typeof CompaniesModule !== 'undefined') {
                _supabase.auth.getSession().then(({data}) => {
                    if (data.session) CompaniesModule.renderDashboard(target, null, window.userProfile, data.session);
                });
            }
        }
    }

    // 5. Mettre à jour l'état actif des liens (Sidebar & Mobile Nav)
    const navLinks = document.querySelectorAll('.sidebar-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        // Handle both full hash links and partial view IDs
        const isActive = (href === `#${baseView}` || href === baseView || (href === 'javascript:void(0)' && link.onclick?.toString().includes(`'${baseView}'`)));
        
        if (isActive) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    window.scrollTo(0, 0);
}

function scrollToPacks() {
    const additional = document.getElementById('additional-content');
    if (additional) {
        additional.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}


function initRouting() {
    handleRouting();
}

window.addEventListener('hashchange', handleRouting);

// --- 2. LOGIQUE UI GLOBALE ---
// Logic moved to final initialization at line 1600+

async function checkSession() {
    try {
        const session = await getSession();
        if (!session) {
            window.location.href = 'registration/login.html';
            return;
        }
        await loadDashboardContent(session);
    } catch (err) {
        console.error("Session Check Error:", err);
    }
}

async function loadDashboardContent(session) {
    const user = session.user;
    const name = user.user_metadata?.full_name || user.email.split('@')[0];
    
    let profile = null;
    try {
        profile = await getProfile(user.id);
    } catch (err) {
        console.error("Profile fetch error:", err);
    }

    if (!profile) {
        console.warn("Profil manquant, redirection onboarding.");
        window.location.href = 'registration/onboarding';
        return;
    }

    // Role & Tier
    // Priorité absolue à la base de données (profile.role) pour permettre la promotion admin
    // Fallback sur metadata pour le rôle initial
    const dbRole = (profile && profile.role) ? profile.role : (user.user_metadata?.role || 'user');
    const isAdmin = (dbRole === 'admin' || user.email === 'domtomconnect@gmail.com');
    const role = isAdmin ? 'admin' : dbRole;
    const majorZone = profile.major_zone || user.user_metadata?.major_zone || 'OM_FR';
    
    const tier = profile.subscription_tier || 'free';
    const isListed = !!profile.listed;

    console.log("Dashboard Core Debug - Role:", role, "Zone:", majorZone, "Tier:", tier);
    // UI Updates
    // UI Updates
    const greetingEl = document.getElementById('user-greeting');
    // On cible spécifiquement le header de l'overview pour éviter les erreurs de sélection multiple
    const standardHeader = document.querySelector('#overview-view .dash-section-header');
    
    // On cache le header standard si on est dans un écosystème pro pour éviter le doublon
    const isProfessional = (role === 'expert' || role === 'prestataire' || role === 'entreprise');
    if (standardHeader && isProfessional) {
        standardHeader.style.display = 'none';
        standardHeader.classList.add('hidden-force');
    } else if (greetingEl) {
        greetingEl.textContent = `Bonjour, ${name}`; 
    }

    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) {
        roleBadge.style.background = 'rgba(16, 185, 129, 0.1)';
        roleBadge.style.color = '#10b981';
        renderRoleBadge(roleBadge, role);
    }

    // Render Cards via Ecosystem Modules (DELEGATION)
    window.userProfile = profile;
    window.originalProfileData = { ...profile };
    fillProfileForm(profile);

    renderDashboardCards(role, tier, isListed, profile, session);
    
    // Update Dynamic Mobile Navigation AFTER role is certain
    renderMobileNav(role);

    // Profile Strength & Visibility
    updateProfileStrength(profile);
    renderVisibilityPreview(profile);
    renderCollaborationHub(profile);

    // Apply Zone-specific labels
    applyGeographicalLocalization(majorZone);

    // Load Success Engine data if applicable (only for project owners)
    const isProjectOwner = role !== 'expert' && role !== 'prestataire' && role !== 'entreprise' && role !== 'admin';
    if (typeof loadMyProjects === 'function' && isProjectOwner) {
        loadMyProjects(user.id);
    }

    // Load Matchmaking if applicable
    if (role === 'entreprise' || role === 'expert' || role === 'prestataire' || isProjectOwner) {
        if (typeof loadMatchmaking === 'function') {
            loadMatchmaking(user.id);
        }
    }

    // --- NAVIGATION SECURITY : Role-based Sidebar Content ---
    const epopeeLink = document.getElementById('nav-success-engine');
    const missionsLink = document.getElementById('nav-mes-missions');
    const businessLink = document.getElementById('nav-business');
    
    const isPro = (role === 'admin' || role === 'expert' || role === 'prestataire' || role === 'entreprise');

    if (epopeeLink) {
        // "L'Épopée" est RÉSERVÉ aux porteurs de projet OU aux Admins
        epopeeLink.style.display = (role === 'admin' || !isPro) ? 'flex' : 'none';
        const dot = document.getElementById('admin-notif-dot');
        if (dot) dot.style.display = (role === 'admin') ? 'block' : 'none';
    }

    if (missionsLink) {
        // "Mes Missions" est RÉSERVÉ aux entreprises et experts
        missionsLink.style.display = (role === 'admin' || role === 'expert' || role === 'entreprise') ? 'flex' : 'none';
    }

    if (businessLink) {
        // Finances pour experts/admins OU entreprises payantes
        const hasBusinessAccess = (role === 'admin' || role === 'expert' || role === 'prestataire' || (role === 'entreprise' && tier !== 'free'));
        businessLink.style.display = hasBusinessAccess ? 'flex' : 'none';
    }

    initRouting();
}

function renderRoleBadge(el, role) {
    if (role === 'expert' || role === 'prestataire') {
        el.textContent = "PROFIL EXPERT";
        el.style.background = "rgba(16, 185, 129, 0.1)";
        el.style.color = "#10b981";
    } else if (role === 'entreprise') {
        el.textContent = "PROFIL ENTREPRISE";
        el.style.background = "rgba(2, 132, 199, 0.1)";
        el.style.color = "#0284c7";
    } else if (role === 'admin') {
        el.textContent = "ADMINISTRATEUR SYSTÈME";
        el.style.background = "#0f172a";
        el.style.color = "white";
    } else {
        el.textContent = "PORTEUR DE PROJET";
        el.style.background = "rgba(59, 130, 246, 0.1)";
        el.style.color = "#3b82f6";
    }
    el.style.display = 'inline-block';
    el.style.textTransform = 'uppercase';
    el.style.fontWeight = '800';
    el.style.fontSize = '0.7rem';
    el.style.letterSpacing = '0.05em';
}

/**
 * Localizes UI labels based on the user's major zone (Ecosystem)
 */
function applyGeographicalLocalization(zoneId) {
    if (!window.TerritoryConfig) return;
    
    const taxLabel = window.TerritoryConfig.getTaxIdLabel(zoneId);
    
    // Find all SIRET mentions in dashboard and update them
    const siretLabels = document.querySelectorAll('label, span, p, h4');
    siretLabels.forEach(el => {
        if (el.textContent.includes('SIRET') || el.textContent.includes('SIREN')) {
            el.textContent = el.textContent.replace('SIRET / SIREN', taxLabel).replace('SIRET', taxLabel);
        }
    });

    // Handle Business Suite visibility/localization
    const businessSuiteLink = document.getElementById('nav-business');
    if (businessSuiteLink) {
        businessSuiteLink.querySelector('span').textContent = (zoneId === 'OM_FR' || zoneId === 'CAR_FR') ? 'Gestion Business' : 'Business Management';
    }

    // --- ISOLATION : Hide redundant overview cards for Strategic Roles ---
    const isStrategic = (window.activeRole === 'entreprise' || window.activeRole === 'expert' || window.activeRole === 'prestataire');
    const hub = document.getElementById('collaboration-hub-container');
    const strength = document.getElementById('profile-strength-container');
    const visibility = document.getElementById('visibility-preview-container');
    
    if (isStrategic) {
        if (hub) hub.style.display = 'none';
        if (strength) { strength.style.display = 'none'; strength.classList.add('hidden-force'); }
        if (visibility) { visibility.style.display = 'none'; visibility.classList.add('hidden-force'); }
    }
}

function renderDashboardCards(role, tier, isListed, profile, session) {
    const container = document.getElementById('dashboard-cards');
    const additional = document.getElementById('additional-content');
    if (!container) return;

    // 1. ADMIN SYSTEM (Always Priority)
    if (role === 'admin') {
        const adminDashboardHTML = `
            <div class="dash-card highlight" style="border-color: #7c3aed; background: rgba(124, 58, 237, 0.02); grid-column: 1 / -1; padding: 40px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
                    <div>
                        <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em; color: #7c3aed; font-weight: 800; margin-bottom: 8px;">Pilotage Central</div>
                        <h2 style="font-size: 1.5rem; font-weight: 900; margin: 0; color: #1e1b4b;">VALIDATION DES ÉPOPÉES</h2>
                        <p style="color: var(--text-secondary); margin-top: 4px;">Examinez les nouveaux projets soumis par la communauté.</p>
                    </div>
                    <button onclick="showView('success-engine')" class="cta-button primary" style="background: #7c3aed; border: none; padding: 12px 24px; font-weight: 800;">Ouvrir le Cockpit Admin →</button>
                </div>
                
                <div id="admin-pending-summary" style="background: white; border: 1px solid #e2e8f0; border-radius: 16px; padding: 24px;">
                    <div id="pending-projects-container">
                        <p style="color: var(--text-muted); font-size: 0.9rem;">Chargement des dossiers en attente...</p>
                    </div>
                </div>
            </div>

            <div class="dash-card">
                <div class="card-title">Audit Interne</div>
                <p class="card-desc">Accédez aux statistiques réelles d'onboarding et de paiement.</p>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto;">
                    <a href="/admin/audit-onboarding.html" class="cta-button secondary" style="justify-content:center; font-size:0.8rem;">Ouvrir l'Audit</a>
                </div>
            </div>

            <div class="dash-card">
                <div class="card-title">Gestion Experts</div>
                <p class="card-desc">Contrôlez l'annuaire et validez les badges Authority.</p>
                <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto;">
                    <a href="marketplace/directory" class="cta-button secondary" style="justify-content:center; font-size:0.8rem;">Voir l'Annuaire</a>
                </div>
            </div>
        `;
        container.innerHTML = adminDashboardHTML;
        loadPendingProjects();

        // 1.1 ADDON : EXPÉRIENCE HYBRIDE (Si l'admin a aussi des fonctions entreprise)
        if (session.user.email === 'domtomconnect@gmail.com' || profile.company_name) {
            console.log("Dashboard Core: Activating Hybrid Admin/Company View");
            const addonContainer = document.createElement('div');
            addonContainer.id = 'admin-company-addon';
            addonContainer.style.marginTop = '40px';
            addonContainer.style.gridColumn = '1 / -1';
            addonContainer.innerHTML = `<h3 style="font-size: 1.25rem; font-weight: 950; margin-bottom: 20px; color: #0f172a; border-top: 1px solid #e2e8f0; padding-top: 40px;">Vos Outils Entreprise</h3><div id="company-addon-cards"></div>`;
            container.appendChild(addonContainer);
            
            const cardsTarget = document.getElementById('company-addon-cards');
            if (typeof CompaniesModule !== 'undefined' && cardsTarget) {
                // On délègue au module entreprise en ciblant le conteneur addon
                CompaniesModule.renderDashboard(cardsTarget, additional, profile, session);
            }
        }
        return;
    }

    // 2. DELEGATE TO ECOSYSTEM MODULES
    if (role === 'expert' || role === 'prestataire') {
        if (typeof ExpertsModule !== 'undefined') {
            ExpertsModule.renderDashboard(container, additional, profile, session);
        } else {
            container.innerHTML = '<p>Chargement du module Expert...</p>';
        }
    } else if (role === 'entreprise') {
        if (typeof CompaniesModule !== 'undefined') {
            CompaniesModule.renderDashboard(container, additional, profile, session);
        } else {
            container.innerHTML = '<p>Chargement du module Entreprise...</p>';
        }
    } else {
        // Porteurs de Projet (Default)
        if (typeof OwnersModule !== 'undefined') {
            OwnersModule.renderDashboard(container, additional, profile, session);
        } else {
            container.innerHTML = '<p>Chargement du module Projet...</p>';
        }
    }
}

// --- 3. PROFILE STRENGTH & VISIBILITY ---

function updateProfileStrength(profile) {
    if (!profile) return;
    const isExpert = (profile.role === 'expert' || profile.role === 'prestataire');
    const container = document.getElementById('profile-strength-container');
    if (!container) return;

    container.classList.remove('hidden-force');
    container.style.display = 'block';

    let points = 0;
    let nextAction = "";

    if (profile.full_name) points += 20; else nextAction = "Ajoutez votre nom complet";
    if (profile.title) points += 15; else if (!nextAction) nextAction = "Précisez votre titre d'expertise";
    if (profile.bio) points += 15; else if (!nextAction) nextAction = "Rédigez une bio courte";
    if (profile.avatar_url) points += 20; else if (!nextAction) nextAction = "Uploadez votre logo ou photo de profil";
    if (profile.skills) points += 15; else if (!nextAction) nextAction = "Ajoutez vos compétences clés";
    if (profile.video_url) points += 15; else if (!nextAction) nextAction = "Ajoutez une vidéo de présentation pour atteindre 100%";

    const bar = document.getElementById('strength-bar');
    const perc = document.getElementById('strength-percentage');
    const tip = document.getElementById('strength-tip');

    if (bar) bar.style.width = points + '%';
    if (perc) perc.textContent = points + '%';
    if (tip) {
        if (points === 100) {
            tip.innerHTML = "Profil complet. Vous remontez en priorité dans l'annuaire.";
            tip.style.color = "#10b981";
        } else {
            tip.innerHTML = `<strong>Conseil :</strong> ${nextAction} pour booster votre visibilité. <a href="profile.html" style="color:#10b981; text-decoration:underline;">Modifier le profil</a>`;
        }
    }
}

function renderCollaborationHub(profile) {
    if (!profile) return;
    const container = document.getElementById('collaboration-hub-container');
    if (!container) return;

    const role = profile.role || 'expert';
    const isExpert = (role === 'expert' || role === 'prestataire');
    const isCompany = (role === 'entreprise');
    
    // Uniquement pour Experts et Entreprises
    if (!isExpert && !isCompany) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';

    const isListed = !!profile.listed;
    const tier = profile.subscription_tier || 'free';
    const isActive = (tier !== 'free');

    // Labels adaptatifs
    const label1 = document.getElementById('hub-dash-label-1');
    const label2 = document.getElementById('hub-dash-label-2');
    if (isCompany) {
        if (label1) label1.textContent = "Étape 1 : Visibilité Pro";
        if (label2) label2.textContent = "Étape 2 : Partenariat Certifié";
    }

    // Phase 1 : Référencement
    const step1 = document.getElementById('hub-dash-step-1');
    const text1 = document.getElementById('hub-dash-text-1');
    if (isListed) {
        if (step1) step1.classList.add('active');
        if (text1) text1.textContent = isCompany ? "Visible (Actif)" : "Référencé";
    } else {
        if (step1) step1.classList.remove('active');
        if (text1) text1.textContent = "Privé (En attente)";
    }

    // Phase 2 : Collaboration Active
    const step2 = document.getElementById('hub-dash-step-2');
    const text2 = document.getElementById('hub-dash-text-2');
    const actionArea = document.getElementById('hub-dash-action');

    if (isActive) {
        if (step2) step2.classList.add('active');
        if (text2) text2.textContent = "Activée (Partenaire)";
        if (actionArea) {
            actionArea.innerHTML = `
                <div class="hub-dash-badge">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    <span>${isCompany ? 'Entreprise Certifiée' : 'Partenaire Stratégique'}</span>
                </div>
            `;
        }
    } else {
        if (step2) step2.classList.remove('active');
        if (text2) text2.textContent = "Verrouillé (En attente)";
    }
}

/**
 * Global Subscription Modal Trigger
 */
function openSubModal() {
    // On utilise les données globales si profile n'est pas passé
    const activeProfile = window.userProfile;
    if (!activeProfile) return;

    // Si on est sur la page profile, on utilise le modal local
    const profileModal = document.getElementById('subscription-modal');
    if (profileModal) {
        profileModal.style.display = 'flex';
        return;
    }

    // Sinon, on utilise SweetAlert2 pour un rendu premium sur le Dashboard
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: '<span style="font-weight:900; letter-spacing:-0.03em; text-transform: uppercase; font-size: 1.2rem;">ACTIVER VOTRE PARTENARIAT</span>',
            html: `
                <div style="text-align:left; padding:10px;">
                    <p style="color:#64748b; font-size:0.95rem; margin-bottom:20px; line-height: 1.6;">Activez votre statut de <strong>Partenaire Stratégique</strong> pour débloquer toute la puissance de Domtom Connect.</p>
                    <ul style="list-style:none; padding:0; display:grid; gap:10px; margin-bottom:24px;">
                        ${activeProfile.role === 'entreprise' ? `
                            <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                                <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                                <span>Missions Illimitées & Sourcing Expert</span>
                            </li>
                            <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                                <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                                <span>1 Podcast Corporate Dédié</span>
                            </li>
                            <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                                <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                                <span>2-3 Contenus Réseaux Sociaux / mois</span>
                            </li>
                        ` : `
                            <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                                <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                                <span>Badges "Vérifié" & "Authority"</span>
                            </li>
                            <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                                <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                                <span>Accès Groupe WhatsApp Premium</span>
                            </li>
                        `}
                        <li style="display:flex; align-items:flex-start; gap:10px; font-size:0.85rem; font-weight:700; color:#0f172a;">
                            <div style="width:18px; height:18px; background:#dcfce7; color:#10b981; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; margin-top:2px;">✓</div>
                            <span>Outils DTC Business Included (Devis/Factures)</span>
                        </li>
                        <li style="display:flex; align-items:center; gap:10px; font-size:0.9rem; font-weight:800; color:#10b981; margin-top:10px; background:#ecfdf5; padding:8px 12px; border-radius:8px;">
                            <span style="flex:1;">Abonnement ${activeProfile.role === 'entreprise' ? 'Business' : 'Authority'}</span>
                            <span>${activeProfile.role === 'entreprise' ? '29,00€' : '9,99€'} / mois</span>
                        </li>
                    </ul>
                    <div style="background:#f8fafc; border-radius:12px; padding:12px; margin-bottom:20px; font-size:0.75rem; color:#64748b; text-align:center; font-weight:600;">
                        Paiement sécurisé par PayPal • Sans engagement
                    </div>
                    <div id="paypal-button-container-dash" style="margin-top:20px;"></div>
                </div>
            `,
            showConfirmButton: false,
            showCloseButton: true,
            width: '460px',
            padding: '24px',
            didOpen: () => {
                if (window.renderPayPalButton) {
                    const role = activeProfile.role || 'expert';
                    const planId = (role === 'entreprise') ? 'P-6JG84131PK915684CNG3VDSQ' : 'P-3DX69524C1114072WNG2AOZQ';
                    const targetTier = (role === 'entreprise') ? 'business' : 'authority';
                    window.renderPayPalButton(planId, targetTier, 'paypal-button-container-dash');
                }
            }
        });
    } else {
        window.location.href = '/profile.html';
    }
}
function renderVisibilityPreview(profile) {
    if (!profile) return;
    const container = document.getElementById('visibility-preview-container');
    const badge = document.getElementById('visibility-status-badge');
    const slot = document.getElementById('preview-card-slot');
    const prompt = document.getElementById('visibility-upgrade-prompt');
    if (!container || !badge || !slot) return;

    const isTalent = (profile.role === 'expert' || profile.role === 'prestataire' || profile.role === 'entreprise');
    
    if (!isTalent) {
        container.style.display = 'none';
        container.classList.add('hidden-force');
        return;
    }

    const isListed = !!profile.listed;

    container.classList.remove('hidden-force');
    container.style.display = 'block';
    
    // 1. Badge Status
    if (isListed) {
        badge.innerHTML = `<span class="visibility-badge public" style="background:#ecfdf5; color:#10b981; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:800;">● Publié (Actif)</span>`;
        if (prompt) prompt.style.display = 'none';
    } else {
        badge.innerHTML = `<span class="visibility-badge private" style="background:#fef2f2; color:#ef4444; padding:4px 12px; border-radius:20px; font-size:0.75rem; font-weight:800;">● Privé (Invisible)</span>`;
        if (prompt) prompt.style.display = 'block';
    }

    // 2. Render Mini Card
    const name = profile.full_name || 'Utilisateur';
    const initials = name.slice(0, 2).toUpperCase();
    const avatar = profile.avatar_url
        ? `<img src="${profile.avatar_url}" class="mini-avatar" alt="Logo">`
        : `<div class="mini-avatar">${initials}</div>`;

    slot.innerHTML = `
        <div class="mini-card" style="${!isListed ? 'opacity:0.7; filter:grayscale(0.5);' : ''}">
            ${avatar}
            <div style="overflow:hidden;">
                <h4 style="margin:0 0 4px 0; font-size:0.95rem;">${name}</h4>
                <p style="margin:0; font-size:0.75rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${profile.title || (profile.role === 'entreprise' ? 'Partenaire Entreprise' : profile.sector || 'Expert Domtom Connect')}</p>
                <div style="display:flex; gap:6px; margin-top:8px;">
                    <span style="font-size:0.65rem; background:#f8fafc; padding:2px 6px; border-radius:4px; font-weight:600;">${profile.territory || 'OM'}</span>
                    ${profile.tjm ? `<span style="font-size:0.65rem; background:rgba(16,185,129,0.1); color:#10b981; padding:2px 6px; border-radius:4px; font-weight:600;">${profile.tjm}€/j</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

// --- 4. TICKETING & TICKETS ---

async function loadMyTicketing() {
    const container = document.getElementById('billetterie-list');
    if (!container) return;
    
    try {
        const session = await getSession();
        const userId = session.user.id;

        const { data: myEvents, error: evError } = await _supabase
            .from('events')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (evError) throw evError;

        if (myEvents && myEvents.length > 0) {
            const eventIds = myEvents.map(ev => ev.id);
            const { data: allTickets, error: tkError } = await _supabase
                .from('tickets')
                .select('id, event_id, amount_paid')
                .in('event_id', eventIds);
            
            if (!tkError && allTickets) {
                myEvents.forEach(ev => {
                    ev.tickets = allTickets.filter(t => t.event_id === ev.id);
                });
            }
        }

        if (!myEvents || myEvents.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid var(--gray-200);">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🎫</div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Aucune billetterie</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">Vous n'avez pas encore publié d'événement avec billetterie Domtom Connect.</p>
                    <button onclick="openEventModal()" class="cta-button primary" style="background:#10b981;">Créer mon premier événement</button>
                </div>
            `;
            return;
        }

        container.innerHTML = myEvents.map(ev => {
            const ticketCount = ev.tickets ? ev.tickets.length : 0;
            const totalSpots = ev.total_tickets || '∞';
            const totalPaid = ev.tickets ? ev.tickets.reduce((acc, t) => acc + (parseFloat(t.amount_paid) || 0), 0) : 0;
            const netRevenue = totalPaid / 1.1; 
            const isInternal = ev.ticket_url === null;

            return `
                <div class="dash-card" style="padding: 0; overflow: hidden; border-radius: 16px;">
                    <div style="height: 120px; background: url('${ev.image_url}') center/cover no-repeat; border-bottom: 1px solid var(--gray-100);"></div>
                    <div style="padding: 20px;">
                        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
                            <h3 style="font-size: 1.1rem; font-weight: 800; margin:0; line-height:1.2;">${ev.title}</h3>
                            ${isInternal ? '<span style="background:#f0fdf4; color:#166534; font-size:0.65rem; padding:2px 6px; border-radius:4px; font-weight:800; text-transform:uppercase;">Natif</span>' : ''}
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px;">
                            <div style="background: #f8fafc; padding: 12px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 0.65rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Inscrits</div>
                                <div style="font-size: 1.1rem; font-weight: 900; color: #0f172a;">${ticketCount} / ${totalSpots}</div>
                            </div>
                            <div style="background: #f0fdf4; padding: 12px; border-radius: 10px; text-align: center;">
                                <div style="font-size: 0.65rem; font-weight: 700; color: #166534; text-transform: uppercase;">CA Total</div>
                                <div style="font-size: 1.1rem; font-weight: 900; color: #166534;">${totalPaid.toFixed(2)}€</div>
                            </div>
                        </div>

                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px; margin-bottom:8px;">
                            <button onclick="viewAttendees('${ev.id}')" class="cta-button secondary" style="width: 100%; font-size: 0.8rem; padding: 8px;">Liste</button>
                            <a href="marketplace/scanner.html?event_id=${ev.id}" class="cta-button primary" style="width: 100%; font-size: 0.8rem; padding: 8px; justify-content:center; background:#0f172a; color:white; text-decoration:none;">
                                Scanner
                            </a>
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                            <button onclick="editEvent('${ev.id}')" class="cta-button" style="width: 100%; font-size: 0.75rem; background:#f1f5f9; border:none;">Modifier</button>
                            <button onclick="deleteEvent('${ev.id}')" class="cta-button" style="width: 100%; font-size: 0.75rem; background:#fef2f2; border:none; color:#ef4444;">Supprimer</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (err) {
        console.error("Load Ticketing Error:", err);
        container.innerHTML = `<p style="color: #ef4444; padding: 40px; text-align: center;">Erreur: ${err.message}</p>`;
    }
}

async function loadMyTickets() {
    const container = document.getElementById('mes-billets-list');
    if (!container) return;

    try {
        const session = await getSession();
        if (!session) return;

        const { data: tickets, error } = await _supabase
            .from('tickets')
            .select('*, events(title, event_date, image_url, location)')
            .eq('buyer_id', session.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!tickets || tickets.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 60px; background: white; border-radius: 20px; border: 1px solid var(--gray-200);">
                    <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 8px;">Aucun billet acheté</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 24px;">Vos futurs billets s'afficheront ici.</p>
                    <a href="marketplace/evenements.html" class="cta-button primary" style="background:#10b981; text-decoration:none;">Explorer les événements</a>
                </div>
            `;
            return;
        }

        container.innerHTML = tickets.map(t => {
            const event = t.events || { title: 'Événement inconnu', event_date: '--' };
            return `
                <div class="dash-card" style="padding: 0; overflow: hidden; border-radius: 20px;">
                    <div style="height: 100px; background: url('${event.image_url}') center/cover no-repeat; position: relative;">
                        <div style="position: absolute; inset: 0; background: linear-gradient(0deg, rgba(0,0,0,0.6) 0%, transparent 100%);"></div>
                        <div style="position: absolute; bottom: 12px; left: 16px; color: white;">
                            <h3 style="font-size: 1rem; font-weight: 800; margin:0;">${event.title}</h3>
                        </div>
                    </div>
                    <div style="padding: 20px; flex-grow: 1;">
                        <div style="font-size: 0.8rem; color: #64748b; font-weight: 700; margin-bottom: 12px; display: flex; align-items: center; gap: 6px;">
                            ${event.event_date}
                        </div>
                        <div style="background: #f8fafc; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; border: 1px solid #f1f5f9;">
                            <div id="qr-attendee-${t.id}" style="width: 140px; height: 140px;"></div>
                            <div style="font-size: 0.7rem; font-weight: 800; color: #0f172a; text-transform: uppercase; margin-top:8px;">Réf: ${t.id.substring(0,8).toUpperCase()}</div>
                        </div>
                        <div style="margin-top: 15px; display: flex; gap: 8px;">
                            <button onclick="downloadTicketFromDash('${t.id}')" class="cta-button primary" style="flex:1; background:#0f172a; font-size:0.75rem;">Billet</button>
                            <a href="marketplace/evenement-details.html?id=${t.event_id}" class="cta-button secondary" style="flex:1; text-decoration:none; font-size:0.75rem; text-align:center;">Détails</a>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        tickets.forEach(t => {
            const deepLink = `${window.location.origin}/marketplace/scanner.html?token=${t.qr_token}`;
            new QRCode(document.getElementById(`qr-attendee-${t.id}`), {
                text: deepLink,
                width: 140,
                height: 140
            });
        });

    } catch (err) {
        console.error("Load My Tickets Error:", err);
    }
}

// --- 5. MATCHMAKING ---

async function loadMatchmaking(userId) {
    const container = document.getElementById('matches-container');
    const section = document.getElementById('matchmaking-section');
    if (!container) return;

    try {
        // Le Matchmaking est désormais ouvert à tous les profils qualifiés
        // sous réserve d'avoir un profil complet à plus de 80%
        const { data: profile } = await _supabase.from('profiles').select('*').eq('id', userId).single();
        
        // Calcul simple de force de profil (on peut réutiliser updateProfileStrength logic sans le DOM)
        const profileStrength = (profile.full_name ? 20 : 0) + (profile.title ? 20 : 0) + (profile.avatar_url ? 20 : 0) + (profile.bio ? 20 : 0) + (profile.skills ? 20 : 0);

        if (profileStrength < 80) {
            if (section) section.style.display = 'block';
            container.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 16px; color: #64748b; font-weight: 900;">INCOUPLET</div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Complétez votre Profil</h3>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px;">Atteignez 80% de complétion de profil pour débloquer le matchmaking et être mis en relation avec les meilleures opportunités.</p>
                    <a href="#profile" class="cta-button primary" style="background:#0f172a; border:none; text-decoration:none; padding:12px 24px; color:white; border-radius:10px; font-weight:700; display:inline-block;">Finaliser mon Profil</a>
                </div>
            `;
            return;
        }

        if (section) section.style.display = 'block';

        const { data: experts, error } = await _supabase
            .from('profiles')
            .select('*')
            .eq('role', 'expert')
            .eq('listed', true)
            .limit(3);

        if (experts && experts.length > 0) {
            container.innerHTML = experts.map(renderMatchCard).join('');
        } else {
            container.innerHTML = '<p style="color:var(--text-muted); padding:20px; text-align:center; grid-column:1/-1;">Aucun match trouvé pour le moment.</p>';
        }
    } catch (err) {
        console.error("Matchmaking Error:", err);
    }
}

function renderMatchCard(expert) {
    const name = expert.full_name || 'Expert';
    const initials = name.slice(0, 2).toUpperCase();
    return `
        <div class="dash-card" style="padding: 24px; border:1px solid var(--gray-200); border-radius:16px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <div style="width:40px; height:40px; border-radius:8px; background:#f1f5f9; display:flex; align-items:center; justify-content:center; font-weight:800; color:#475569;">${initials}</div>
                <div>
                    <div style="font-size:0.95rem; font-weight:800;">${name}</div>
                    <div style="font-size:0.75rem; color:#10b981; font-weight:700;">${expert.title || 'Expert Stratégique'}</div>
                </div>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Top match basé sur vos besoins en ${expert.sector || 'Digital'}.</p>
            <a href="messages.html?to=${expert.id}" class="cta-button primary" style="width:100%; justify-content:center; font-size:0.8rem; background:#0f172a;">Contacter cet expert</a>
        </div>
    `;
}

// --- 6. EVENT MANAGEMENT ---

async function openEventModal(editData = null) {
    let modal = document.getElementById('event-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="event-modal">
                <div class="hero-modal" style="max-width: 500px; background: white; color: var(--text-primary); padding: 32px; border-radius: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
                        <div>
                            <h2 style="color:var(--text-primary); margin:0;">Publier un Événement</h2>
                            <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:4px;">Partagez votre affiche avec la communauté.</p>
                        </div>
                        <button class="modal-close" onclick="closeEventModal()" style="color:var(--text-muted); background:none; border:none; font-size:1.5rem; cursor:pointer;">×</button>
                    </div>
                    <form onsubmit="saveEvent(event)">
                        <input type="hidden" id="ev-edit-id">
                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Titre de l'événement *</label>
                            <input type="text" id="ev-title" required placeholder="Ex: Dimanche Konpa Gouyad" style="width:100%; padding:10px; border:1.5px solid var(--gray-200); border-radius:8px; font-family:inherit;">
                        </div>
                        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:16px;">
                            <div class="form-group">
                                <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Date et Heure *</label>
                                <input type="text" id="ev-date" required placeholder="Ex: 22 Mars 2026 à 18h00" style="width:100%; padding:10px; border:1.5px solid var(--gray-200); border-radius:8px; font-family:inherit;">
                            </div>
                            <div class="form-group">
                                <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Lieu *</label>
                                <input type="text" id="ev-location" required placeholder="Ex: Le Guest Live" style="width:100%; padding:10px; border:1.5px solid var(--gray-200); border-radius:8px; font-family:inherit;">
                            </div>
                        </div>
                        <div id="tiers-section" style="margin-bottom: 16px;">
                            <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Tarifs de la Billetterie *</label>
                            <div id="tiers-container"></div>
                            <button type="button" onclick="addTierRow()" style="background:none; border:1.5px dashed #10b981; color:#10b981; width:100%; padding:10px; border-radius:8px; cursor:pointer; font-size:0.8rem; font-weight:700; margin-top:8px;">+ Ajouter un tarif (ex: Early Bird, VIP...)</button>
                        </div>

                        <div class="form-group" style="margin-bottom:16px;">
                            <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Affiche / Flyer (Image) *</label>
                            <input type="file" id="ev-image" accept="image/*" style="width:100%; padding:10px; border:1.5px solid var(--gray-200); border-radius:8px; font-family:inherit; background:var(--bg-light);">
                        </div>
                        <div class="form-group" style="margin-bottom:24px;">
                            <label style="color:var(--text-secondary); font-size:0.75rem; font-weight:700; text-transform:uppercase; display:block; margin-bottom:8px;">Description (Optionnel)</label>
                            <textarea id="ev-desc" placeholder="Détails de l'événement..." style="width:100%; padding:10px; border:1.5px solid var(--gray-200); border-radius:8px; font-family:inherit; height:80px;"></textarea>
                        </div>
                        <button type="submit" id="btn-save-event" class="cta-button primary" style="width:100%; background:#10b981; border:none; padding:12px; font-weight:700; border-radius:8px; color:white; cursor:pointer;">Publier l'événement</button>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('event-modal');
    }

    // Populate or Reset form
    const titleEl = document.getElementById('ev-title');
    const dateEl = document.getElementById('ev-date');
    const locEl = document.getElementById('ev-location');
    const descEl = document.getElementById('ev-desc');
    const fileEl = document.getElementById('ev-image');
    const editIdEl = document.getElementById('ev-edit-id');
    const btn = document.getElementById('btn-save-event');
    const head = modal.querySelector('h2');
    const tiersContainer = document.getElementById('tiers-container');

    if (tiersContainer) tiersContainer.innerHTML = '';

    if (editData) {
        if (head) head.textContent = "Modifier l'Événement";
        if (btn) btn.textContent = "Mettre à jour";
        if (titleEl) titleEl.value = editData.title || '';
        if (dateEl) dateEl.value = editData.event_date || '';
        if (locEl) locEl.value = editData.location || '';
        if (descEl) descEl.value = editData.description || '';
        if (editIdEl) editIdEl.value = editData.id;
        if (fileEl) fileEl.required = false;

        const tiers = editData.ticket_tiers || [];
        if (tiers.length > 0) {
            tiers.forEach(t => addTierRow(t));
        } else {
            addTierRow();
        }
    } else {
        if (head) head.textContent = "Publier un Événement";
        if (btn) btn.textContent = "Publier l'événement";
        if (titleEl) titleEl.value = '';
        if (dateEl) dateEl.value = '';
        if (locEl) locEl.value = '';
        if (descEl) descEl.value = '';
        if (editIdEl) editIdEl.value = '';
        if (fileEl) fileEl.required = true;
        addTierRow();
    }

    modal.classList.add('open');
    modal.style.display = 'flex';
}

function addTierRow(data = null) {
    const container = document.getElementById('tiers-container');
    if (!container) return;
    const row = document.createElement('div');
    row.className = 'tier-row';
    row.style = "display:grid; grid-template-columns: 2fr 1fr 1fr 40px; gap:8px; margin-bottom:8px; align-items:center;";
    row.innerHTML = `
        <input type="text" class="t-name" required placeholder="Nom" value="${data ? data.name : ''}" style="padding:8px; border:1px solid #e2e8f0; border-radius:6px;">
        <input type="number" class="t-price" required step="0.01" placeholder="Prix" value="${data ? data.price : ''}" style="padding:8px; border:1px solid #e2e8f0; border-radius:6px;">
        <input type="number" class="t-cap" required placeholder="Places" value="${data ? data.capacity : ''}" style="padding:8px; border:1px solid #e2e8f0; border-radius:6px;">
        <button type="button" onclick="this.parentElement.remove()" style="background:#fee2e2; color:#ef4444; border:none; border-radius:6px; cursor:pointer;">×</button>
    `;
    container.appendChild(row);
}

function closeEventModal() {
    const modal = document.getElementById('event-modal');
    if (modal) {
        modal.classList.remove('open');
        modal.style.display = 'none';
    }
}

async function saveEvent(event) {
    event.preventDefault();
    const btn = document.getElementById('btn-save-event');
    const originalText = btn.textContent;
    btn.textContent = "Opération en cours...";
    btn.disabled = true;

    try {
        const session = await getSession();
        if (!session) throw new Error("Vous devez être connecté.");

        const editId = document.getElementById('ev-edit-id').value;
        const title = document.getElementById('ev-title').value;
        const dateText = document.getElementById('ev-date').value;
        const location = document.getElementById('ev-location').value;
        const desc = document.getElementById('ev-desc').value;

        const fileInput = document.getElementById('ev-image');
        const file = fileInput.files[0];

        // Collect tiers
        const tierRows = document.querySelectorAll('.tier-row');
        const tiers = Array.from(tierRows).map(row => ({
            id: Math.random().toString(36).substring(2, 9),
            name: row.querySelector('.t-name').value,
            price: parseFloat(row.querySelector('.t-price').value) || 0,
            capacity: parseInt(row.querySelector('.t-cap').value) || 0
        }));

        if (tiers.length === 0) throw new Error("Veuillez ajouter au moins un tarif.");

        let imageUrl = null;

        if (file) {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
            const filePath = `${session.user.id}/${fileName}`;
            const { error: uploadError } = await _supabase.storage.from('events_flyers').upload(filePath, file);
            if (uploadError) throw uploadError;
            const { data: publicUrlData } = _supabase.storage.from('events_flyers').getPublicUrl(filePath);
            imageUrl = publicUrlData.publicUrl;
        } else if (editId) {
            const { data: existing } = await _supabase.from('events').select('image_url').eq('id', editId).single();
            imageUrl = existing.image_url;
        } else {
            throw new Error("Une affiche est requise.");
        }

        const payload = {
            user_id: session.user.id,
            title: title,
            event_date: dateText,
            location: location,
            ticket_url: null, // Native
            description: desc,
            image_url: imageUrl,
            ticket_tiers: tiers,
            price: tiers[0].price,
            total_tickets: tiers.reduce((acc, t) => acc + t.capacity, 0)
        };

        let resultError;
        if (editId) {
            const { error } = await _supabase.from('events').update(payload).eq('id', editId);
            resultError = error;
        } else {
            const { error } = await _supabase.from('events').insert([payload]);
            resultError = error;
        }

        if (resultError) throw resultError;

        alert(editId ? "✅ Événement mis à jour !" : "🎉 Événement publié avec succès !");
        closeEventModal();
        loadMyTicketing();
        event.target.reset();

    } catch (err) {
        console.error("Save Event Error:", err);
        alert("Erreur: " + err.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
}

async function editEvent(eventId) {
    try {
        const { data: ev, error } = await _supabase.from('events').select('*').eq('id', eventId).single();
        if (error) throw error;
        openEventModal(ev);
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

async function deleteEvent(eventId) {
    if (!confirm("⚠️ SUPPRESSION ÉVÉNEMENT\n\nÊtes-vous sûr ?")) return;
    try {
        const { error } = await _supabase.from('events').delete().eq('id', eventId);
        if (error) throw error;
        alert("Supprimé.");
        loadMyTicketing();
    } catch (err) {
        alert("Erreur: " + err.message);
    }
}

// --- 7. GLOBAL ACTIONS ---

function handleLogout() {
    signOut(); // From auth.js
}

async function toggleListing(currentStatus) {
    const newStatus = !currentStatus;
    if (!confirm(`Voulez-vous vraiment ${newStatus ? 'republier' : 'masquer'} votre profil ?`)) return;

    try {
        const session = await getSession();
        const { error } = await _supabase.from('profiles').update({ listed: newStatus }).eq('id', session.user.id);
        if (error) throw error;
        window.location.reload();
    } catch (err) {
        alert(err.message);
    }
}

// Exports
window.showView = showView;
window.checkSession = checkSession;
window.handleLogout = handleLogout;
window.toggleListing = toggleListing;
window.openEventModal = openEventModal;
window.closeEventModal = closeEventModal;
window.addTierRow = addTierRow;
window.saveEvent = saveEvent;
window.editEvent = editEvent;
window.deleteEvent = deleteEvent;
window.loadMatchmaking = loadMatchmaking;

window.viewAttendees = async (eventId) => {
    let modal = document.getElementById('attendees-modal');
    if (!modal) {
        const modalHTML = `
            <div class="modal-overlay" id="attendees-modal">
                <div class="hero-modal" style="max-width: 700px; background: white; color: var(--text-primary); padding: 32px; border-radius: 16px;">
                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:24px;">
                        <div>
                            <h2 style="color:var(--text-primary); margin:0;">Liste des Participants</h2>
                            <p style="color:var(--text-secondary); font-size:0.85rem; margin-top:4px;">Suivi des entrées et validations en temps réel.</p>
                        </div>
                        <button class="modal-close" onclick="closeAttendeesModal()" style="color:var(--text-muted); background:none; border:none; font-size:1.5rem; cursor:pointer;">×</button>
                    </div>
                    <div id="attendees-list-container" style="max-height: 400px; overflow-y: auto;">
                        <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                            <thead>
                                <tr style="border-bottom: 2px solid var(--gray-100); text-align: left;">
                                    <th style="padding: 12px 8px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.7rem;">Email / Client</th>
                                    <th style="padding: 12px 8px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.7rem;">Type</th>
                                    <th style="padding: 12px 8px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.7rem;">Statut</th>
                                    <th style="padding: 12px 8px; color: var(--text-secondary); font-weight: 700; text-transform: uppercase; font-size: 0.7rem;">Validé le</th>
                                </tr>
                            </thead>
                            <tbody id="attendees-tbody">
                                <!-- Rows filled by JS -->
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        modal = document.getElementById('attendees-modal');
        modal.addEventListener('click', (e) => { if (e.target === modal) closeAttendeesModal(); });
    }

    const tbody = document.getElementById('attendees-tbody');
    if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px;">Chargement...</td></tr>';
    modal.classList.add('open');
    modal.style.display = 'flex';

    try {
        const { data: tickets, error } = await _supabase
            .from('tickets')
            .select('*')
            .eq('event_id', eventId)
            .order('validated_at', { ascending: false, nullsFirst: false })
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!tickets || tickets.length === 0) {
            if (tbody) tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:20px; color:var(--text-muted);">Aucun participant inscrit.</td></tr>';
            return;
        }

        if (tbody) {
            tbody.innerHTML = tickets.map(t => {
                const isValidated = t.status === 'utilisé';
                const rawDate = t.validated_at || (isValidated ? t.updated_at : null);
                const dateVal = rawDate ? new Date(rawDate).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '-';
                return `
                    <tr style="border-bottom: 1px solid var(--gray-100);">
                        <td style="padding: 12px 8px; font-weight: 600;">${t.buyer_email}</td>
                        <td style="padding: 12px 8px;">${t.tier_name || 'Standard'}</td>
                        <td style="padding: 12px 8px;">
                            <span style="display:inline-block; padding:2px 8px; border-radius:12px; font-size:0.75rem; font-weight:800; 
                                ${isValidated ? 'background:#dcfce7; color:#166534;' : 'background:#f1f5f9; color:#475569;'}">
                                ${isValidated ? '✓ VALIDÉ' : 'ATTENTE'}
                            </span>
                        </td>
                        <td style="padding: 12px 8px; font-size: 0.8rem; color: var(--text-secondary);">${dateVal}</td>
                    </tr>
                `;
            }).join('');
        }

    } catch (err) {
        if (tbody) tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; padding:20px; color:#ef4444;">Erreur: ${err.message}</td></tr>`;
    }
};

// --- FINAL INITIALIZATION ---
document.addEventListener('DOMContentLoaded', async () => {
    // 1. GESTION MENU BURGER (MOBILE)
    const navToggle = document.querySelector('.nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (navToggle) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const siteNav = document.getElementById('site-nav');
            if (siteNav) siteNav.classList.toggle('is-open');
            if (sidebar) sidebar.classList.toggle('is-mobile-active');
            navToggle.classList.toggle('active');
            const expanded = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !expanded);
        });
    }

    const session = await checkSession();
    // Ne pas appeler renderMobileNav ici car userProfile n'est pas forcément prêt
    
    // 3. ROUTAGE INITIAL
    initRouting();

    // 4. DEEP LINKING ACTIONS (Events, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'create' && window.location.hash.includes('billetterie')) {
        setTimeout(() => openEventModal(), 500);
    }

    // 4. INTERCEPTEUR DE CLICS GLOBAL (Navigation Hash)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            const viewId = link.getAttribute('href').slice(1);
            if (viewId && viewId !== 'javascript:void(0)') {
                console.log("Routing to:", viewId);
                showView(viewId, true);
            }
        }
    });

    // 5. EXPORT GLOBAL (Sécurité supplémentaire)
    window.showView = showView;
    window.handleRouting = handleRouting;
});

/**
 * --- BUSINESS LOGIC: PAYPAL & CONVERSION ---
 * Restoring the Pack -> PayPal -> Success flow
 */
window.renderPayPalButton = async function(planId, tier, containerId = 'paypal-button-container') {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<p style="color:#64748b; font-size:0.75rem; text-align:center;">Initialisation du paiement sécurisé...</p>';
    
    try {
        // We use the last known zone from current user profile
        const zoneId = window.userProfile ? window.userProfile.major_zone : 'OM_FR';
        await loadPayPalSDK(zoneId, 'subscription');

        if (typeof paypal !== 'undefined') {
            paypal.Buttons({
                style: { layout: 'vertical', color: 'black', shape: 'rect', label: 'subscribe' },
                createSubscription: function (data, actions) {
                    return actions.subscription.create({ 'plan_id': planId });
                },
                onApprove: function (data, actions) {
                    handleSubscriptionSuccess(data.subscriptionID, tier);
                },
                onError: function (err) {
                    console.error('PayPal Error:', err);
                    container.innerHTML = `<p style="color:#ef4444; font-size:0.75rem; text-align:center;">Erreur PayPal : ${err.message || 'ID Invalide'}</p>`;
                }
            }).render(`#${containerId}`);
        }
    } catch (err) {
        console.error("PayPal Loader Error:", err);
        container.innerHTML = `<p style="color:#ef4444; font-size:0.75rem; text-align:center;">Échec du chargement PayPal : ${err}</p>`;
    }
};

async function handleSubscriptionSuccess(subscriptionId, tier) {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (!user) throw new Error("Session expirée.");

        const { error } = await _supabase
            .from('profiles')
            .update({
                subscription_tier: tier,
                subscription_id: subscriptionId,
                last_payment_date: new Date().toISOString(),
                listed: true
            })
            .eq('id', user.id);

        if (error) throw error;

        // Celebration Logic
        if (typeof confetti !== 'undefined') {
            const end = Date.now() + (3 * 1000);
            const colors = ['#10b981', '#3b82f6', '#ffffff'];

            (function frame() {
                confetti({
                    particleCount: 3,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: colors
                });
                confetti({
                    particleCount: 3,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: colors
                });

                if (Date.now() < end) {
                    requestAnimationFrame(frame);
                }
            }());
        }

        // Specific Alert for Strategic Partner
        const isPartner = (tier === 'authority');
        const message = isPartner 
            ? "Félicitations ! Vous êtes désormais Partenaire Stratégique. Votre Collaboration Active est lancée !"
            : "Félicitations ! Votre Pack est maintenant activé.";

        if (typeof Swal !== 'undefined') {
            await Swal.fire({
                icon: 'success',
                title: 'Certification Validée',
                text: message,
                confirmButtonColor: '#10b981'
            });
        } else {
            alert(message);
        }

        window.location.reload();
    } catch (err) {
        alert('Erreur lors de l\'activation : ' + err.message);
    }
}

/**
 * --- GLOBAL HANDLERS ---
 */
window.createNewSREProject = async function() {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (!user) { alert("Session expirée."); return; }

        const title = prompt("Nom de votre nouveau projet 'Épopée' :");
        if (!title) return;

        const { data, error } = await _supabase
            .from('projects')
            .insert([{ 
                owner_id: user.id, 
                title: title,
                verification_status: 'pending'
            }])
            .select()
            .single();

        if (error) throw error;
        alert("Projet créé ! Accédez au Success Engine pour le compléter.");
        showView('success-engine', true);
    } catch (err) {
        alert("Erreur création : " + err.message);
    }
};

/**
 * --- PROFILE MANAGEMENT FUNCTIONS ---
 */
window.toggleEditMode = function() {
    window.isEditing = !window.isEditing;
    const form = document.getElementById('profile-form');
    if (!form) return;

    const fields = form.querySelectorAll('input, textarea, select');
    fields.forEach(f => f.disabled = !window.isEditing);
    
    const actions = document.getElementById('form-actions');
    if (actions) actions.style.display = window.isEditing ? 'flex' : 'none';
    
    const btn = document.getElementById('edit-toggle-btn');
    if (btn) {
        btn.innerHTML = window.isEditing ? '<i class="fas fa-times"></i> Annuler l\'édition' : '<i class="fas fa-edit"></i> Modifier mon profil';
        if (window.isEditing) btn.classList.add('outline'); else btn.classList.remove('outline');
    }
};

/**
 * --- DYNAMIC PAYPAL SDK LOADER ---
 * Injects the PayPal SDK with zone-specific currency and locale.
 */
window.loadPayPalSDK = function(zoneId, type = 'subscription') {
    return new Promise((resolve, reject) => {
        if (window.paypal) {
            resolve(window.paypal);
            return;
        }

        if (!window.TerritoryConfig) {
            console.error("TerritoryConfig missing");
            reject("Config missing");
            return;
        }

        // Force EUR for Domtom Connect Production (OM_FR / International accounts)
        const currency = 'EUR';
        const locale = config ? config.locale : 'fr_FR';
        
        const clientId = "AcBmagCWJpj_JUQpRivjdlrowAA48XOvpD_B022bRdhQqQzYIHR6LgAKLdFadgLKHUa4BPqpYwstW825";
        let sdkUrl = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=${currency}&locale=${locale}`;
        
        if (type === 'subscription') {
            sdkUrl += "&vault=true&intent=subscription";
        }

        const script = document.createElement('script');
        script.src = sdkUrl;
        script.onload = () => resolve(window.paypal);
        script.onerror = () => reject("PayPal SDK load failed");
        document.head.appendChild(script);
    });
};

window.cancelEdit = function() {
    if (window.originalProfileData) fillProfileForm(window.originalProfileData);
    toggleEditMode();
};

window.saveProfile = async function(e) {
    if (e) e.preventDefault();
    const btn = document.getElementById('btn-save-profile');
    if (btn) {
        btn.disabled = true;
        btn.textContent = "ENREGISTREMENT...";
    }

    try {
        const updates = {
            full_name: document.getElementById('full_name').value,
            title: document.getElementById('title').value,
            territory: document.getElementById('territory').value,
            website_url: document.getElementById('website_url').value,
            bio: document.getElementById('bio').value,
            linkedin_url: document.getElementById('linkedin_url').value,
            facebook_url: document.getElementById('facebook_url').value,
            avatar_url: document.getElementById('avatar_url').value,
            updated_at: new Date().toISOString()
        };

        const { error } = await _supabase
            .from('profiles')
            .update(updates)
            .eq('id', window.userProfile.id);

        if (error) throw error;

        window.userProfile = { ...window.userProfile, ...updates };
        window.originalProfileData = { ...window.userProfile };
        
        if (typeof Swal !== 'undefined') {
            Swal.fire({ icon: 'success', title: 'Profil mis à jour !', toast: true, position: 'top-end', showConfirmButton: false, timer: 3000 });
        } else {
            alert("Profil mis à jour !");
        }

        fillProfileForm(window.userProfile);
        toggleEditMode();

    } catch (err) {
        alert("Erreur: " + err.message);
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.textContent = "ENREGISTRER LES MODIFICATIONS";
        }
    }
};

function fillProfileForm(p) {
    if (!p) return;
    
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
    set('full_name', p.full_name);
    set('title', p.title);
    set('territory', p.territory);
    set('website_url', p.website_url);
    set('bio', p.bio);
    set('linkedin_url', p.linkedin_url);
    set('facebook_url', p.facebook_url);
    set('avatar_url', p.avatar_url);

    // Displays
    const nameDisp = document.getElementById('profile-full-name-display');
    if (nameDisp) nameDisp.textContent = p.full_name || 'Sans nom';
    
    const roleDisp = document.getElementById('profile-role-tag-display');
    if (roleDisp) {
        const roles = { 'expert': 'EXPERT / FREELANCE', 'entreprise': 'ENTREPRISE / BUSINESS', 'user': 'PORTEUR D\'ÉPOPÉE', 'admin': 'ADMINISTRATEUR' };
        roleDisp.textContent = roles[p.role] || 'MEMBRE';
    }

    const img = document.getElementById('profile-avatar-img');
    if (img) img.src = p.avatar_url || 'assets/images/default-avatar.png';
}

window.handleFileSelect = async function(input) {
    const file = input.files[0];
    if (!file) return;

    const preview = document.getElementById('profile-avatar-img');
    if (preview) preview.src = URL.createObjectURL(file);

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${window.userProfile.id}_${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await _supabase.storage
            .from('profiles-media')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = _supabase.storage
            .from('profiles-media')
            .getPublicUrl(filePath);

        document.getElementById('avatar_url').value = publicUrl;
        
    } catch (err) {
        alert("Erreur upload: " + err.message);
    }
};

/**
 * --- MULTI-ACCOUNT DETECTION (COLLABORATIONS) ---
 */
window.checkCollaborations = async function(email) {
    if (!email) return [];
    try {
        // Step 1: Get accepted collaboration links only for the switcher
        const { data: collabs, error: collError } = await _supabase
            .from('collaborators')
            .select('*')
            .eq('collaborator_email', email)
            .eq('status', 'accepted'); 

        if (collError) throw collError;
        if (!collabs || collabs.length === 0) return [];

        // Step 2: Get Profile data for these owners
        const ownerIds = collabs.map(c => c.owner_id);
        const { data: owners, error: profError } = await _supabase
            .from('profiles')
            .select('id, company_name, full_name')
            .in('id', ownerIds);

        if (profError) throw profError;

        // Merge data manually for the UI
        return collabs.map(c => {
            const profile = owners.find(p => p.id === c.owner_id);
            return {
                ...c,
                profiles: profile || { company_name: "Entreprise Inconnue", full_name: "Collaborateur" }
            };
        });
    } catch (err) {
        console.error("Collab Detection Error:", err);
        return [];
    }
};

window.renderCollaborationSwitch = function(collabs) {
    const container = document.getElementById('ecosystem-grid-container');
    if (!container || !collabs || collabs.length === 0) return;

    const switchHTML = `
        <div class="dash-card collab-notification" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white; border-radius: 20px; padding: 32px; margin-bottom: 24px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <h3 style="margin:0; font-size:1.1rem; font-weight:800; display:flex; align-items:center; gap:8px;">
                        <span style="background:rgba(16, 185, 129, 0.2); color:#10b981; padding:4px 10px; border-radius:100px; font-size:0.65rem; text-transform:uppercase;">Accès Collaborateur</span>
                        Comptes gérés
                    </h3>
                    <p style="margin:8px 0 0 0; font-size:0.85rem; color:#94a3b8;">Vous avez été invité à gérer les annonces de ces entreprises :</p>
                </div>
            </div>
            
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap:12px; margin-top:20px;">
                ${collabs.map(c => `
                    <button onclick="switchContext('${c.owner_id}', '${c.profiles.company_name || c.profiles.full_name}')" style="background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:16px; border-radius:12px; color:white; text-align:left; cursor:pointer; transition:0.2s;">
                        <p style="margin:0; font-size:0.85rem; font-weight:800; overflow:hidden; text-overflow:ellipsis;">${c.profiles.company_name || c.profiles.full_name}</p>
                        <p style="margin:4px 0 0 0; font-size:0.65rem; color:#64748b; text-transform:uppercase;">Gérer les offres →</p>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    container.insertAdjacentHTML('afterbegin', switchHTML);
};

window.switchContext = function(ownerId, name) {
    window.activeBusinessId = ownerId;
    Swal.fire({
        title: 'Changement de compte',
        text: `Vous gérez maintenant l'espace de : ${name}`,
        icon: 'info',
        confirmButtonColor: '#10b981'
    });
    
    // Refresh main view if on enterprise module
    showView('overview', true);
};

window.fetchBusinessStats = async function(userId) {
    if (!userId) return { views: 0, applications: 0 };
    try {
        // 1. Get Views from Profile
        const { data: profile, error: pError } = await _supabase
            .from('profiles')
            .select('views_count')
            .eq('id', userId)
            .single();

        // 2. Count Applications for all jobs of this company
        // We first get job IDs for this company, then count applications
        const { data: jobs, error: jError } = await _supabase
            .from('job_offers')
            .select('id')
            .eq('company_id', userId);

        let appCount = 0;
        if (jobs && jobs.length > 0) {
            const jobIds = jobs.map(j => j.id);
            const { count, error: aError } = await _supabase
                .from('job_applications')
                .select('*', { count: 'exact', head: true })
                .in('job_offer_id', jobIds);
            appCount = count || 0;
        }

        return {
            views: profile ? profile.views_count : 0,
            applications: appCount
        };
    } catch (err) {
        console.error("Stats Fetch Error:", err);
        return { views: 0, applications: 0 };
    }
};

window.handleDeleteAccount = async function() {
    if (!confirm("ATTENTION : La suppression de votre compte est irréversible. Voulez-vous continuer ?")) return;
    
    try {
        const { error } = await _supabase.rpc('delete_user_own_account');
        if (error) throw error;
        signOut();
    } catch (err) {
        alert("Impossible de supprimer le compte automatiquement. Contactez le support.");
    }
};

/**
 * --- DYNAMIC MOBILE NAVIGATION ---
 * Renders bottom navigation links based on user role.
 */
function renderMobileNav(role) {
    const nav = document.querySelector('.mobile-nav');
    if (!nav) return;

    let links = [];
    const normalizedRole = role === 'company' ? 'entreprise' : (role === 'owner' ? 'porteur' : role);

    if (normalizedRole === 'entreprise') {
        links = [
            { id: 'espace', label: 'Espace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/mon-espace' },
            { id: 'missions', label: 'Missions', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', href: '#missions' },
            { id: 'messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', href: '/messages' },
            { id: 'profile', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' }
        ];
    } else if (normalizedRole === 'expert') {
        links = [
            { id: 'espace', label: 'Espace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/mon-espace' },
            { id: 'board', label: 'Board', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01', href: '/marketplace/jobs' },
            { id: 'messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', href: '/messages' },
            { id: 'profile', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' }
        ];
    } else {
        links = [
            { id: 'espace', label: 'Espace', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', href: '/mon-espace' },
            { id: 'epopee', label: 'Épopée', icon: 'M13 10V3L4 14h7v7l9-11h-7z', href: '/epopee' },
            { id: 'messages', label: 'Messages', icon: 'M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z', href: '/messages' },
            { id: 'profile', label: 'Profil', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z', href: '/profile' }
        ];
    }

    nav.innerHTML = links.map(link => `
        <a href="${link.href}" class="mobile-nav-link ${window.location.hash.includes(link.id) || (window.location.pathname.includes(link.href) && !window.location.hash) ? 'active' : ''}">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" style="width:22px; height:22px; stroke-width:2.5;">
                <path d="${link.icon}" />
            </svg>
            <span class="mobile-nav-label">${link.label}</span>
        </a>
    `).join('');
}
