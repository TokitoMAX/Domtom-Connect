// Supabase Edge Function : create-connect-onboarding
// Génère un lien d'onboarding Stripe Connect pour l'expert

import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // 1. Vérifier l'utilisateur
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Non autorisé');

    // 2. Récupérer le profil
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('stripe_connect_id, full_name, email')
      .eq('id', user.id)
      .single();

    let connectId = profile?.stripe_connect_id;

    // 3. Créer le compte Connect si inexistant
    if (!connectId) {
      const account = await stripe.accounts.create({
        type: 'express',
        email: profile?.email || user.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          name: profile?.full_name || '',
        },
      });
      connectId = account.id;

      // Sauvegarder l'ID immédiatement
      await supabaseClient
        .from('profiles')
        .update({ stripe_connect_id: connectId })
        .eq('id', user.id);
    }

    // 4. Créer le lien d'onboarding
    const accountLink = await stripe.accountLinks.create({
      account: connectId,
      refresh_url: 'https://domtomconnect.com/mon-espace?stripe=refresh',
      return_url: 'https://domtomconnect.com/mon-espace?stripe=success',
      type: 'account_onboarding',
    });

    return new Response(JSON.stringify({ url: accountLink.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
