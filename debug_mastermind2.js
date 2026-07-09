const fs = require('fs');

const modulePath = 'd:/DomtomConnect-Website/assets/js/modules/mastermind-salon.module.js';
let moduleContent = fs.readFileSync(modulePath, 'utf8');

const newEnsure = `    ensureConversationExists: async function(db) {
        // Just try to fetch it, if not, create it
        const { data } = await db.from('conversations').select('id').eq('id', this.conversationId).maybeSingle();
        if (!data) {
            const res = await db.from('conversations').insert({
                id: this.conversationId,
                title: 'Salon Mastermind DTC',
                updated_at: new Date().toISOString()
            });
            if (res.error) {
                console.error("Mastermind: Error creating conversation:", res.error);
                alert("Erreur de création du salon : " + res.error.message);
                return;
            }
        }

        // Add user as participant if not already
        const { data: part } = await db.from('conversation_participants')
            .select('user_id')
            .eq('conversation_id', this.conversationId)
            .eq('user_id', this.currentProfile.id)
            .maybeSingle();

        if (!part) {
            const resPart = await db.from('conversation_participants').insert({
                conversation_id: this.conversationId,
                user_id: this.currentProfile.id,
                lead_status: 'Actif'
            });
            if (resPart.error) {
                console.error("Mastermind: Error adding participant:", resPart.error);
                alert("Erreur d'ajout au salon : " + resPart.error.message);
                return;
            }
        }
    },`;

moduleContent = moduleContent.replace(/ensureConversationExists:\s*async\s*function\(\w+\)\s*\{[\s\S]*?(?=loadMessages:)/, newEnsure + '\n\n    ');
fs.writeFileSync(modulePath, moduleContent, 'utf8');

// Also add error alert to sendMessage
const newSend = `    sendMessage: async function(db, content) {
        if (!content || content.trim() === '') return;
        
        const newMsg = {
            conversation_id: this.conversationId,
            sender_id: this.currentProfile.id,
            content: content.trim()
        };

        const res = await db.from('messages').insert([newMsg]);
        if (res.error) {
            console.error("Error sending message:", res.error);
            alert("Erreur d'envoi du message : " + res.error.message);
        }
    },`;

moduleContent = moduleContent.replace(/sendMessage:\s*async\s*function\(\w+,\s*\w+\)\s*\{[\s\S]*?(?=subscribeRealtime:)/, newSend + '\n\n    ');
fs.writeFileSync(modulePath, moduleContent, 'utf8');

// Bump cache to 11.12
const htmlPath = 'd:/DomtomConnect-Website/mon-espace.html';
let htmlContent = fs.readFileSync(htmlPath, 'utf8');
htmlContent = htmlContent.replace(/\?v=11\.11/g, '?v=11.12');
fs.writeFileSync(htmlPath, htmlContent, 'utf8');
