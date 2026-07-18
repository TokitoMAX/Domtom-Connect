import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Optionnel : Vérifier la signature webhook de Resend (si configuré avec Svix)
  // Pour l'instant, on se base sur la validité du payload.

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const payload = await req.json();
    console.log("Webhook Resend reçu :", payload.type);

    const eventType = payload.type; // ex: 'email.opened', 'email.clicked', 'email.bounced'
    const resendId = payload.data?.email_id;

    if (!resendId) {
      return new Response("ID manquant", { status: 400 });
    }

    let statusToUpdate = "";
    let updateField = {};

    switch (eventType) {
      case "email.delivered":
        statusToUpdate = "delivered";
        updateField = { status: statusToUpdate };
        break;
      case "email.opened":
        statusToUpdate = "opened";
        updateField = { status: statusToUpdate, opened_at: new Date().toISOString() };
        break;
      case "email.clicked":
        statusToUpdate = "clicked";
        updateField = { status: statusToUpdate, clicked_at: new Date().toISOString() };
        break;
      case "email.bounced":
      case "email.complained":
        statusToUpdate = "bounced";
        updateField = { status: statusToUpdate };
        break;
      default:
        // Evénement non suivi
        return new Response("Evénement ignoré", { status: 200 });
    }

    // Mise à jour de la base de données
    const { error } = await supabase
      .from("email_campaign_logs")
      .update(updateField)
      .eq("resend_id", resendId);

    if (error) {
      console.error("Erreur mise à jour BDD :", error);
      return new Response("Erreur interne", { status: 500 });
    }

    return new Response("Webhook traité avec succès", { status: 200 });
  } catch (error) {
    console.error("Erreur serveur :", error);
    return new Response("Erreur serveur", { status: 500 });
  }
});
