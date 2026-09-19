/**
 * send_bilan_entrepreneur_campaign.js
 * Campagne email — Annonce du Bilan Entrepreneur Domtom Connect
 *
 * PREREQUIS :
 *   - Renseigner SUPABASE_SERVICE_KEY ci-dessous (Settings > API > service_role key)
 *   - Avoir @supabase/supabase-js installé : npm install @supabase/supabase-js
 *
 * USAGE :
 *   Dry-run (verification sans envoi) :
 *     node scripts/send_bilan_entrepreneur_campaign.js --dry-run
 *
 *   Envoi reel :
 *     node scripts/send_bilan_entrepreneur_campaign.js
 */

const { createClient } = require('@supabase/supabase-js');

// ─── Configuration ───────────────────────────────────────────────────────────
const SUPABASE_URL          = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY     = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

// IMPORTANT : Remplacer par votre service_role key (Supabase > Settings > API)
// Elle commence par "eyJ..." et permet d'acceder a auth.users
const SUPABASE_SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY || 'REMPLACER_PAR_VOTRE_SERVICE_ROLE_KEY';

const RESEND_API_KEY        = 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7';
const SENDER_EMAIL          = 'Domtom Connect <contact@domtomconnect.com>';
const SUBJECT               = 'Votre bilan entrepreneur — Domtom Connect';
const BATCH_SIZE            = 50;   // Maximum par appel Resend batch
const DELAY_MS              = 1500; // Delai entre batches (ms)

const isDryRun = process.argv.includes('--dry-run');

// Client admin pour acceder a auth.users
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

// Client standard en fallback
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Template email classique (aucun emoji) ──────────────────────────────────
function generateEmailHtml(firstName) {
  const displayName = (firstName && firstName.trim() !== '') ? firstName : 'Membre du reseau';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Votre bilan entrepreneur — Domtom Connect</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, Helvetica, sans-serif; color:#222222;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f4f4; padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%; background-color:#ffffff; border:1px solid #dddddd;">

          <!-- EN-TETE -->
          <tr>
            <td style="background-color:#0f172a; padding:28px 40px;">
              <p style="margin:0; font-size:11px; font-weight:bold; letter-spacing:2px; text-transform:uppercase; color:#10b981;">
                DOMTOM CONNECT
              </p>
              <p style="margin:10px 0 0 0; font-size:20px; font-weight:bold; color:#ffffff; line-height:1.35;">
                Votre bilan entrepreneur est disponible
              </p>
            </td>
          </tr>

          <!-- CORPS -->
          <tr>
            <td style="padding:36px 40px; font-size:15px; line-height:1.7; color:#333333;">

              <p style="margin:0 0 20px 0;">Bonjour ${displayName},</p>

              <p style="margin:0 0 18px 0;">
                Nous venons de mettre a jour notre outil de diagnostic pour les entrepreneurs des territoires ultramarins et de la diaspora.
              </p>

              <p style="margin:0 0 18px 0;">
                Il s'agit d'un bilan entrepreneur en 10 questions, calibre selon votre territoire et votre modele economique. Son fonctionnement est inspire des sessions de coaching individuelles : chaque reponse genere un retour direct sur votre situation, sans generalites.
              </p>

              <p style="margin:0 0 18px 0;">
                A l'issue du bilan, vous recevez un profil entrepreneur personnalise ainsi qu'un plan d'action immedIat avec trois priorites concretes.
              </p>

              <!-- Encadre caracteristiques -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0; border-left:4px solid #10b981; background-color:#f8fafc;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px 0; font-size:11px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; color:#10b981;">Ce que contient ce bilan</p>
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:4px 0; font-size:14px; color:#444444;">- 10 questions calibrees selon votre territoire et votre activite</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0; font-size:14px; color:#444444;">- Adapte a votre stade : porteur d'idee, lancement ou entreprise installee</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0; font-size:14px; color:#444444;">- Retour du coach apres chaque reponse</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0; font-size:14px; color:#444444;">- Profil entrepreneur personnalise et plan d'action a l'issue du bilan</td>
                      </tr>
                      <tr>
                        <td style="padding:4px 0; font-size:14px; color:#444444;">- Disponible en francais, anglais et espagnol</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 18px 0;">
                Le bilan est entierement gratuit et prend environ cinq minutes.
              </p>

              <!-- Bouton CTA -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:30px 0;">
                <tr>
                  <td>
                    <a href="https://domtomconnect.com/anamnese.html"
                       target="_blank"
                       style="display:inline-block; background-color:#10b981; color:#ffffff; text-decoration:none; font-size:15px; font-weight:bold; padding:14px 32px; border-radius:4px;">
                      Commencer mon bilan entrepreneur
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Separateur -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="border-top:1px solid #eeeeee; padding-top:26px;">

                    <p style="margin:0 0 16px 0; font-size:14px; color:#555555;">
                      A l'issue du bilan, deux ressources sont proposees pour approfondir votre demarche :
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                      <tr>
                        <td style="width:48%; vertical-align:top; padding:16px; border:1px solid #dddddd; background-color:#fafafa;">
                          <p style="margin:0 0 6px 0; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:#666666;">Livre</p>
                          <p style="margin:0 0 8px 0; font-size:14px; font-weight:bold; color:#0f172a;">Les Fondamentaux de l'Entrepreneur</p>
                          <p style="margin:0 0 10px 0; font-size:13px; color:#555555;">41 pages. Terrain. Sans complaisance.</p>
                          <p style="margin:0; font-size:15px; font-weight:bold; color:#0f172a;">5 euros</p>
                        </td>
                        <td style="width:4%;"></td>
                        <td style="width:48%; vertical-align:top; padding:16px; border:1px solid #10b981; background-color:#f0fdf4;">
                          <p style="margin:0 0 6px 0; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:#10b981;">Outils</p>
                          <p style="margin:0 0 8px 0; font-size:14px; font-weight:bold; color:#0f172a;">Ebook interactif et boite a outils</p>
                          <p style="margin:0 0 10px 0; font-size:13px; color:#555555;">Simulateur financier et feuille de route 30 jours.</p>
                          <p style="margin:0; font-size:15px; font-weight:bold; color:#10b981;">27 euros</p>
                        </td>
                      </tr>
                    </table>

                    <p style="margin:0 0 6px 0; font-size:14px; color:#555555;">
                      Pour toute question, notre equipe est disponible a l'adresse suivante :
                      <a href="mailto:contact@domtomconnect.com" style="color:#0f172a; text-decoration:underline;">contact@domtomconnect.com</a>.
                    </p>

                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0 0; font-size:15px; color:#222222;">
                Cordialement,<br>
                <span style="color:#555555;">La Direction — Domtom Connect</span>
              </p>

            </td>
          </tr>

          <!-- PIED DE PAGE -->
          <tr>
            <td style="background-color:#f4f4f4; padding:20px 40px; text-align:center; font-size:12px; color:#888888; border-top:1px solid #dddddd; line-height:1.6;">
              <p style="margin:0 0 4px 0;">
                Vous recevez cet email en tant qu'utilisateur inscrit sur Domtom Connect.
              </p>
              <p style="margin:0;">
                Pour vous desabonner, ecrivez a
                <a href="mailto:contact@domtomconnect.com?subject=Desabonnement" style="color:#888888; text-decoration:underline;">contact@domtomconnect.com</a>.
                &copy; 2026 Domtom Connect. Tous droits reserves.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function extractFirstName(fullName) {
  if (!fullName || fullName.trim() === '') return '';
  return fullName.trim().split(/\s+/)[0] || '';
}

function chunkArray(arr, size) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

// ─── Envoi d'un batch Resend ─────────────────────────────────────────────────
async function sendBatch(recipients) {
  const payload = recipients.map(r => ({
    from:    SENDER_EMAIL,
    to:      [r.email],
    subject: SUBJECT,
    html:    generateEmailHtml(r.firstName)
  }));

  const res = await fetch('https://api.resend.com/emails/batch', {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${RESEND_API_KEY}`,
      'Content-Type':  'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Resend API error (${res.status}): ${errText}`);
  }

  return await res.json();
}

// ─── Recuperation des emails depuis Supabase ──────────────────────────────────
async function fetchAllRecipients() {
  console.log('Recuperation des utilisateurs depuis Supabase...');

  const emailMap = new Map();

  // --- Methode 1 : auth.admin.listUsers (necessite service_role key) ---
  if (SUPABASE_SERVICE_KEY !== 'REMPLACER_PAR_VOTRE_SERVICE_ROLE_KEY') {
    try {
      let page = 1;
      const perPage = 1000;

      while (true) {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers({
          page,
          perPage
        });

        if (error) {
          console.warn('auth.admin.listUsers erreur :', error.message);
          break;
        }

        if (!data || !data.users || data.users.length === 0) break;

        for (const user of data.users) {
          if (user.email && user.email_confirmed_at && !user.deleted_at) {
            const key = user.email.toLowerCase();
            if (!emailMap.has(key)) {
              // Chercher le prenom dans user_metadata ou app_metadata
              const meta = user.user_metadata || {};
              const fullName = meta.full_name || meta.name || '';
              emailMap.set(key, {
                email:     user.email,
                firstName: extractFirstName(fullName)
              });
            }
          }
        }

        console.log(`  Page ${page} : ${data.users.length} utilisateurs charges (total : ${emailMap.size})`);

        // Supabase renvoie moins que perPage quand c'est la derniere page
        if (data.users.length < perPage) break;
        page++;
      }

      // Enrichir les prenoms manquants depuis profiles
      if (emailMap.size > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, full_name');

        if (profiles && profiles.length > 0) {
          // On a besoin de faire le lien id -> email
          // On recharge les users pour avoir les ids
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 10000 });
          if (usersData && usersData.users) {
            const idToEmail = {};
            for (const u of usersData.users) {
              if (u.email) idToEmail[u.id] = u.email.toLowerCase();
            }
            for (const p of profiles) {
              const email = idToEmail[p.id];
              if (email && emailMap.has(email) && p.full_name) {
                const entry = emailMap.get(email);
                if (!entry.firstName) {
                  entry.firstName = extractFirstName(p.full_name);
                }
              }
            }
          }
        }
      }

    } catch (err) {
      console.warn('Methode admin.listUsers echouee :', err.message);
    }
  } else {
    console.log('');
    console.log('ATTENTION : SUPABASE_SERVICE_KEY non definie.');
    console.log('La cle service_role est necessaire pour acceder a auth.users.');
    console.log('');
    console.log('Comment l\'obtenir :');
    console.log('  1. Allez sur https://app.supabase.com');
    console.log('  2. Votre projet > Settings > API');
    console.log('  3. Copiez la "service_role" key (colonne "Secret")');
    console.log('  4. Lancez : SUPABASE_SERVICE_KEY="eyJ..." node scripts/send_bilan_entrepreneur_campaign.js --dry-run');
    console.log('');
    process.exit(1);
  }

  // --- Fallback : table profiles si elle contient un champ email ---
  if (emailMap.size === 0) {
    console.log('Fallback : tentative depuis profiles.email...');
    const { data: profiles } = await supabase
      .from('profiles')
      .select('full_name, email')
      .not('email', 'is', null);

    if (profiles && profiles.length > 0) {
      for (const p of profiles) {
        if (p.email) {
          const key = p.email.toLowerCase();
          if (!emailMap.has(key)) {
            emailMap.set(key, {
              email:     p.email,
              firstName: extractFirstName(p.full_name)
            });
          }
        }
      }
    }
  }

  return Array.from(emailMap.values());
}

// ─── Runner ───────────────────────────────────────────────────────────────────
async function runCampaign() {
  console.log('');
  console.log('================================================================');
  console.log(' CAMPAGNE : Bilan Entrepreneur — Domtom Connect');
  console.log(isDryRun ? ' MODE    : DRY-RUN (aucun email envoye)' : ' MODE    : ENVOI REEL');
  console.log('================================================================');
  console.log('');

  const recipients = await fetchAllRecipients();

  if (recipients.length === 0) {
    console.error('Aucun destinataire trouve. Verifiez les instructions ci-dessus.');
    process.exit(1);
  }

  const batches = chunkArray(recipients, BATCH_SIZE);

  console.log('');
  console.log(`Total destinataires : ${recipients.length}`);
  console.log(`Nombre de batches   : ${batches.length} (${BATCH_SIZE} emails par batch)`);
  console.log('');

  if (isDryRun) {
    console.log('PREVIEW des 5 premiers destinataires :');
    recipients.slice(0, 5).forEach((r, i) => {
      console.log(`  ${i + 1}. ${r.email} — prenom : "${r.firstName || '(non renseigne)'}"`);
    });
    console.log('');
    console.log('Dry-run termine. Relancez sans --dry-run pour envoyer reellement.');
    return;
  }

  let totalSent   = 0;
  let totalErrors = 0;

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    process.stdout.write(`Batch ${i + 1}/${batches.length} (${batch.length} emails)... `);

    try {
      await sendBatch(batch);
      totalSent += batch.length;
      console.log('OK');
    } catch (err) {
      totalErrors += batch.length;
      console.error(`ERREUR : ${err.message}`);
    }

    if (i < batches.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  console.log('');
  console.log('================================================================');
  console.log(` RESULTAT : ${totalSent} envoyes / ${totalErrors} erreurs`);
  console.log('================================================================');
}

runCampaign().catch(err => {
  console.error('Erreur fatale :', err.message);
  process.exit(1);
});
