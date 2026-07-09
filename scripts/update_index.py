import re

with open('d:/DomtomConnect-Website/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Replace the 3 axes section
old_section = re.compile(r'<!-- SECTION 0 - All-in-One SaaS Leadership -->.*?<div style="text-align: center; margin-top: 60px;">.*?</div>\s*</div>\s*</section>', re.DOTALL)

new_section = r'''<!-- SECTION HOW IT WORKS -->
    <section class="how-it-works bg-white" style="padding: 100px 0; border-bottom: 1px solid #f1f5f9;">
        <div class="container">
            <div style="text-align: center; margin-bottom: 80px;">
                <span class="badge emerald" style="margin-bottom: 1.5rem; background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 8px 16px; border-radius: 100px; font-weight: 800; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.1em;">Le Processus</span>
                <h2 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 900; color: var(--primary-color); margin-bottom: 1.5rem; letter-spacing: -0.03em;">Comment ça marche ?</h2>
                <p style="font-size: 1.25rem; color: var(--gray-500); max-width: 800px; margin: 0 auto; line-height: 1.6;">
                    3 étapes simples pour centraliser votre activité, trouver des clients et encaisser en toute sécurité.
                </p>
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 40px; position: relative;">
                <!-- Step 1 -->
                <div style="text-align: center; padding: 40px; position: relative;">
                    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #10b981;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18M3 9h18"/></svg>
                    </div>
                    <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; color: var(--primary-color);">1. Créez votre Vitrine</h4>
                    <p style="color: var(--gray-500); font-size: 1.1rem; line-height: 1.6;">En 2 minutes, configurez votre profil pro ou publiez votre événement. C'est votre nouveau QG.</p>
                </div>
                <!-- Step 2 -->
                <div style="text-align: center; padding: 40px; position: relative;">
                    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #10b981;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                    </div>
                    <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; color: var(--primary-color);">2. Diffusez vos Offres</h4>
                    <p style="color: var(--gray-500); font-size: 1.1rem; line-height: 1.6;">L'algorithme pousse automatiquement vos services dans le Feed et l'Annuaire auprès des bonnes personnes.</p>
                </div>
                <!-- Step 3 -->
                <div style="text-align: center; padding: 40px; position: relative;">
                    <div style="width: 80px; height: 80px; background: rgba(16, 185, 129, 0.1); border-radius: 24px; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; color: #10b981;">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                    </div>
                    <h4 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 16px; color: var(--primary-color);">3. Encaissez Sécurisé</h4>
                    <p style="color: var(--gray-500); font-size: 1.1rem; line-height: 1.6;">Ne courez plus après l'argent. Devis, acomptes, et factures : notre Tiers de Confiance gère tout pour vous.</p>
                </div>
            </div>
        </div>
    </section>'''

html = old_section.sub(new_section, html)

# Replace the FAQ list
old_faq = re.compile(r'<div class="faq-list" style="max-width: 800px; margin: 0 auto;">.*?</div>\s*</div>\s*</section>', re.DOTALL)

new_faq = r'''<div class="faq-list" style="max-width: 800px; margin: 0 auto;">
                  <div class="faq-item" style="border-bottom: 1px solid var(--gray-100); padding: 24px 0;">
                      <div class="faq-question" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                          <h3 style="font-size: 1.125rem; font-weight: 700;">À qui s'adresse ce SaaS ?</h3>
                          <span style="font-size: 1.5rem; font-weight: 300;">+</span>
                      </div>
                      <p style="margin-top: 12px; color: var(--text-secondary); font-size: 0.95rem;">La plateforme est conçue pour les <strong>freelances, agences, et organisateurs d'événements</strong> de la diaspora et des Outre-Mer qui souhaitent trouver des clients et sécuriser leurs contrats.</p>
                  </div>
                  <div class="faq-item" style="border-bottom: 1px solid var(--gray-100); padding: 24px 0;">
                      <div class="faq-question" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                          <h3 style="font-size: 1.125rem; font-weight: 700;">Combien coûte l'inscription ?</h3>
                          <span style="font-size: 1.5rem; font-weight: 300;">+</span>
                      </div>
                      <p style="margin-top: 12px; color: var(--text-secondary); font-size: 0.95rem;">Créer un compte, explorer le réseau et utiliser le Feed est <strong>100% gratuit</strong>. Nous ne prenons une commission transparente que lorsque vous vendez un service ou un billet via la plateforme.</p>
                  </div>
                  <div class="faq-item" style="padding: 24px 0;">
                      <div class="faq-question" style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;">
                          <h3 style="font-size: 1.125rem; font-weight: 700;">Comment fonctionne le paiement sécurisé ?</h3>
                          <span style="font-size: 1.5rem; font-weight: 300;">+</span>
                      </div>
                      <p style="margin-top: 12px; color: var(--text-secondary); font-size: 0.95rem;">Via notre Tiers de Confiance (système d'Escrow). Les fonds de votre client sont bloqués dès l'acceptation du devis, vous garantissant d'être payé à la fin de votre mission. Finis les impayés.</p>
                  </div>
              </div>
          </div>
      </section>'''

html = old_faq.sub(new_faq, html)

with open('d:/DomtomConnect-Website/index.html', 'w', encoding='utf-8') as f:
    f.write(html)
