// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    // Autoriser seulement POST (ou un CRON trigger qui envoie un POST)
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    // Auth validation: Verify authorization header if we want to secure it, 
    // but for cron jobs on Supabase, the request often comes with service_role key or we can just rely on the auth header.
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), { status: 401 });
    }

    // Initialiser Supabase avec le Service Role Key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log("Starting process-daily-emails...");

    // 1. Récupérer tous les utilisateurs
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      throw new Error(`Failed to list users: ${usersError.message}`);
    }

    // 2. Récupérer la séquence d'emails (si la table existe, on la lit)
    // S'il n'y a pas de table email_sequence, on utilise une logique statique robuste
    let emailsSent = 0;
    const now = new Date();
    
    for (const user of users.users) {
      if (!user.email) continue;
      
      // Récupérer l'historique des emails envoyés à cet utilisateur
      const { data: userLogs } = await supabase
        .from('email_logs')
        .select('day_offset, created_at')
        .eq('user_id', user.id)
        .order('day_offset', { ascending: false });

      let currentStep = 1; // Par défaut, on commence à l'étape 1

      if (userLogs && userLogs.length > 0) {
        const lastLog = userLogs[0]; // Le log le plus récent en termes d'étape
        const lastSentDate = new Date(lastLog.created_at);
        const diffTimeSinceLast = Math.abs(now.getTime() - lastSentDate.getTime());
        const diffDaysSinceLast = Math.ceil(diffTimeSinceLast / (1000 * 60 * 60 * 24));

        // Machine à états pour la séquence
        if (lastLog.day_offset === 1 && diffDaysSinceLast >= 2) {
          currentStep = 3;
        } else if (lastLog.day_offset === 3 && diffDaysSinceLast >= 4) {
          currentStep = 7;
        } else if (lastLog.day_offset === 7 && diffDaysSinceLast >= 7) {
          currentStep = 14;
        } else if (lastLog.day_offset >= 14 && diffDaysSinceLast >= 15) {
          currentStep = lastLog.day_offset + 15; // Relance infinie tous les 15 jours
        } else {
          // Le délai n'est pas encore passé, on ne fait rien aujourd'hui
          continue;
        }
      }
      
      // LOGIQUE DU DAILY COACH
      let subject = null;
      let htmlContent = null;
      let stepToLog = currentStep;

      if (currentStep === 1) {
        subject = "Quelle est ta plus grande difficulté en ce moment ?";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>Bienvenue dans l'Incubateur Domtom Connect</h2>
            <p>Bonjour,</p>
            <p>Tu fais partie de l'aventure Domtom Connect, et je voulais prendre le temps de te poser une question très simple mais essentielle pour t'aider :</p>
            <p><strong>Quelle est la chose numéro 1 qui te bloque aujourd'hui dans ton projet ?</strong></p>
            <p>Je lis toutes les réponses. Réponds simplement à cet e-mail pour me dire ce qui te freine. Que ce soit un manque de réseau, un problème technique, ou besoin d'un financement, l'Incubateur est là pour ça.</p>
            <p><a href="https://domtomconnect.com/mon-espace" style="color: #2563eb; text-decoration: underline; font-weight: bold;">Accéder à mon espace</a></p>
            <p>À très vite sur la plateforme !</p>
          </div>
        `;
      } else if (currentStep === 3) {
        subject = "Un secret pour avancer plus vite + ressource";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>Le pouvoir du réseau</h2>
            <p>Bonjour,</p>
            <p>En analysant les entrepreneurs qui réussissent le mieux sur Domtom Connect, on a remarqué une chose : <strong>ils n'avancent jamais seuls.</strong></p>
            <p>As-tu pris le temps de publier un statut dans le <strong>DTC Feed</strong> pour te présenter ? C'est le meilleur moyen de trouver des partenaires ou des clients.</p>
            <p>Si ce n'est pas fait, prends 2 minutes pour partager ce sur quoi tu travailles aujourd'hui :</p>
            <p><a href="https://domtomconnect.com/mon-espace" style="color: #2563eb; text-decoration: underline; font-weight: bold;">Publier un statut</a></p>
          </div>
        `;
      } else if (currentStep === 7) {
        subject = "Connais-tu d'autres entrepreneurs ambitieux ?";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>On a besoin de toi</h2>
            <p>Bonjour,</p>
            <p>Cela fait 1 semaine que tu as rejoint la communauté Domtom Connect. L'incubateur grandit grâce à la force de ses membres.</p>
            <p>As-tu dans ton entourage 1 ou 2 entrepreneurs, porteurs de projets, ou indépendants qui auraient besoin de visibilité et d'un réseau solide ?</p>
            <p>Si oui, le plus beau cadeau que tu puisses nous faire est de leur partager ce lien :</p>
            <p><a href="https://domtomconnect.com/vitrine">https://domtomconnect.com</a></p>
            <p>Merci pour ton soutien !</p>
          </div>
        `;
      } else if (currentStep === 14) {
        subject = "Comment pouvons-nous nous améliorer ?";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>Ton avis compte énormément</h2>
            <p>Bonjour,</p>
            <p>Nous construisons Domtom Connect POUR les utilisateurs. J'aimerais savoir : qu'est-ce qui te manque le plus sur la plateforme aujourd'hui ?</p>
            <p>Réponds directement à cet e-mail avec tes retours, tes frustrations, ou tes idées de génie !</p>
            <p>Merci pour ton temps.</p>
          </div>
        `;
      } else if (currentStep > 14) {
        // Relance tous les 15 jours pour les anciens
        subject = "Quoi de neuf sur Domtom Connect ?";
        htmlContent = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2>Viens jeter un coup d'oeil</h2>
            <p>Bonjour,</p>
            <p>De nouveaux projets et de nouvelles opportunités ont été publiés récemment sur le réseau.</p>
            <p>Prends 5 minutes pour aller voir ce qu'il se passe, soutenir un projet, ou partager ta propre actualité.</p>
            <p><a href="https://domtomconnect.com/mon-espace" style="color: #2563eb; text-decoration: underline; font-weight: bold;">Voir les actualités</a></p>
          </div>
        `;
      }

      // Si un message est prévu pour ce jour, on vérifie les logs et on l'envoie
      if (subject && htmlContent) {
        // On peut s'assurer ici qu'on ne l'a vraiment pas envoyé (sécurité supplémentaire)
        const { data: checkLog } = await supabase
          .from('email_logs')
          .select('id')
          .eq('user_id', user.id)
          .eq('day_offset', stepToLog)
          .single();

        if (!checkLog) {
          // On envoie via Resend
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
              from: "Domtom Connect <contact@domtomconnect.com>",
              to: [user.email],
              subject: subject,
              html: htmlContent,
            }),
          });

          if (res.ok) {
            emailsSent++;
            // Enregistrer dans les logs pour ne pas renvoyer
            // NB: Cette table doit exister. Sinon, l'erreur est catchée sans tout bloquer.
            await supabase.from('email_logs').insert([{
              user_id: user.id,
              email: user.email,
              day_offset: stepToLog,
              subject: subject
            }]);
          } else {
            console.error(`Failed to send email to ${user.email}: `, await res.text());
          }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, emailsSent }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Error processing daily emails:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
