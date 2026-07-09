const fs = require('fs');

const modulePath = 'd:/DomtomConnect-Website/assets/js/modules/mastermind-salon.module.js';
let moduleContent = fs.readFileSync(modulePath, 'utf8');

// Replace init with a highly debuggable version
const newInit = `    init: async function() {
        console.log("MastermindSalonModule.init() called");
        try {
            const db = window._supabase;
            if (!db) throw new Error("Supabase is missing");

            this.currentProfile = window.App.state.profile;
            if (!this.currentProfile) throw new Error("Profile is missing");

            console.log("Ensuring conversation exists...");
            await this.ensureConversationExists(db);

            console.log("Loading messages...");
            await this.loadMessages(db);

            console.log("Subscribing realtime...");
            this.subscribeRealtime(db);

            console.log("Setting up listeners...");
            const input = document.getElementById('mastermind-chat-input');
            const sendBtn = document.getElementById('mastermind-send-btn');
            if (input && sendBtn) {
                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.sendMessage(db, input.value);
                        input.value = '';
                    }
                });
                sendBtn.addEventListener('click', () => {
                    this.sendMessage(db, input.value);
                    input.value = '';
                });
            } else {
                throw new Error("Input or SendBtn not found in DOM");
            }
            console.log("MastermindSalonModule.init() success");
        } catch (err) {
            console.error("MastermindSalonModule ERROR:", err);
            alert("Erreur Mastermind : " + err.message);
        }
    },`;

moduleContent = moduleContent.replace(/init:\s*async\s*function\(\)\s*\{[\s\S]*?(?=ensureConversationExists:)/, newInit + '\n\n    ');
fs.writeFileSync(modulePath, moduleContent, 'utf8');

// Bust cache again
const htmlPath = 'd:/DomtomConnect-Website/mon-espace.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');
htmlContent = htmlContent.replace(/\?v=11\.8/g, '?v=11.9');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');

console.log("Debug added, cache busted to 11.9");
