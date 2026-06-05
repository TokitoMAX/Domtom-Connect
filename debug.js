const fs = require('fs');

const modulePath = 'd:/DomtomConnect-Website/assets/js/modules/mastermind-salon.module.js';
let moduleContent = fs.readFileSync(modulePath, 'utf8');

// Wrap init in try-catch and add console.log
moduleContent = moduleContent.replace(
    'init: async function() {',
    `init: async function() {
        console.log("MastermindSalonModule init started");
        try {`
);

moduleContent = moduleContent.replace(
    `            sendBtn.addEventListener('click', () => {
                this.sendMessage(db, input.value);
                input.value = '';
            });
        }
    },`,
    `            sendBtn.addEventListener('click', () => {
                this.sendMessage(db, input.value);
                input.value = '';
            });
        }
        console.log("MastermindSalonModule init completed successfully");
        } catch (e) {
            console.error("MastermindSalonModule init error: ", e);
            alert("Erreur d'initialisation du chat : " + e.message);
        }
    },`
);

fs.writeFileSync(modulePath, moduleContent, 'utf8');
console.log('Module updated');
