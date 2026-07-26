/**
 * send_v6_email_campaign.js
 * Script d'envoi de mail de masse pour annoncer DTC Pulse v6
 */
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';
const RESEND_API_KEY = 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runCampaign() {
  console.log("🚀 Initialisation de l'envoi de la campagne Email v6...");

  // 1. Récupérer la liste des utilisateurs
  const { data: users, error } = await supabase
    .from('profiles')
    .select('id, full_name');

  if (error) {
    console.error("Erreur récupération profils:", error);
  }

  console.log(`Trouvé ${users ? users.length : 0} profils.`);
}

runCampaign();
