// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.14.0";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const payload = await req.json();
    const { record } = payload;

    if (!record || !record.project_name || !record.candidate_email) {
      return new Response(JSON.stringify({ error: 'Payload invalide : email manquant' }), { status: 400 });
    }

    const candidateEmail = record.candidate_email;
    const candidateName = record.candidate_name || "Candidat";

    const isMastermind = record.project_name === 'Candidature 1-to-1 Mastermind';
    const isZeroBudget = record.project_stage === '0';

    let adminTitle = "Nouvelle Candidature à l'Incubateur ! 🚀";
    let adminIntro = "Un nouvel entrepreneur vient de postuler au Programme Tremplin.";
    if (isMastermind) {
      adminTitle = "Nouvelle Candidature au Mastermind 1-to-1 ! 🚀";
      adminIntro = "Un nouvel entrepreneur vient de postuler pour le Copilotage / Accompagnement Premium.";
    }

    const adminHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
        <h2 style="color: #10b981;">${adminTitle}</h2>
        <p>${adminIntro}</p>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Candidat :</strong> ${candidateName} (${candidateEmail || 'Email introuvable'})</p>
          <p><strong>Projet/Profil :</strong> ${record.project_name}</p>
          <p><strong>Stade/Budget :</strong> ${record.project_stage}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
          <p><strong>Pitch / Défis :</strong><br> ${record.pitch}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 15px 0;">
          <p><strong>Besoins :</strong><br> ${record.needs}</p>
        </div>
        <p><a href="https://supabase.com/dashboard/project/_/editor" style="display: inline-block; background: #10b981; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Voir dans Supabase</a></p>
      </div>
    `;

    let candidateHtml = "";

    if (isMastermind) {
      if (isZeroBudget) {
        candidateHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; margin: 0;">Domtom Connect</h1>
              <p style="color: #10b981; font-weight: bold; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">Accompagnement 1-to-1</p>
            </div>
            <p>Bonjour ${candidateName},</p>
            <p>Nous avons bien reçu votre demande pour l'Accompagnement Premium 1-to-1.</p>
            <p>Au vu de votre budget actuel, le format d'accompagnement complet sur-mesure n'est pas l'approche la plus adaptée pour votre stade d'avancement.</p>
            <p><strong>Cependant, nous tenons à vous aider !</strong> Nous avons décidé de vous offrir un <span style="color: #10b981; font-weight: bold;">Audit Stratégique de 30 minutes</span> gratuit. Cet échange nous permettra de faire le point sur votre situation et de vous donner des actions claires pour avancer.</p>
            <p><a href="https://calendly.com/domtomconnect/30min" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Réserver mon Audit Stratégique</a></p>
            <p style="margin-top: 40px; font-size: 0.9rem; color: #64748b;">L'équipe Domtom Connect<br><a href="https://domtomconnect.com" style="color: #64748b;">domtomconnect.com</a></p>
          </div>
        `;
      } else {
        candidateHtml = `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #0f172a; margin: 0;">Domtom Connect</h1>
              <p style="color: #10b981; font-weight: bold; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">Accompagnement 1-to-1</p>
            </div>
            <p>Bonjour ${candidateName},</p>
            <p>Félicitations, votre profil a été pré-sélectionné pour l'<strong>Accompagnement Premium 1-to-1</strong> ! 🎉</p>
            <p>Votre vision a retenu notre attention. L'étape suivante est un échange de préparation. Ce rendez-vous a pour but de capter précisément vos besoins, vos attentes, et de valider ensemble que cet accompagnement exclusif est fait pour vous.</p>
            <p><a href="https://calendly.com/domtomconnect/30min" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Planifier notre échange de préparation</a></p>
            <p style="margin-top: 40px; font-size: 0.9rem; color: #64748b;">L'équipe Domtom Connect<br><a href="https://domtomconnect.com" style="color: #64748b;">domtomconnect.com</a></p>
          </div>
        `;
      }
    } else {
      // Modèle original pour l'Incubateur
      candidateHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #0f172a; margin: 0;">Domtom Connect</h1>
            <p style="color: #10b981; font-weight: bold; margin-top: 5px; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">Programme Tremplin</p>
          </div>
          <p>Bonjour ${candidateName},</p>
          <p>Votre candidature pour rejoindre l'<strong>Incubateur Domtom Connect</strong> a bien été reçue. 🎉</p>
          <p>Nous sommes ravis de l'intérêt que vous portez à notre écosystème. Notre équipe est actuellement en train d'étudier avec attention votre projet <strong>"${record.project_name}"</strong>.</p>
          <h3 style="color: #0f172a; margin-top: 30px;">Prochaines étapes :</h3>
          <ol style="padding-left: 20px; color: #475569; line-height: 1.6;">
            <li><strong>Analyse du dossier :</strong> Nous évaluons vos besoins et le stade de votre projet (sous 48h à 72h).</li>
            <li><strong>Retour de notre équipe :</strong> Vous recevrez un e-mail pour planifier un appel ou pour vous donner nos premiers retours.</li>
            <li><strong>Embarquement :</strong> Si votre projet est sélectionné, nous commencerons l'accompagnement personnalisé.</li>
          </ol>
          <p style="margin-top: 30px;">En attendant, profitez de l'accès à l'<strong>Espace Business</strong> pour commencer à développer votre réseau dès aujourd'hui.</p>
          <p><a href="https://domtomconnect.com/mon-espace.html" style="display: inline-block; background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 10px;">Accéder à mon Espace</a></p>
          <p style="margin-top: 40px; font-size: 0.9rem; color: #64748b;">L'équipe Domtom Connect<br><a href="https://domtomconnect.com" style="color: #64748b;">domtomconnect.com</a></p>
        </div>
      `;
    }

    // 3. Envoi à l'Admin
    const emails = [
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
        body: JSON.stringify({
          from: "Domtom Connect <contact@domtomconnect.com>",
          to: ["domtomconnect@gmail.com"],
          subject: `🔥 Nouvelle candidature : ${record.project_name}`,
          html: adminHtml,
        }),
      })
    ];

    // 4. Envoi au Candidat (si email trouvé)
    if (candidateEmail) {
      emails.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
          body: JSON.stringify({
            from: "Domtom Connect <contact@domtomconnect.com>",
            to: [candidateEmail],
            subject: isMastermind ? \`Votre demande d'Accompagnement Domtom Connect\` : \`Votre candidature à l'Incubateur Domtom Connect\`,
            html: candidateHtml,
          }),
        })
      );
    }

    // Attendre que tous les emails partent
    const results = await Promise.all(emails);
    
    const errors = [];
    for (const res of results) {
      if (!res.ok) {
        const errText = await res.text();
        console.error("Erreur Resend :", errText);
        errors.push(errText);
      }
    }

    if (errors.length > 0) {
      return new Response(JSON.stringify({ success: false, errors }), {
        headers: { "Content-Type": "application/json" },
        status: 500
      });
    }

    return new Response(JSON.stringify({ success: true, emailsSent: emails.length }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Erreur Webhook :", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
