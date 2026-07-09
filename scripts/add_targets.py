import re

with open('d:/DomtomConnect-Website/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

new_section = r'''    <!-- SECTION CIBLES (Porteurs de Projets & Prestataires) -->
    <section class="targets-section" style="padding: 100px 0; background-color: var(--gray-50); border-bottom: 1px solid #e5e7eb;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 60px;">
                <span class="badge emerald" style="margin-bottom: 1.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">1 Plateforme. 2 Ambitions.</span>
                <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: var(--primary-color); margin-bottom: 1.5rem; letter-spacing: -0.03em;">Domtom Connect est fait pour vous.</h2>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px;">
                <!-- Target 1: Porteurs de Projets -->
                <div style="background: white; border-radius: 32px; padding: 48px; border: 1px solid #e5e7eb; box-shadow: 0 10px 30px rgba(0,0,0,0.02); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-8px)'; this.style.boxShadow='0 20px 40px rgba(16, 185, 129, 0.08)';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 10px 30px rgba(0,0,0,0.02)';">
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
                        <div style="width: 64px; height: 64px; background: rgba(16, 185, 129, 0.1); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
                        </div>
                        <h3 style="font-size: 1.8rem; font-weight: 900; color: var(--primary-color); line-height: 1.1;">Je suis un Porteur de Projet</h3>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--gray-600); margin-bottom: 32px; line-height: 1.6;">Passez de l'idée à l'exécution. Structurons votre vision pour convaincre.</p>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px;">
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: var(--gray-700); font-weight: 500;">Intégrez <strong>l'Incubateur & Mastermind</strong> pour scaler.</span>
                        </li>
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: var(--gray-700); font-weight: 500;">Générez votre Business Plan interactif.</span>
                        </li>
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: var(--gray-700); font-weight: 500;">Rencontrez vos futurs associés et investisseurs.</span>
                        </li>
                    </ul>
                </div>

                <!-- Target 2: Prestataires B2B -->
                <div style="background: var(--primary-color); border-radius: 32px; padding: 48px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.2); transition: all 0.3s; position: relative; overflow: hidden;" onmouseover="this.style.transform='translateY(-8px)';" onmouseout="this.style.transform='translateY(0)';">
                    <div style="position: absolute; top: -20%; right: -10%; width: 300px; height: 300px; background: radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%); border-radius: 50%; pointer-events: none;"></div>
                    
                    <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px; position: relative; z-index: 2;">
                        <div style="width: 64px; height: 64px; background: rgba(16, 185, 129, 0.15); border-radius: 20px; display: flex; align-items: center; justify-content: center; color: #10b981;">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                        </div>
                        <h3 style="font-size: 1.8rem; font-weight: 900; color: white; line-height: 1.1;">Je suis un Prestataire B2B</h3>
                    </div>
                    <p style="font-size: 1.1rem; color: rgba(255,255,255,0.7); margin-bottom: 32px; line-height: 1.6; position: relative; z-index: 2;">Monétisez votre expertise. Le réseau travaille pour vous et vous apporte du Deal Flow.</p>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 16px; position: relative; z-index: 2;">
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: rgba(255,255,255,0.9); font-weight: 500;">Créez votre <strong>Vitrine Pro</strong> pour vendre.</span>
                        </li>
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: rgba(255,255,255,0.9); font-weight: 500;">Trouvez de nouveaux clients via l'Annuaire.</span>
                        </li>
                        <li style="display: flex; align-items: flex-start; gap: 12px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="3" style="flex-shrink: 0; margin-top: 2px;"><polyline points="20 6 9 17 4 12"/></svg>
                            <span style="font-size: 1.05rem; color: rgba(255,255,255,0.9); font-weight: 500;">Encaissez via notre <strong>Tiers de Confiance</strong> (100% sécurisé).</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- SECTION HOW IT WORKS -->'''

html = html.replace('<!-- SECTION HOW IT WORKS -->', new_section)

with open('d:/DomtomConnect-Website/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
