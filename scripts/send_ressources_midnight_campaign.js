/**
 * send_ressources_midnight_campaign.js
 * 
 * Envoi d'un mail simple, 100% authentique et épuré (style email classique tapé à la main).
 * Zéro tableau graphique, zéro encadré, zéro couleur de fond, zéro emoji.
 * 
 * USAGE :
 *   Test à blanc (sans envoi) :
 *     node scripts/send_ressources_midnight_campaign.js --dry-run
 * 
 *   Envoi réel :
 *     node scripts/send_ressources_midnight_campaign.js
 */

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL         = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscHpteGRkZ2RqanRycGJ0a3NkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA4NjUxMiwiZXhwIjoyMDg4NjYyNTEyfQ.xGl8NpyKoIDJHtVhdzD1RJ74bKAe0QJTnKlBXDd5DdE';
const RESEND_API_KEY       = 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7';
const SENDER_EMAIL         = 'Domtom Connect <contact@domtomconnect.com>';
const SUBJECT              = 'Les 3 ressources disponibles sur Domtom Connect';

const isDryRun = process.argv.includes('--dry-run');

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Format texte brut naturel
function generatePlainText(firstName) {
  const greeting = (firstName && firstName.trim() !== '') ? `Bonjour ${firstName},` : 'Bonjour,';

  return `${greeting}

Pour faire suite aux nouveautes sur la plateforme, je voulais vous resumer simplement les 3 ressources que nous avons mises en place et a quoi elles servent concretement :

1. Le Diagnostic gratuit
Un questionnaire rapide en ligne pour faire le point sur votre projet et identifier vos priorites actuelles.
Lien : https://domtom-connect.com/anamnese.html

2. Le Livre Tome 1 (5 euros)
"Les Fondamentaux de l'Entrepreneur - De l'Idee au Terrain sans Excuse". 41 pages au format PDF et EPUB pour structurer son offre et aller chercher ses premiers clients. Vous pouvez lire le premier chapitre gratuitement pour voir si le style vous convient.
Lire le chapitre 1 : https://domtom-connect.com/chapitre1-lecture.html
Voir le livre : https://domtom-connect.com/boutique.html

3. L'E-book interactif (27 euros)
C'est une version outil en ligne avec carnet de bord, simulateur de rentabilite et generation d'une feuille de route personnalisee sur 30 jours.
Lien : https://domtom-connect.com/guide-entrepreneur.html

Vous pouvez piocher dedans selon vos besoins du moment.

Si vous avez des questions sur l'un de ces formats ou sur votre projet, vous pouvez simplement repondre a ce mail.

Bonne soiree,
Domtom Connect`;
}

// Format HTML épuré : aucun conteneur, aucun carré, aucune couleur, police email par défaut
function generateSimpleHtml(firstName) {
  const greeting = (firstName && firstName.trim() !== '') ? `Bonjour ${firstName},` : 'Bonjour,';

  return `<div style="font-family: Arial, Helvetica, sans-serif; font-size: 15px; color: #111111; line-height: 1.6;">
  <p>${greeting}</p>

  <p>Pour faire suite aux nouveautés sur la plateforme, je voulais vous résumer simplement les 3 ressources que nous avons mises en place et à quoi elles servent concrètement :</p>

  <p>
    <strong>1. Le Diagnostic gratuit</strong><br>
    Un questionnaire rapide en ligne pour faire le point sur votre projet et identifier vos priorités actuelles.<br>
    Lien : <a href="https://domtom-connect.com/anamnese.html" style="color: #0066cc;">https://domtom-connect.com/anamnese.html</a>
  </p>

  <p>
    <strong>2. Le Livre Tome 1 (5 €)</strong><br>
    « Les Fondamentaux de l'Entrepreneur — De l'Idée au Terrain sans Excuse ». 41 pages au format PDF et EPUB pour structurer son offre et aller chercher ses premiers clients. Vous pouvez lire le premier chapitre gratuitement pour voir si le style vous convient.<br>
    Lire le chapitre 1 : <a href="https://domtom-connect.com/chapitre1-lecture.html" style="color: #0066cc;">https://domtom-connect.com/chapitre1-lecture.html</a><br>
    Voir le livre : <a href="https://domtom-connect.com/boutique.html" style="color: #0066cc;">https://domtom-connect.com/boutique.html</a>
  </p>

  <p>
    <strong>3. L'E-book interactif (27 €)</strong><br>
    C'est une version outil en ligne avec carnet de bord, simulateur de rentabilité et génération d'une feuille de route personnalisée sur 30 jours.<br>
    Lien : <a href="https://domtom-connect.com/guide-entrepreneur.html" style="color: #0066cc;">https://domtom-connect.com/guide-entrepreneur.html</a>
  </p>

  <p>Vous pouvez piocher dedans selon vos besoins du moment.</p>

  <p>Si vous avez des questions sur l'un de ces formats ou sur votre projet, vous pouvez simplement répondre à ce mail.</p>

  <p>Bonne soirée,<br>Domtom Connect</p>
</div>`;
}

async function fetchRecipients() {
  const { data: authData, error: authError } = await supabaseAdmin.auth.admin.listUsers({
    page: 1,
    perPage: 1000
  });

  if (authError) {
    throw new Error('Erreur auth.admin.listUsers : ' + authError.message);
  }

  const confirmedUsers = (authData.users || []).filter(u => u.email && u.email_confirmed_at);

  const { data: profiles } = await supabaseAdmin
    .from('profiles')
    .select('id, first_name, full_name');

  const profileMap = new Map();
  if (profiles) {
    for (const p of profiles) {
      profileMap.set(p.id, p);
    }
  }

  const recipients = confirmedUsers.map(u => {
    const prof = profileMap.get(u.id);
    let firstName = '';
    if (prof) {
      if (prof.first_name) {
        firstName = prof.first_name;
      } else if (prof.full_name) {
        firstName = prof.full_name.split(' ')[0];
      }
    }
    return {
      email: u.email.trim().toLowerCase(),
      firstName: firstName ? firstName.trim() : ''
    };
  });

  const unique = [];
  const seen = new Set();
  for (const r of recipients) {
    if (!seen.has(r.email)) {
      seen.add(r.email);
      unique.push(r);
    }
  }

  return unique;
}

async function run() {
  console.log('--- CAMPAGNE EMAIL CLASSIQUE (STYLE FAIT MAIN) ---');
  console.log('Mode :', isDryRun ? 'DRY-RUN (aucun envoi)' : 'ENVOI REEL');

  const recipients = await fetchRecipients();
  console.log(`Destinataires trouves : ${recipients.length}`);

  if (isDryRun) {
    console.log('\nExemple pour le 1er destinataire :');
    const first = recipients[0] || { firstName: 'Alexandre', email: 'test@example.com' };
    console.log('A :', first.email);
    console.log('Objet :', SUBJECT);
    console.log('\n--- TEXTE BRUT ---');
    console.log(generatePlainText(first.firstName));
    console.log('\n--- HTML EPURE ---');
    console.log(generateSimpleHtml(first.firstName));
    console.log('\nPret pour envoi a minuit.');
    return;
  }

  console.log(`Envoi de ${recipients.length} emails via Resend Batch...`);
  const payload = recipients.map(r => ({
    from:    SENDER_EMAIL,
    to:      [r.email],
    subject: SUBJECT,
    text:    generatePlainText(r.firstName),
    html:    generateSimpleHtml(r.firstName)
  }));

  const res = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error('Erreur Resend : ' + err);
  }

  const json = await res.json();
  console.log(`Succes : ${json.data ? json.data.length : recipients.length} emails envoyes.`);
}

run().catch(console.error);
