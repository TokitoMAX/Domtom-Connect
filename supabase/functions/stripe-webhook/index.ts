// Supabase Edge Function : stripe-webhook
// Reçoit les événements Stripe et met à jour la base de données
// Deploy : Supabase Dashboard > Edge Functions > New Function > "stripe-webhook"

import Stripe from 'https://esm.sh/stripe@14?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const signature = req.headers.get('stripe-signature');
  const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, webhookSecret!);
  } catch (err) {
    console.error('[stripe-webhook] Signature invalide:', err.message);
    return new Response(JSON.stringify({ error: 'Signature invalide' }), { status: 400 });
  }

  console.log(`[stripe-webhook] Événement reçu: ${event.type}`);

  // Traitement des événements
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata || {};
    const type = metadata.type || 'showcase';
    const total_price = (session.amount_total! / 100);

    console.log(`[stripe-webhook] Session terminée: ${type} | Montant: ${total_price}€`);

    try {
      if (type === 'showcase') {
        const { item_id, provider_id, buyer_id } = metadata;
        const commission_rate = 0.05;
        const net_amount = parseFloat((total_price * (1 - commission_rate)).toFixed(2));

        // 1. Enregistrer la commande
        const { data: order, error: orderError } = await supabase
          .from('showcase_orders')
          .insert({
            item_id,
            provider_id,
            buyer_id: buyer_id || null,
            total_price,
            status: 'paid',
            stripe_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
          })
          .select()
          .single();

        if (orderError) throw orderError;

        // 2. Créditer l'expert
        await supabase.rpc('credit_expert_balance', {
          p_provider_id: provider_id,
          p_net_amount: net_amount,
          p_total_price: total_price,
        });

      } else if (type === 'quote') {
        const { item_id: quote_id, provider_id } = metadata;
        const commission_rate = 0.125;
        const net_amount = parseFloat((total_price * (1 - commission_rate)).toFixed(2));

        // 1. Update quote status
        const { error: quoteError } = await supabase
          .from('business_docs')
          .update({ 
            status: 'paid',
            stripe_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
          })
          .eq('id', quote_id);

        if (quoteError) throw quoteError;

        // 2. Créditer l'expert (87.5%)
        await supabase.rpc('credit_expert_balance', {
          p_provider_id: provider_id,
          p_net_amount: net_amount,
          p_total_price: total_price,
        });

      } else if (type === 'crowdfunding') {
        const { item_id: project_id, provider_id, buyer_id } = metadata;
        const commission_rate = 0.05;
        const net_amount = parseFloat((total_price * (1 - commission_rate)).toFixed(2));

        // 1. Enregistrer la contribution
        const { error: contribError } = await supabase
          .from('contributions')
          .insert({
            project_id,
            donor_id: buyer_id || null,
            amount: total_price,
            status: 'completed',
            stripe_session_id: session.id,
          });

        if (contribError) throw contribError;

        // 2. Mettre à jour le total levé du projet
        await supabase.rpc('increment_project_raised', {
          p_project_id: project_id,
          p_amount: total_price
        });

        // Note : Le crédit du solde de l'expert (balance) se fera manuellement ou à la fin de la campagne
        // une fois que l'admin valide le transfert final sur Stripe.
      } else if (type === 'subscription') {
        const { buyer_id: user_id, tier } = metadata;
        
        // Update profile subscription
        const { error: subError } = await supabase
          .from('profiles')
          .update({
            subscription_tier: tier,
            subscription_id: session.subscription as string,
            last_payment_date: new Date().toISOString(),
            listed: true,
          })
          .eq('id', user_id);

        if (subError) throw subError;
      }

      console.log(`[stripe-webhook] ✅ Succès pour type: ${type}`);

    } catch (dbErr) {
      console.error('[stripe-webhook] Erreur DB:', dbErr);
      return new Response(JSON.stringify({ error: dbErr.message }), { status: 500 });
    }
  } else if (event.type === 'account.updated') {
    const account = event.data.object as Stripe.Account;
    const payoutsEnabled = account.payouts_enabled;
    const detailsSubmitted = account.details_submitted;
    
    let status = 'pending';
    if (payoutsEnabled && detailsSubmitted) status = 'active';
    else if (detailsSubmitted && !payoutsEnabled) status = 'restricted';

    console.log(`[stripe-webhook] Mise à jour compte Connect: ${account.id} | Status: ${status} | Payouts: ${payoutsEnabled}`);

    try {
      const { error: accError } = await supabase
        .from('profiles')
        .update({
          stripe_payouts_enabled: payoutsEnabled,
          stripe_account_status: status
        })
        .eq('stripe_connect_id', account.id);

      if (accError) throw accError;
      console.log(`[stripe-webhook] ✅ Sync Compte Connect réussi pour ${account.id}`);
    } catch (dbErr) {
      console.error('[stripe-webhook] Erreur DB Sync Compte:', dbErr);
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
