const fs = require('fs');
const files = ['mon-espace.html','dtc.html','premium.html','pilotage.html','vitrine.html','business.html','channel.html','mastermind.html','billetterie.html','messages.html','profile.html'];

const newMenu = `<div class="mobile-menu-links">
            <a href="mon-espace.html#overview" onclick="toggleMobileMenu()"><i class="fas fa-home"></i> Accueil</a>
            <a href="dtc.html" onclick="toggleMobileMenu()"><i class="fas fa-play"></i> DTC</a>
            <a href="pilotage.html" onclick="toggleMobileMenu()"><i class="fas fa-rocket"></i> Mon Epopée</a>
            <a href="vitrine.html" onclick="toggleMobileMenu()"><i class="fas fa-store"></i> Ma Vitrine</a>
            <a href="business.html" onclick="toggleMobileMenu()"><i class="fas fa-handshake"></i> Mon Activité</a>
            <a href="billetterie.html" onclick="toggleMobileMenu()"><i class="fas fa-ticket-alt"></i> Événements</a>
            <a href="mastermind.html" onclick="toggleMobileMenu()"><i class="fas fa-crown"></i> Mastermind</a>
            <a href="premium.html" onclick="toggleMobileMenu()"><i class="fas fa-gem"></i> 1-to-1</a>
            <a href="marketplace/directory.html" onclick="toggleMobileMenu()"><i class="fas fa-compass"></i> Explorer</a>
            <a href="messages.html" onclick="toggleMobileMenu()"><i class="fas fa-comment-dots"></i> Messagerie</a>
            <a href="channel.html" onclick="toggleMobileMenu()"><i class="fas fa-tv"></i> Ma Chaîne</a>
            <a href="profile.html" onclick="toggleMobileMenu()"><i class="fas fa-user-circle"></i> Mon Profil</a>
            <a href="index.html" onclick="toggleMobileMenu()"><i class="fas fa-globe"></i> Plateforme</a>
        </div>`;

files.forEach(f => {
    if(fs.existsSync(f)) {
        let c = fs.readFileSync(f, 'utf8');
        c = c.replace(/<div class="mobile-menu-links">[\s\S]*?<\/div>/, newMenu);
        fs.writeFileSync(f, c);
        console.log('Updated ' + f);
    }
});
