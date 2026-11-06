/**
 * QuizDailyModule - Domtom Connect
 * Défi Quotidien Éducatif & Distraction WeChat-style
 * Renforce l'engagement quotidien (DAU) par des micro-défis et astuces de croissance locale.
 */
const QuizDailyModule = {
    QUESTIONS: [
        {
            id: 1,
            q: "Quel est le taux de TVA standard applicable en Martinique, Guadeloupe et Réunion ?",
            options: [
                { text: "20% (comme en France hexagonale)", correct: false },
                { text: "8.5% (régime spécifique outre-mer)", correct: true },
                { text: "0% (exonération totale)", correct: false }
            ],
            tip: "💡 **L'astuce fiscale :** Le taux de TVA est de 8.5% dans ces départements (et 0% en Guyane/Mayotte). Cela vous donne un avantage de trésorerie immédiat pour vos investissements locaux !"
        },
        {
            id: 2,
            q: "Quel dispositif permet à une entreprise de déduire fiscalement une partie de ses investissements productifs en Outre-mer ?",
            options: [
                { text: "Le Crédit d'Impôt Recherche (CIR)", correct: false },
                { text: "La Loi de Défiscalisation Girardin", correct: true },
                { text: "Le statut de Jeune Entreprise Innovante (JEI)", correct: false }
            ],
            tip: "💡 **L'astuce investissement :** Le dispositif Girardin industriel permet de financer une grande partie de vos matériels professionnels grâce à l'apport d'investisseurs tiers. Pensez-y pour vos Roadmaps !"
        },
        {
            id: 3,
            q: "Quelle est la règle d'or pour fixer son prix de prestation en Freelance / Expert ?",
            options: [
                { text: "S'aligner systématiquement sur le moins cher du marché", correct: false },
                { text: "Calculer son TJM (Taux Journalier Moyen) en incluant charges, vacances et temps administratif", correct: true },
                { text: "Facturer uniquement à la tête du client", correct: false }
            ],
            tip: "💡 **L'astuce pro :** En freelance, 1 jour facturé doit couvrir 2 jours de travail réel (le reste étant dédié à l'administration et la recherche de clients). Visez un TJM réaliste dès le départ !"
        }
    ],

    getDailyQuestion: function() {
        const day = new Date().getDate();
        const index = day % this.QUESTIONS.length;
        return this.QUESTIONS[index];
    },

    renderQuizCard: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const question = this.getDailyQuestion();
        const storageKey = `dtc_quiz_answered_${question.id}`;
        const hasAnswered = localStorage.getItem(storageKey);

        if (hasAnswered) {
            const isCorrect = localStorage.getItem(`${storageKey}_correct`) === 'true';
            container.innerHTML = this.renderFeedbackHTML(question, isCorrect);
            return;
        }

        container.innerHTML = `
            <div style="background: linear-gradient(135deg, #0c100e, #1b2420); color: white; border-radius: 24px; padding: 24px; box-shadow: 0 10px 30px rgba(14, 19, 17,0.15); border: 1px solid rgba(255,255,255,0.05); font-family: 'Plus Jakarta Sans', sans-serif;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
                    <span style="background:rgba(16, 185, 129, 0.15); color:#10b981; padding:6px 12px; border-radius:100px; font-size:0.7rem; font-weight:800; text-transform:uppercase; letter-spacing:0.05em;">🧠 Défi Éducatif DTC</span>
                    <span style="font-size:0.8rem; color:#a7b0ac; font-weight:600;">+50 XP</span>
                </div>
                <h3 style="font-size:1.1rem; font-weight:800; line-height:1.4; margin:0 0 16px 0; color:#f6f8f7;">${question.q}</h3>
                <div style="display:flex; flex-direction:column; gap:10px; margin-bottom:20px;">
                    ${question.options.map((opt, idx) => `
                        <label style="display:flex; align-items:center; gap:12px; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); padding:14px; border-radius:12px; cursor:pointer; transition:all 0.2s;">
                            <input type="radio" name="dtc-daily-opt" value="${idx}" style="accent-color:#10b981; width:18px; height:18px;">
                            <span style="font-size:0.85rem; font-weight:600; color:#d4dad7;">${opt.text}</span>
                        </label>
                    `).join('')}
                </div>
                <button onclick="QuizDailyModule.submitAnswer(${question.id}, '${containerId}')" style="width:100%; background:#10b981; color:white; border:none; padding:12px; border-radius:12px; font-weight:800; cursor:pointer; font-family:inherit; transition:background 0.2s;">
                    Soumettre ma réponse
                </button>
            </div>
        `;
    },

    submitAnswer: function(questionId, containerId) {
        const selected = document.querySelector('input[name="dtc-daily-opt"]:checked');
        if (!selected) {
            alert("Veuillez sélectionner une réponse !");
            return;
        }

        const question = this.QUESTIONS.find(q => q.id === questionId);
        const optIdx = parseInt(selected.value);
        const isCorrect = question.options[optIdx].correct;

        const storageKey = `dtc_quiz_answered_${questionId}`;
        localStorage.setItem(storageKey, 'true');
        localStorage.setItem(`${storageKey}_correct`, isCorrect ? 'true' : 'false');

        // Render feedback inside card
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = this.renderFeedbackHTML(question, isCorrect);
        }
    },

    renderFeedbackHTML: function(question, isCorrect) {
        return `
            <div style="background: linear-gradient(135deg, #0c100e, #1b2420); color: white; border-radius: 24px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); font-family: 'Plus Jakarta Sans', sans-serif; animation: fadeIn 0.4s ease-out;">
                <div style="display:flex; align-items:center; gap:12px; margin-bottom:16px;">
                    <div style="width:40px; height:40px; border-radius:50%; background:${isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}; display:flex; align-items:center; justify-content:center; font-size:1.2rem;">
                        ${isCorrect ? '🎉' : '❌'}
                    </div>
                    <div>
                        <h4 style="margin:0; font-size:0.95rem; font-weight:800; color:#f6f8f7;">
                            ${isCorrect ? 'Bonne réponse !' : 'Incorrect...'}
                        </h4>
                        <p style="margin:2px 0 0 0; font-size:0.75rem; color:#a7b0ac; font-weight:600;">Défi du jour complété</p>
                    </div>
                </div>
                
                <div style="background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:16px; border-radius:16px; font-size:0.85rem; line-height:1.5; color:#d4dad7;">
                    ${question.tip.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                </div>

                <div style="margin-top:16px; text-align:center; font-size:0.75rem; color:#717c77; font-weight:600;">
                    Revenez demain pour un nouveau défi local ! 🚀
                </div>
            </div>
        `;
    }
};

window.QuizDailyModule = QuizDailyModule;
