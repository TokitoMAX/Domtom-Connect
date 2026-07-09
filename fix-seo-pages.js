const fs = require('fs');
const path = require('path');

const files = [
    'solutions/success-engine.html',
    'solutions/tiers-de-confiance.html',
    'solutions/mastermind.html',
    'solutions/annuaire-talents.html'
];

const newFooter = 
    <!-- MEGA FOOTER SEO -->
    <footer class="footer" style="background: #020617; border-top: 1px solid rgba(255,255,255,0.05); padding: 80px 0 40px; color: #94a3b8;">
        <div class="container">
            <div style="display: flex; flex-wrap: wrap; gap: 48px; margin-bottom: 64px;">
                <!-- Colonne 1 : Brand & Tagline -->
                <div style="flex: 1 1 300px; min-width: 250px;">
                    <a href="../index.html" style="display: flex; align-items: center; gap: 12px; text-decoration: none; margin-bottom: 24px;">
                        <img src="../assets/images/logo-domtomconnect.png" alt="Domtom Connect" style="width: 40px; height: 40px;">
                        <span style="font-size: 1.25rem; font-weight: 800; color: white; letter-spacing: -0.02em;">Domtom Connect</span>
                    </a>
                    <p style="font-size: 0.95rem; line-height: 1.6; color: #64748b; max-width: 320px; font-weight: 500;">
                        Le réseau des entrepreneurs de l'Outre-Mer et de la Diaspora. Sécurisez et accélérez vos ambitions avec les meilleurs experts.
                    </p>
                </div>

                <!-- Colonne 2 : L'Écosystème -->
                <div style="flex: 1 1 150px;">
                    <h4 style="font-size: 0.85rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">L'Écosystème</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                        <li><a href="../blog/index.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Blog & Podcasts</a></li>
                        <li><a href="../marketplace/directory.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Annuaire des Talents</a></li>
                        <li><a href="../marketplace/companies.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Réseau Entreprises</a></li>
                        <li><a href="../marketplace/evenements.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Événements & VIP</a></li>
                    </ul>
                </div>

                <!-- Colonne 3 : Anciennes Offres & Solutions -->
                <div style="flex: 1 1 150px;">
                    <h4 style="font-size: 0.85rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Nos Solutions</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                        <li><a href="success-engine.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Le Success Engine</a></li>
                        <li><a href="tiers-de-confiance.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Tiers de Confiance</a></li>
                        <li><a href="annuaire-talents.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">L'Annuaire & Vitrines</a></li>
                        <li><a href="mastermind.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Le Club Mastermind</a></li>
                    </ul>
                </div>

                <!-- Colonne 4 : Aide & Légal -->
                <div style="flex: 1 1 150px;">
                    <h4 style="font-size: 0.85rem; font-weight: 800; color: white; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 24px;">Ressources</h4>
                    <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 12px;">
                        <li><a href="../a-propos.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">À propos</a></li>
                        <li><a href="../faq/index.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">FAQ</a></li>
                        <li><a href="../support.html" style="color: #94a3b8; text-decoration: none; font-size: 0.9rem;">Assistance & Contact</a></li>
                    </ul>
                </div>
            </div>
            
            <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 32px; text-align: center;">
                <p style="font-size: 0.8rem; color: #4b5563; font-weight: 500;">&copy; 2026 Domtom Connect. Tous droits réservés.</p>
            </div>
        </div>
    </footer>
;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    
    // Fix hero-title color
    content = content.replace(/\.hero-title\s*\{/g, '.hero-title { color: white !important; ');
    
    // Replace old footer completely
    content = content.replace(/<!-- MEGA FOOTER SEO[\s\S]*?<\/footer>/, newFooter.trim());
    
    fs.writeFileSync(f, content);
    console.log('Updated ' + f);
});
