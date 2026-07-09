const fs = require('fs');

const appJsPath = 'd:/DomtomConnect-Website/assets/js/app.js';
let content = fs.readFileSync(appJsPath, 'utf8');

// 1. Replace the `viewId === 'mastermind-salon'` block with the clean UI
const salonStartIdx = content.indexOf(`if (viewId === 'mastermind-salon') {`);
const mastermindIdx = content.indexOf(`if (viewId === 'mastermind') {`);

if (salonStartIdx !== -1 && mastermindIdx !== -1) {
    const cleanSalonUI = `
        if (viewId === 'mastermind-salon') {
            if (!targetView) {
                targetView = document.createElement('div');
                targetView.id = targetViewId;
                targetView.className = 'view-section';
                document.querySelector('.content-wrapper').appendChild(targetView);
            }
            targetView.style.display = 'block';
            targetView.innerHTML = \`
                <div style="display:flex; height:100%; min-height: calc(100vh - 80px); width:100%; max-width: 900px; margin: 0 auto; padding: 24px; box-sizing: border-box; flex-direction:column; font-family:'Inter', sans-serif;">
                    
                    <div style="background: white; border-radius: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; overflow: hidden; height: 100%; border: 1px solid #e2e8f0;">
                        <!-- Top Header -->
                        <div style="padding:16px 24px; background:linear-gradient(135deg, #0f172a, #1e293b); color: white; display:flex; align-items:center; justify-content:space-between; z-index:10;">
                            <div style="display:flex; align-items:center; gap:16px;">
                                <div style="width:48px; height:48px; background:rgba(255,255,255,0.1); color:#10b981; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem;">👑</div>
                                <div>
                                    <div style="font-weight:800; font-size:1.2rem; letter-spacing: -0.02em;">Salon de Discussion Privé</div>
                                    <div style="font-size:0.85rem; color:rgba(255,255,255,0.7); font-weight: 500;">Échanges exclusifs entre membres du Club</div>
                                </div>
                            </div>
                            <button onclick="window.Router.navigate('#mastermind')" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.9rem; transition: background 0.2s;"><i class="fas fa-arrow-left"></i> Retour</button>
                        </div>
                        
                        <!-- Chat Area -->
                        <div id="mastermind-chat-thread" style="flex:1; padding:24px; overflow-y:auto; display:flex; flex-direction:column; gap:12px; background-color: #f8fafc;">
                        </div>

                        <!-- Input Area -->
                        <div style="padding:16px 24px; background:white; border-top:1px solid #e2e8f0; display:flex; align-items:center; gap:16px;">
                            <div style="flex:1; background:#f1f5f9; border-radius:12px; padding:12px 20px; display:flex; align-items:center;">
                                <input type="text" id="mastermind-chat-input" placeholder="Taper votre message au groupe..." style="width:100%; border:none; outline:none; background:transparent; font-size:1rem; font-family:'Inter', sans-serif; color:#0f172a;">
                            </div>
                            <button id="mastermind-send-btn" style="background:#10b981; color:white; border:none; width:48px; height:48px; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.2rem; cursor:pointer; box-shadow: 0 4px 12px rgba(16,185,129,0.3); transition: transform 0.2s;"><i class="fas fa-paper-plane"></i></button>
                        </div>
                    </div>
                </div>
            \`;
            if (window.MastermindSalonModule) {
                window.MastermindSalonModule.init();
            }
            return;
        }

        `;
    content = content.substring(0, salonStartIdx) + cleanSalonUI + content.substring(mastermindIdx);
}

// 2. Rewrite the mastermind block to include the correct card and REMOVE afterworks
const oldGridStart = content.indexOf(`<!-- 2. MAIN GRID -->`);
const oldGridEnd = content.indexOf(`App.loadRealMastermindContent();`);

if (oldGridStart !== -1 && oldGridEnd !== -1) {
    const newGrid = `
                            <!-- 2. MAIN GRID (SIMPLIFIED) -->
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                                <!-- Accès Canal Privé Interne -->
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-comments"></i></div>
                                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Salon de Discussion Privé 👑</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Rejoignez le salon de discussion ultra-privé réservé aux membres pour échanger au quotidien directement sur la plateforme.</p>
                                    <button onclick="window.Router.navigate('#mastermind-salon')" style="width: 100%; padding: 14px; background: linear-gradient(135deg, #0f172a, #1e293b); color: white; border: none; border-radius: 12px; font-weight: 900; cursor: pointer; font-size:0.95rem; display:inline-flex; align-items:center; justify-content:center; gap:8px;"><i class="fas fa-sign-in-alt"></i> Accéder au Salon</button>
                                </div>

                                <!-- Sessions Co-développement -->
                                <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                    <div style="width: 48px; height: 48px; background: #f0fdf4; color: #10b981; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; margin-bottom: 20px;"><i class="fas fa-video"></i></div>
                                    <h3 style="font-size: 1.25rem; font-weight: 900; color: #0f172a; margin: 0 0 8px 0;">Sessions Co-développement</h3>
                                    <p style="color: #64748b; font-size: 0.9rem; line-height: 1.5; margin: 0 0 24px 0;">Visios mensuelles de co-développement pour débloquer vos challenges stratégiques et opérationnels.</p>
                                    <div style="width: 100%; padding: 14px; background: #f0fdf4; color: #10b981; border-radius: 12px; font-weight: 700; text-align:center; font-size:0.9rem;">📅 Prochain calendrier en cours de planification</div>
                                </div>
                            </div>

                            <!-- 3. REPLAYS LIBRARY -->
                            <div style="background: white; border: 1.5px solid #e2e8f0; border-radius: 24px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.02);">
                                <h3 style="font-size: 1.35rem; font-weight: 900; color: #0f172a; margin: 0 0 24px 0; font-family: 'Plus Jakarta Sans', sans-serif;">🎥 Bibliothèque de Replays Masterclass VIP</h3>
                                <div id="real-replays-list" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
                                    <div style="text-align: center; padding: 20px; color: #64748b; font-weight: 600; grid-column: 1 / -1;">Chargement des replays...</div>
                                </div>
                            </div>
                        </div>
                    \`;
                    `;
    content = content.substring(0, oldGridStart) + newGrid + content.substring(oldGridEnd);
}

fs.writeFileSync(appJsPath, content, 'utf8');
console.log('App.js rewritten successfully');
