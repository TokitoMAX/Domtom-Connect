const fs = require('fs');
const files = ['billetterie.html', 'business.html', 'channel.html', 'mastermind.html', 'messages.html', 'mon-espace.html', 'pilotage.html', 'premium.html', 'profile.html', 'vitrine.html'];
const newBanner = `                    <div id="moments-feed-wrapper" style="margin-top: 20px; width: 100%; max-width: 800px; margin-left: auto; margin-right: auto; padding: 0 clamp(16px, 4vw, 40px); box-sizing: border-box; overflow-x: hidden;">
                        <div style="margin-bottom: 30px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-radius: 24px; padding: clamp(24px, 5vw, 36px); color: white; position: relative; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(15, 23, 42, 0.3); border: 1px solid rgba(255,255,255,0.05);">
                            <!-- Ambient Glows -->
                            <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                            <div style="position: absolute; bottom: -50px; left: -50px; width: 200px; height: 200px; background: radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%); border-radius: 50%;"></div>
                            
                            <div style="position: relative; z-index: 1; display: flex; flex-direction: column; gap: 6px;">
                                <div style="display: flex; align-items: center; gap: 16px;">
                                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); width: 52px; height: 52px; border-radius: 14px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 16px rgba(16, 185, 129, 0.3); flex-shrink: 0;">
                                        <i class="fas fa-bolt" style="color: white; font-size: 1.4rem;"></i>
                                    </div>
                                    <h2 style="font-size: clamp(1.8rem, 5vw, 2.6rem); font-weight: 950; color: white; letter-spacing: -0.04em; margin: 0; font-family: 'Plus Jakarta Sans', sans-serif; line-height: 1;">
                                        DTC Feed
                                    </h2>
                                </div>
                                <p style="margin: 0; color: #94a3b8; font-size: clamp(0.9rem, 2vw, 1.05rem); font-weight: 500; padding-left: 68px; line-height: 1.4;">Le réseau social 100% Domtom Connect pour partager et découvrir. Connectez-vous, partagez, innovez.</p>
                            </div>
                        </div>
                        <div id="dtc-moments-feed-mount-overview"></div>
                    </div>`;

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    const regex = /<div id="moments-feed-wrapper"[^>]*>[\s\S]*?<div id="dtc-moments-feed-mount-overview"><\/div>\s*<\/div>/m;
    if (regex.test(content)) {
        fs.writeFileSync(f, content.replace(regex, newBanner));
        console.log('Patched ' + f);
    } else {
        console.log('Failed ' + f);
    }
});
