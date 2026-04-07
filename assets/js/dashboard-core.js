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

window.showView = showView;

function calculateProjectMaturity(p) {
    if (!p) return 0;
    let score = 0;
    
    // Step 1: Identité (16%)
    const hasVision = p.vision && p.vision.trim() !== '' && !p.vision.includes('[[VISION]]');
    const hasMission = p.mission && p.mission.trim() !== '' && !p.mission.includes('[[MISSION]]');
    const hasEnjeu = p.enjeu && p.enjeu.trim() !== '' && !p.enjeu.includes('[[PROBLEM]]');
    if (hasVision && hasMission && hasEnjeu) score += 16;

    // Step 2: Humain (16%)
    if (p.equipe && p.equipe.trim().length > 10) score += 16;

    // Step 3: Terrain (17%)
    if (p.marche && p.marche.trim().length > 10) score += 17;

    // Step 4: Valeur (17%)
    const hasImpact = p.impact_local && p.impact_local.trim().length > 10;
    const hasInnovation = p.innovation && p.innovation.trim().length > 10;
    const hasJobs = p.emplois && p.emplois.trim().length > 2;
    if (hasImpact || hasInnovation || hasJobs) score += 17;

    // Step 5: Objectifs (17%)
    if (p.funding_goal && parseFloat(p.funding_goal) > 0) score += 17;

    // Step 6: Envol (17%)
    const isVerified = p.verification_status === 'verified';
    const hasPitch = p.pitch_texte && p.pitch_texte.trim().length > 20;
    
    if (isVerified && hasPitch) score += 17;
    else if (isVerified || hasPitch) score += 8;

    return Math.min(score, 100);
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
    if (target) {
        target.style.display = 'block';
        
        // 3. Gestion des headers et navbar specifiques
        const isOverview = baseView === 'overview';
        const greeting = document.querySelector('.dash-section-header');
        const topNav = document.querySelector('.top-nav');

        if (greeting) greeting.style.display = isOverview ? 'block' : 'none';
        if (topNav) topNav.style.display = isOverview ? 'flex' : 'none';

        // 4. Chargements spécifiques
        if (baseView === 'profile') {
            if (typeof loadUserProfileData === 'function') loadUserProfileData();
        } else if (baseView === 'billetterie') {
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
        }
    }

    // 5. Mettre à jour l'état actif des liens (Sidebar & Mobile Nav)
    const navLinks = document.querySelectorAll('.sidebar-link, .mobile-nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${baseView}`) {
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

// --- 2. SESSION & CONTENT LOADING ---

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
    
    const tier = profile.subscription_tier || 'free';
    const isListed = !!profile.listed;

    console.log("Dashboard Core Debug - Role:", role, "IsAdmin:", isAdmin, "Tier:", tier);
    // UI Updates
    // UI Updates
    const greetingEl = document.getElementById('user-greeting');
    // Mettre à jour le greeting avec le nom complet sans point final si possible (pour coller au screen)
    if (greetingEl) greetingEl.textContent = `Bonjour, ${name}`; 

    const roleBadge = document.getElementById('user-role-badge');
    if (roleBadge) {
        renderRoleBadge(roleBadge, role);
    }

    // Render Cards
    renderDashboardCards(role, tier, isListed, profile);

    // Profile Strength & Visibility
    updateProfileStrength(profile);
    renderVisibilityPreview(profile);

    // Load Success Engine data if applicable (only for project owners)
    const isProjectOwner = role !== 'expert' && role !== 'prestataire' && role !== 'entreprise' && role !== 'admin';
    if (typeof loadMyProjects === 'function' && isProjectOwner) {
        loadMyProjects(user.id);
    }

    // Load Matchmaking for companies and experts
    if (role === 'entreprise' || role === 'expert' || role === 'prestataire') {
        if (typeof loadMatchmaking === 'function') {
            loadMatchmaking(user.id);
        }
    }

    // --- NAVIGATION SECURITY : Hide Cockpit for non-project owners ---
    const epopeeLink = document.getElementById('nav-success-engine');
    if (epopeeLink) {
        // "L'Épopée" est RÉSERVÉ aux porteurs de projet OU aux Admins
        if (role === 'admin') {
            epopeeLink.style.display = 'flex';
            // Ajout d'une pastille de notif si admin
            const dot = document.getElementById('admin-notif-dot');
            if (dot) dot.style.display = 'block'; 
        } else if (role === 'expert' || role === 'prestataire' || role === 'entreprise') {
            epopeeLink.style.display = 'none';
        } else {
            epopeeLink.style.display = 'flex';
        }
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

function renderDashboardCards(role, tier, isListed, profile) {
    const container = document.getElementById('dashboard-cards');
    const additional = document.getElementById('additional-content');
    if (!container) return;

    // --- BLOC ADMIN PRIORITAIRE (NUCLEAR FIX) ---
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
        
        // Charger immédiatement les projets
        loadPendingProjects();
    } else if (role === 'expert' || role === 'prestataire') {
        container.innerHTML = `
            <!-- ZONE DE PILOTAGE EXPERT -->
            <div class="dash-section-pilotage">
                <div class="dash-pilotage-header">
                    <div>
                        <h2 class="success-engine-project-title">MON ACTIVITÉ EXPERT</h2>
                        <p class="success-engine-subtitle">Gérez vos missions, contrats et revenus.</p>
                    </div>
                </div>
                
                <div class="ecosystem-grid">
                    <div class="dash-card-premium" style="border-left: 4px solid #10b981;">
                        <div class="dash-card-icon" style="background: rgba(16,185,129,0.1); color: #10b981; font-weight: 800; font-size: 0.8rem;">TJM</div>
                        <div class="card-title">Cadrage Financier</div>
                        <p class="card-desc">Calculez votre TJM stratégique et gérez votre trésorerie.</p>
                        <div style="display:flex; flex-direction:column; gap:8px; margin-top:auto;">
                            <a href="https://solopricepro.vercel.app/tjm-calculator" target="_blank" class="cta-button primary" style="justify-content:center; background:#10b981;">Calculer mon TJM</a>
                            <a href="https://solopricepro.vercel.app/" target="_blank" class="cta-button secondary" style="justify-content:center;">Gérer ma facturation</a>
                        </div>
                    </div>

                    <div class="dash-card-premium" style="border-left: 4px solid #10b981;">
                        <div class="dash-card-icon" style="background: rgba(16,185,129,0.1); color: #10b981; font-weight: 800; font-size: 0.8rem;">EUR</div>
                        <div class="card-title">Contrats & Commissions</div>
                        <p class="card-desc">Déclarez vos contrats signés et suivez vos gains.</p>
                        <div style="margin: 12px 0; font-size: 0.85rem; color: var(--text-secondary);">
                            <div style="display:flex; justify-content:space-between;"><span>Cumul HT :</span> <strong id="total-signed">0 €</strong></div>
                        </div>
                        <button onclick="openSignatureModal()" class="cta-button primary" style="background:#10b981; justify-content:center; margin-top:auto;">Déclarer Signature</button>
                    </div>

                    <div class="dash-card-premium">
                        <div class="dash-card-icon" style="background: rgba(245,158,11,0.1); color: #f59e0b; font-weight: 800; font-size: 0.8rem;">EVT</div>
                        <div class="card-title">Ma Billetterie</div>
                        <p class="card-desc">Gérez vos propres événements et suivez vos ventes.</p>
                        <button onclick="showView('billetterie')" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Gérer mes ventes</button>
                    </div>
                </div>
            </div>

            <!-- ZONE ÉCOSYSTÈME & SERVICES -->
            <div class="dash-section-ecosystem">
                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">ÉCOSYSTÈME DOMTOM CONNECT</h3>
                <div class="ecosystem-grid">
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">NAV</div>
                        <div class="card-title">Messagerie</div>
                        <p class="card-desc">Échangez avec les porteurs et entreprises.</p>
                        <a href="messages.html" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Ouvrir</a>
                    </div>
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">TIC</div>
                        <div class="card-title">Mes Billets</div>
                        <p class="card-desc">Vos accès aux événements du réseau.</p>
                        <button onclick="showView('mes-billets')" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Voir</button>
                    </div>
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">ART</div>
                        <div class="card-title">Ressources</div>
                        <p class="card-desc">Blog, guides et astuces pour réussir.</p>
                        <a href="/blog" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Lire</a>
                    </div>
                </div>
            </div>
        `;
        
        // Update Profile Strength
        updateProfileStrength(profile);
        renderVisibilityPreview(profile);

        // === PACKS HYBRIDES (Restauré depuis epopee.html) ===
        const packsHTML = `
            <div style="margin-top:40px;">
                <p style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">Développez votre clientèle</p>
                <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:6px;color:var(--text-primary);">Votre présence sur Domtom Connect</h2>
                <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:32px;">Nous construisons votre visibilité pendant que vous vous concentrez sur vos missions.</p>

                <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;align-items:start;">

                    <!-- PACK 1 : PRÉSENCE -->
                    <div style="background:white;border:1.5px solid var(--gray-200);border-radius:16px;padding:28px;">
                        <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">Présence</div>
                        <div style="font-size:2rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">0€</div>
                        <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:16px;">Gratuit — Accès restreint</p>
                        <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:0.875rem;color:var(--text-secondary);">
                            <li>— Accès au fil du réseau</li>
                            <li>— Mise en relation basique</li>
                            <li>— Candidatures aux missions</li>
                            <li style="color:var(--gray-300);">— Invisible dans l'annuaire</li>
                            <li style="color:var(--gray-300);">— Pas de badge "Vérifié"</li>
                        </ul>
                        <div id="current-plan-free" style="background:var(--bg-light);border-radius:8px;padding:10px;text-align:center;font-weight:600;font-size:0.875rem;color:var(--text-muted); display:${tier === 'free' ? 'block' : 'none'};">Votre plan actuel</div>
                    </div>

                    <!-- PACK 2 : PACK EXPERT -->
                    <div style="background:white;border:2px solid #10b981;border-radius:16px;padding:28px;position:relative;box-shadow:0 8px 24px rgba(16,185,129,0.12);">
                        <div style="position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:#10b981;color:white;font-size:0.7rem;font-weight:800;padding:4px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Populaire : Visibilité & Contenu</div>
                        <div style="font-size:0.75rem;font-weight:700;color:#10b981;text-transform:uppercase;margin-bottom:12px;">Pack Expert</div>
                        <div style="font-size:2rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">9,99€<span style="font-size:1rem;font-weight:400;color:var(--text-muted)">/mois</span></div>
                        <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:16px;">S'abonner — Sans engagement</p>
                        <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:0.875rem;color:var(--text-secondary);">
                            <li style="font-weight:600;color:var(--text-primary);">— <strong>Inscrit dans l'Annuaire</strong></li>
                            <li style="font-weight:600;color:var(--text-primary);">— Badge <strong>Expert Vérifié</strong></li>
                            <li style="font-weight:600;color:var(--text-primary);">— <strong>Podcast & Contenu</strong> co-créés</li>
                            <li>— Accès illimité aux missions</li>
                            <li>— Mise en avant prioritaire</li>
                        </ul>
                        <div id="paypal-authority-expert" style="margin-top:4px; display:${tier === 'authority' ? 'none' : 'block'};"></div>
                        <div id="current-plan-authority" style="background:rgba(16,185,129,0.1);border-radius:8px;padding:10px;text-align:center;font-weight:700;font-size:0.875rem;color:#10b981; display:${tier === 'authority' ? 'block' : 'none'};">Votre plan actuel</div>
                        
                        <button onclick="toggleListing(${isListed})" class="cta-button secondary" style="width:100%; margin-top:16px; border-color:${isListed ? '#ef4444' : '#10b981'}; color:${isListed ? '#ef4444' : '#10b981'}; font-size:0.8rem; height:36px; justify-content:center;">
                            ${isListed ? 'Supprimer mon annonce expert' : 'Republier mon annonce expert'}
                        </button>
                    </div>

                </div>
            </div>
        `;
        if (additional) {
            additional.innerHTML = packsHTML;
            
            // Add Premium Services for Expert if tier matches
            if (tier === 'authority') {
                const expertServicesHTML = `
                    <div style="margin-top: 24px; border: 1px solid #10b981; background: rgba(16, 185, 129, 0.02); padding: 24px; border-radius:16px;">
                        <h3 style="font-size: 1.1rem; font-weight: 800; color: #10b981; margin-bottom: 20px;">Vos Services Premium (Pack Expert)</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-weight: 800; color: #10b981; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px;">PODCAST</div>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">Réservez votre séance d'interview.</p>
                                <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button primary" style="font-size: 0.75rem; background: #10b981; border: none; padding: 8px 12px;">Prendre RDV</a>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-weight: 800; color: #10b981; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px;">COMMUNAUTÉ</div>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">Rejoignez le groupe WhatsApp Privé.</p>
                                <a href="https://chat.whatsapp.com/Fe8LuB5IUa1K8JbP00qOdt" target="_blank" class="cta-button secondary" style="font-size: 0.75rem; border-color: #10b981; color: #10b981; padding: 8px 12px;">Accéder au groupe</a>
                            </div>
                        </div>
                    </div>
                `;
                additional.insertAdjacentHTML('beforeend', expertServicesHTML);
            }
            
            // Re-render PayPal for Expert
            setTimeout(() => {
                if (typeof paypal !== 'undefined' && document.getElementById('paypal-authority-expert') && tier !== 'authority') {
                    paypal.Buttons({
                        style: { layout: 'horizontal', color: 'black', shape: 'rect', label: 'subscribe', height: 40, tagline: false },
                        createSubscription: function (data, actions) {
                            return actions.subscription.create({ 'plan_id': 'P-3DX69524C1114072WNG2AOZQ' });
                        },
                        onApprove: function (data, actions) {
                            handleSubscriptionSuccess(data.subscriptionID, 'authority');
                        }
                    }).render('#paypal-authority-expert');
                }
            }, 100);
        }
    } else if (role === 'entreprise') {
         container.innerHTML = `
            <!-- ZONE DE PILOTAGE ENTREPRISE -->
            <div class="dash-section-pilotage">
                <div class="dash-pilotage-header">
                    <div>
                        <h2 class="success-engine-project-title">PILOTAGE RECRUTEMENT</h2>
                        <p class="success-engine-subtitle">Gérez vos offres et trouvez vos futurs talents.</p>
                    </div>
                </div>
                
                <div class="ecosystem-grid">
                    <div class="dash-card-premium" style="border-left: 4px solid #0284c7;">
                        <div class="dash-card-icon" style="background: rgba(2,132,199,0.1); color: #0284c7;">CAND</div>
                        <div class="card-title">Candidatures Reçues</div>
                        <p class="card-desc">Suivez les dossiers des talents qui ont postulé.</p>
                        <a href="/candidatures.html" class="cta-button primary" style="background: #0284c7; margin-top: auto; justify-content: center;">Voir les candidatures</a>
                    </div>

                    <div class="dash-card-premium">
                        <div class="dash-card-icon" style="background: rgba(2,132,199,0.1); color: #0284c7;">DIR</div>
                        <div class="card-title">Sourcing Talents</div>
                        <p class="card-desc">Parcourez l'annuaire des meilleurs experts locaux.</p>
                        <a href="marketplace/directory" class="cta-button secondary" style="margin-top: auto; justify-content: center;">Trouver un expert</a>
                    </div>

                    <div class="dash-card-premium">
                        <div class="dash-card-icon" style="background: rgba(2,132,199,0.1); color: #0284c7;">MATCH</div>
                        <div class="card-title">Matchmaking</div>
                        <p class="card-desc">Mise en relation automatique avec les profils compatibles.</p>
                        <button onclick="document.getElementById('matchmaking-section').scrollIntoView({behavior:'smooth'})" class="cta-button secondary" style="margin-top: auto; justify-content: center;">Voir mes matchs</button>
                    </div>
                </div>
            </div>

            <!-- ZONE ÉCOSYSTÈME -->
            <div class="dash-section-ecosystem">
                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px;">ÉCOSYSTÈME DOMTOM CONNECT</h3>
                <div class="ecosystem-grid">
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">MSG</div>
                        <div class="card-title">Messagerie</div>
                        <p class="card-desc">Discutez avec vos candidats et partenaires.</p>
                        <a href="messages.html" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Ouvrir</a>
                    </div>
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">TIC</div>
                        <div class="card-title">Mes Billets</div>
                        <p class="card-desc">Vos accès aux événements VIP & Réseautage.</p>
                        <button onclick="showView('mes-billets')" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Voir</button>
                    </div>
                    <div class="dash-card-premium">
                        <div class="dash-card-icon">POD</div>
                        <div class="card-title">Podcast Corporate</div>
                        <p class="card-desc">Préparation de votre interview visibilité.</p>
                        <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button secondary" style="margin-top:auto; justify-content:center;">Réserver</a>
                    </div>
                </div>
            </div>
        `;

        if (additional) {
            const enterprisePacksHTML = `
                <div style="margin-top:40px; border-top: 1px solid var(--gray-200); padding-top: 40px;">
                    <h2 style="font-size:1.5rem;font-weight:800;margin-bottom:6px;color:var(--text-primary);">Votre Pack Entreprise</h2>
                    <p style="color:var(--text-secondary);font-size:0.95rem;margin-bottom:32px;">Propulsez vos offres auprès de l'élite locale.</p>

                    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;align-items:start;">

                        <!-- STARTER -->
                        <div style="background:white;border:1.5px solid var(--gray-200);border-radius:16px;padding:28px;">
                            <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;margin-bottom:12px;">Starter</div>
                            <div style="font-size:2rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">0€</div>
                            <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:16px;">Gratuit — Testez le réseau</p>
                            <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:0.875rem;color:var(--text-secondary);">
                                <li>— 1 publication de mission</li>
                                <li>— Candidatures libres</li>
                                <li>— Accès à la messagerie</li>
                                <li style="color:var(--gray-300);">— Invisible dans l'annuaire</li>
                            </ul>
                            <div id="current-plan-starter" style="background:var(--bg-light);border-radius:8px;padding:10px;text-align:center;font-weight:600;font-size:0.875rem;color:var(--text-muted); display:${tier === 'free' ? 'block' : 'none'};">Votre plan actuel</div>
                        </div>

                        <!-- BUSINESS -->
                        <div style="background:white;border:2px solid #0284c7;border-radius:16px;padding:28px;position:relative;box-shadow:0 8px 24px rgba(2,132,199,0.12);">
                            <div style="position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:#0284c7;color:white;font-size:0.7rem;font-weight:800;padding:4px 14px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;white-space:nowrap;">Populaire : Missions & Visibilité</div>
                            <div style="font-size:0.75rem;font-weight:700;color:#0284c7;text-transform:uppercase;margin-bottom:12px;">Pack Business</div>
                            <div style="font-size:2rem;font-weight:800;color:var(--text-primary);margin-bottom:4px;">29€<span style="font-size:1rem;font-weight:400;color:var(--text-muted)">/mois</span></div>
                            <p style="font-size:0.8rem;font-weight:600;color:var(--text-muted);margin-bottom:16px;">Sourcing & Contenu — Rentable dès le 1er contrat</p>
                            <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:0.875rem;color:var(--text-secondary);">
                                <li style="font-weight:600;color:var(--text-primary);">— <strong>Missions Illimitées</strong></li>
                                <li style="font-weight:600;color:var(--text-primary);">— <strong>Visibilité Annuaire</strong> (Prioritaire)</li>
                                <li style="font-weight:600;color:var(--text-primary);">— 1 <strong>Podcast Corporate</strong> dédié</li>
                                <li>— 2-3 Contenus réseaux sociaux / mois</li>
                                <li>— Sourcing Expert (Accès direct)</li>
                            </ul>
                            <div id="paypal-business-enterprise" style="margin-top:4px; display:${tier === 'business' ? 'none' : 'block'};"></div>
                            <div id="current-plan-business" style="background:rgba(2,132,199,0.1);border-radius:8px;padding:10px;text-align:center;font-weight:700;font-size:0.875rem;color:#0284c7; display:${tier === 'business' ? 'block' : 'none'};">Votre plan actuel</div>

                            <button onclick="toggleListing(${isListed})" class="cta-button secondary" style="width:100%; margin-top:16px; border-color:${isListed ? '#ef4444' : '#0284c7'}; color:${isListed ? '#ef4444' : '#0284c7'}; font-size:0.8rem; height:36px; justify-content:center;">
                                ${isListed ? 'Supprimer mon annonce entreprise' : 'Republier mon annonce entreprise'}
                            </button>
                        </div>

                        <!-- ENTERPRISE -->
                        <div style="background:linear-gradient(160deg,#0f172a 0%,#1e293b 100%);border:1.5px solid var(--gray-700);border-radius:16px;padding:28px;">
                            <div style="font-size:0.75rem;font-weight:700;color:var(--gray-400);text-transform:uppercase;margin-bottom:12px;">Enterprise</div>
                            <div style="font-size:1.8rem;font-weight:800;color:white;margin-bottom:4px;">Sur Devis</div>
                            <p style="font-size:0.8rem;font-weight:600;color:var(--gray-400);margin-bottom:16px;">Solutions Sur Mesure</p>
                            <ul style="list-style:none;padding:0;margin:0 0 24px;display:flex;flex-direction:column;gap:10px;font-size:0.875rem;color:var(--gray-300);">
                                <li style="font-weight:600;color:white;">— Accompagnement Sur Mesure</li>
                                <li>— Sourcing International (Diaspora)</li>
                                <li>— Étude de besoin spécifique</li>
                                <li>— Toute autre demande <strong>sur devis</strong></li>
                            </ul>
                            <a href="mailto:domtomconnect@gmail.com?subject=Demande Pack Enterprise" class="cta-button primary" style="justify-content:center; background:white; color:var(--text-primary);border:1px solid white;">Nous contacter</a>
                        </div>
                    </div>
                </div>
            `;
            additional.innerHTML = enterprisePacksHTML;

            // Premiums for Company
            if (tier === 'business') {
                const companyPremiumsHTML = `
                    <div style="margin-top: 24px; border: 1px solid #0284c7; background: rgba(2, 132, 199, 0.02); padding: 24px; border-radius:16px;">
                        <h3 style="font-size: 1.1rem; font-weight: 800; color: #0284c7; margin-bottom: 20px;">Vos Services Premium (Pack Business)</h3>
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-weight: 800; color: #0284c7; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px;">PODCAST CORP</div>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">Prenez rendez-vous pour préparer votre interview entreprise.</p>
                                <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button secondary" style="font-size: 0.75rem; border-color: #0284c7; color: #0284c7; padding: 8px 12px;">Prendre RDV Briefing</a>
                            </div>
                            <div style="background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-weight: 800; color: #0284c7; font-size: 0.85rem; text-transform: uppercase; margin-bottom: 8px;">RÉSEAUX SOCIAUX</div>
                                <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 16px;">Briefez Loïc sur vos posts mensuels et vos besoins contenu.</p>
                                <a href="https://calendly.com/domtomconnect/30min" target="_blank" class="cta-button secondary" style="font-size: 0.75rem; border-color: #0284c7; color: #0284c7; padding: 8px 12px;">RDV Briefing Contenu</a>
                            </div>
                        </div>
                    </div>
                `;
                additional.insertAdjacentHTML('beforeend', companyPremiumsHTML);
            }

            // Re-render PayPal for Company
            setTimeout(() => {
                if (typeof paypal !== 'undefined' && document.getElementById('paypal-business-enterprise') && tier !== 'business') {
                    paypal.Buttons({
                        style: { layout: 'horizontal', color: 'blue', shape: 'rect', label: 'subscribe', height: 40, tagline: false },
                        createSubscription: function (data, actions) {
                            return actions.subscription.create({ 'plan_id': 'P-6JG84131PK915684CNG3VDSQ' });
                        },
                        onApprove: function (data, actions) {
                            handleSubscriptionSuccess(data.subscriptionID, 'business');
                        }
                    }).render('#paypal-business-enterprise');
                }
            }, 100);

            // Matchmaking Section
            const matchmakingSectionHTML = `
                <div id="matchmaking-section" style="display:none; margin-top:80px; border-top: 1px solid var(--gray-200); padding-top: 60px;">
                    <div style="text-align:center; margin-bottom:40px;">
                        <h2 style="font-size:1.75rem; font-weight:800; margin-bottom:8px; color:var(--text-primary);">MATCHMAKING EXPERTS</h2>
                        <p style="color:var(--text-secondary);">Mise en relation directe avec les meilleurs profils pour vos besoins locaux.</p>
                    </div>
                    <div id="matches-container" class="cards-grid">
                        <!-- Rempli par le JS -->
                    </div>
                </div>
            `;
            additional.insertAdjacentHTML('beforeend', matchmakingSectionHTML);
        }

    } else {
        // --- ZONE DE PILOTAGE PORTEUR DE PROJET (DESIGN ÉPURÉ) ---
        container.innerHTML = `
            <div class="dash-section-pilotage">
                <div class="dash-pilotage-header">
                    <div>
                        <h2 style="font-size:1.5rem; font-weight:900; margin-bottom:4px; color:#0f172a;">PILOTAGE DE MON ÉPOPÉE</h2>
                        <p style="color:#64748b; font-size:0.85rem; font-weight:500;">Cockpit stratégique de votre aventure.</p>
                    </div>
                </div>
                
                <div class="cockpit-card-premium" style="margin-bottom:20px;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="width:36px; height:36px; background:#f1f5f9; color:#0f172a; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:0.75rem;">HUB</div>
                        <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a;">Success Engine</h3>
                    </div>
                    <p style="color:#475569; font-size:0.9rem; margin-bottom:20px; line-height:1.5;">Gérez vos phases de maturité (Stratégie, Arsenal, Boussole...) pour booster votre impact.</p>
                    <a href="#success-engine" class="pilotage-cta-premium" style="display:block; text-align:center; text-decoration:none;">ENTRER DANS LE COCKPIT</a>
                </div>

                <div class="cockpit-card-premium">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:12px;">
                        <div style="width:36px; height:36px; background:#f1f5f9; color:#3b82f6; display:flex; align-items:center; justify-content:center; border-radius:10px; font-weight:900; font-size:0.75rem;">FND</div>
                        <h3 style="margin:0; font-size:1.1rem; font-weight:800; color:#0f172a;">Mes Financements</h3>
                    </div>
                    <div style="display:flex; align-items:baseline; gap:8px; margin-bottom:16px;">
                        <span style="font-size:1.5rem; font-weight:900; color:#3b82f6;">0,00 €</span>
                        <span style="font-size:0.8rem; color:#64748b; font-weight:700;">collectés</span>
                    </div>
                    <a href="#success-engine" class="cta-button secondary" style="width:100%; border-radius:16px; padding:12px; font-weight:800; border:1px solid #e2e8f0; font-size:0.8rem; display:flex; justify-content:center; text-decoration:none;">Détails contributions</a>
                </div>
            </div>

            <!-- ZONE ÉCOSYSTÈME PORTEUR (RESTAURATION UTILITÉ) -->
            <div class="dash-section-ecosystem" style="margin-top:40px;">
                <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 24px; color:#0f172a;">SERVICES & ÉCOSYSTÈME</h3>
                <div class="ecosystem-grid" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(240px, 1fr)); gap:20px;">
                    <div class="dash-card-premium" style="background:white; padding:24px; border-radius:24px; border:1px solid #f1f5f9;">
                        <div style="font-weight: 800; font-size: 0.7rem; color:#64748b; margin-bottom:12px;">TALENTS</div>
                        <h4 style="margin:0 0 8px 0; font-size:1.1rem; font-weight:800;">Annuaire Experts</h4>
                        <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Trouvez les partenaires idéaux pour votre projet.</p>
                        <a href="/marketplace/directory" class="cta-button secondary" style="width:100%; justify-content:center;">Chercher</a>
                    </div>
                    <div class="dash-card-premium" style="background:white; padding:24px; border-radius:24px; border:1px solid #f1f5f9;">
                        <div style="font-weight: 800; font-size: 0.7rem; color:#64748b; margin-bottom:12px;">MISSIONS</div>
                        <h4 style="margin:0 0 8px 0; font-size:1.1rem; font-weight:800;">Appels d'offres</h4>
                        <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Publiez vos besoins et recrutez localement.</p>
                        <a href="/marketplace/jobs" class="cta-button secondary" style="width:100%; justify-content:center;">Publier</a>
                    </div>
                    <div class="dash-card-premium" style="background:white; padding:24px; border-radius:24px; border:1px solid #f1f5f9;">
                        <div style="font-weight: 800; font-size: 0.7rem; color:#64748b; margin-bottom:12px;">RESSOURCES</div>
                        <h4 style="margin:0 0 8px 0; font-size:1.1rem; font-weight:800;">Guides & Blog</h4>
                        <p style="font-size:0.85rem; color:#64748b; margin-bottom:20px;">Apprenez les meilleures stratégies de croissance.</p>
                        <a href="/blog" class="cta-button secondary" style="width:100%; justify-content:center;">Lire</a>
                    </div>
                </div>
            </div>
        `;
    }
}

// --- 3. PROFILE STRENGTH & VISIBILITY ---

function updateProfileStrength(profile) {
    if (!profile) return;
    const isExpert = (profile.role === 'expert' || profile.role === 'prestataire');
    const container = document.getElementById('profile-strength-container');
    if (!container) return;

    if (!isExpert) {
        container.classList.add('hidden-force'); 
        container.style.display = 'none';
        return;
    }
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
            tip.innerHTML = "✅ Profil complet ! Vous remontez en priorité dans l'annuaire.";
            tip.style.color = "#10b981";
        } else {
            tip.innerHTML = `<strong>Conseil :</strong> ${nextAction} pour booster votre visibilité. <a href="profile.html" style="color:#10b981; text-decoration:underline;">Modifier le profil</a>`;
        }
    }
}

function renderVisibilityPreview(profile) {
    if (!profile) return;
    const container = document.getElementById('visibility-preview-container');
    const badge = document.getElementById('visibility-status-badge');
    const slot = document.getElementById('preview-card-slot');
    const prompt = document.getElementById('visibility-upgrade-prompt');
    if (!container || !badge || !slot) return;

    const isExpert = (profile.role === 'expert' || profile.role === 'prestataire');
    const isListed = !!profile.listed;

    if (!isExpert) {
        container.classList.add('hidden-force');
        container.style.display = 'none';
        return;
    }
    container.classList.remove('hidden-force');
    container.style.display = 'block';

    // 1. Badge Status
    if (isListed) {
        badge.innerHTML = `<span class="visibility-badge public">● Publié (Actif)</span>`;
        if (prompt) prompt.style.display = 'none';
    } else {
        badge.innerHTML = `<span class="visibility-badge private">● Privé (Invisible)</span>`;
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
                <p style="margin:0; font-size:0.75rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${profile.title || profile.sector || 'Expert Domtom Connect'}</p>
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
    if (!container) return;

    try {
        const { data: profile } = await _supabase.from('profiles').select('subscription_tier').eq('id', userId).single();
        
        if (!profile || (profile.subscription_tier !== 'business' && profile.subscription_tier !== 'enterprise')) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Activez le Matchmaking</h3>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px;">Le pack Business débloque l'algorithme qui trouve les meilleurs experts pour vos missions.</p>
                    <a href="/#pricing" class="cta-button primary" style="background:#10b981;">Passer au Pack Business</a>
                </div>
            `;
            return;
        }

        const { data: experts } = await _supabase
            .from('profiles')
            .select('*')
            .eq('role', 'expert')
            .eq('listed', true)
            .limit(3);

        if (experts && experts.length > 0) {
            container.innerHTML = experts.map(renderMatchCard).join('');
        } else {
            container.innerHTML = '<p style="color:var(--text-muted);">Aucun match trouvé pour le moment.</p>';
        }
    } catch (err) {
        console.error("Matchmaking error:", err);
    }
}

function renderMatchCard(expert) {
    const name = expert.full_name || 'Expert';
    const initials = name.slice(0, 2).toUpperCase();
    return `
        <div class="dash-card" style="padding: 20px;">
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                <div class="mini-avatar">${initials}</div>
                <div>
                    <div style="font-size:0.95rem; font-weight:800;">${name}</div>
                    <div style="font-size:0.75rem; color:#7c3aed; font-weight:700;">${expert.title || 'Expert Stratégique'}</div>
                </div>
            </div>
            <p style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:16px;">Top match basé sur vos besoins en ${expert.sector || 'Digital'}.</p>
            <a href="messages.html?to=${expert.id}" class="cta-button primary" style="padding:8px; font-size:0.8rem; justify-content:center;">Contacter</a>
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

async function loadMatchmaking(userId) {
    const container = document.getElementById('matches-container');
    const section = document.getElementById('matchmaking-section');
    if (!container) return;

    try {
        const { data: profile } = await _supabase.from('profiles').select('subscription_tier').eq('id', userId).single();
        if (!profile || (profile.subscription_tier !== 'business' && profile.subscription_tier !== 'enterprise')) {
            if (section) section.style.display = 'block';
            container.innerHTML = `
                <div style="grid-column: 1 / -1; background: #f8fafc; border: 2px dashed #e2e8f0; border-radius: 12px; padding: 40px; text-align: center;">
                    <div style="font-size: 2rem; margin-bottom: 16px; color: #64748b; font-weight: 900;">PRIVÉ</div>
                    <h3 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 8px;">Activez le Matchmaking</h3>
                    <p style="color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px;">Le pack Business débloque l'algorithme qui trouve les meilleurs experts pour vos missions en temps réel.</p>
                    <a href="/#pricing" class="cta-button primary" style="background:#10b981; border:none; text-decoration:none; padding:12px 24px; color:white; border-radius:10px; font-weight:700; display:inline-block;">Passer au Pack Business</a>
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

async function loadUserProfileData() {
    try {
        const { data: { user } } = await _supabase.auth.getUser();
        if (!user) return;
        const { data: profile } = await _supabase.from('profiles').select('*').eq('id', user.id).single();
        if (profile) {
            const nameEl = document.getElementById('profile-full-name');
            const emailEl = document.getElementById('display-email');
            const phoneEl = document.getElementById('display-phone');
            const avatarEl = document.getElementById('profile-avatar-img');
            if (nameEl) nameEl.textContent = profile.full_name || 'Utilisateur';
            if (emailEl) emailEl.textContent = user.email;
            if (phoneEl) phoneEl.textContent = profile.phone || 'Non renseigné';
            if (avatarEl && profile.avatar_url) avatarEl.src = profile.avatar_url;
        }
    } catch (err) { console.error(err); }
}

window.showView = showView;
window.initRouting = initRouting;
window.checkSession = checkSession;
window.signOut = signOut;
window.loadUserProfileData = loadUserProfileData;

// Start initialization
document.addEventListener('DOMContentLoaded', async () => {
    await checkSession();
    initRouting();

    // Intercepteur de clics global pour la navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            const viewId = link.getAttribute('href').slice(1);
            if (viewId) {
                console.log("Global Nav Interceptor:", viewId);
                showView(viewId, true); // forceRender = true
            }
        }
    });
});
