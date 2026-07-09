import re

with open('d:/DomtomConnect-Website/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Replace the entire Targets Section + How It Works section
old_sections_pattern = re.compile(r'<!-- SECTION CIBLES \(Porteurs de Projets & Prestataires\) -->.*?</section>\s*<!-- SECTION HOW IT WORKS -->.*?</section>', re.DOTALL)

new_toolbox_section = r'''<!-- SECTION LE COUTEAU SUISSE (Simplification Grand Public) -->
    <section class="toolbox-section" style="padding: 100px 0; background-color: white; border-bottom: 1px solid #e5e7eb;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 60px;">
                <span class="badge emerald" style="margin-bottom: 1.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">Le Couteau Suisse de l'Outre-Mer</span>
                <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: var(--primary-color); margin-bottom: 1.5rem; letter-spacing: -0.03em;">Domtom Connect, c'est pour qui ?</h2>
                <p style="font-size: 1.25rem; color: var(--gray-600); max-width: 800px; margin: 0 auto; line-height: 1.6;">
                    Que vous cherchiez à vendre, à apprendre ou juste à regarder, on a réuni tous les outils dans un seul et même endroit.
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px;">
                
                <!-- Use Case 1 -->
                <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; text-align: center; transition: 0.3s;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)';">
                    <div style="width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin-bottom: 8px;">Tu veux vendre ?</h3>
                    <p style="font-size: 1rem; color: var(--gray-600); margin-bottom: 16px;">Crée ta <strong>Vitrine Pro</strong> pour trouver des clients.</p>
                    <span style="display: inline-block; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">100% Gratuit</span>
                </div>

                <!-- Use Case 2 -->
                <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; text-align: center; transition: 0.3s;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)';">
                    <div style="width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin-bottom: 8px;">Tu as une idée ?</h3>
                    <p style="font-size: 1rem; color: var(--gray-600); margin-bottom: 16px;">Rejoins notre <strong>Incubateur</strong> pour être accompagné.</p>
                    <span style="display: inline-block; padding: 6px 12px; background: rgba(245, 158, 11, 0.1); color: #f59e0b; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">Sur Candidature</span>
                </div>

                <!-- Use Case 3 -->
                <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; text-align: center; transition: 0.3s;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)';">
                    <div style="width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin-bottom: 8px;">Tu organises ?</h3>
                    <p style="font-size: 1rem; color: var(--gray-600); margin-bottom: 16px;">Gère ta <strong>Billetterie</strong> d'événement facilement.</p>
                    <span style="display: inline-block; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">100% Gratuit</span>
                </div>

                <!-- Use Case 4 -->
                <div style="background: #f8fafc; border-radius: 24px; padding: 32px; border: 1px solid #e2e8f0; text-align: center; transition: 0.3s;" onmouseover="this.style.borderColor='#10b981'; this.style.transform='translateY(-5px)';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.transform='translateY(0)';">
                    <div style="width: 56px; height: 56px; background: white; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #10b981; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                    <h3 style="font-size: 1.25rem; font-weight: 800; color: var(--primary-color); margin-bottom: 8px;">Tu veux explorer ?</h3>
                    <p style="font-size: 1rem; color: var(--gray-600); margin-bottom: 16px;">Découvre le <strong>Feed (Réseau Social)</strong> et réseaute.</p>
                    <span style="display: inline-block; padding: 6px 12px; background: rgba(16, 185, 129, 0.1); color: #10b981; border-radius: 8px; font-size: 0.85rem; font-weight: 700;">100% Gratuit</span>
                </div>

            </div>
        </div>
    </section>'''

html = old_sections_pattern.sub(new_toolbox_section, html)

# 2. Update the Incubator Bento Card to include pricing and details
old_incubator_pattern = re.compile(r'<!-- Bloc 4: Incubateur \(Large\) -->.*?</div>', re.DOTALL)

new_incubator_card = r'''<!-- Bloc 4: Incubateur (Large) -->
                <div class="bento-card bento-large" onmouseover="this.style.borderColor='rgba(16, 185, 129, 0.3)'" onmouseout="this.style.borderColor='rgba(255,255,255,0.05)'">
                    <div style="width: 56px; height: 56px; background: rgba(16, 185, 129, 0.05); border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; color: #10b981;">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                    </div>
                    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 10px;">
                        <h3 style="color: white; font-size: 1.6rem; font-weight: 900; letter-spacing: -0.02em;">L'Incubateur & Accompagnement</h3>
                        <span style="background: rgba(245, 158, 11, 0.15); color: #fbd38d; padding: 4px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; border: 1px solid rgba(245, 158, 11, 0.3);">Programme Premium</span>
                    </div>
                    <p style="color: rgba(255,255,255,0.7); font-size: 1.05rem; line-height: 1.6; margin-bottom: 20px;">
                        Vous bloquez sur votre idée ? Nos experts vous accompagnent en <strong>1-to-1</strong> pour structurer votre business, générer votre Business Plan, et trouver des financements. L'accès se fait sur candidature et sur devis.
                    </p>
                    <a href="https://tally.so/r/nrlkE2" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 0.95rem; transition: 0.2s;" onmouseover="this.style.background='rgba(255,255,255,0.1)'" onmouseout="this.style.background='rgba(255,255,255,0.05)'">
                        Déposer ma candidature
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                    </a>
                </div>'''

# Careful here, we need to make sure we only replace the specific div.
# Because the `.*?</div` might be greedy or not greedy enough, I'll use a more precise string replacement.

incubator_start_str = "<!-- Bloc 4: Incubateur (Large) -->"
explorateurs_start_str = "<!-- Bloc 5: Explorateurs (Full Width) -->"

start_idx = html.find(incubator_start_str)
end_idx = html.find(explorateurs_start_str)

if start_idx != -1 and end_idx != -1:
    html = html[:start_idx] + new_incubator_card + "\n\n                " + html[end_idx:]
else:
    print("Could not find Incubateur block indices.")

with open('d:/DomtomConnect-Website/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
