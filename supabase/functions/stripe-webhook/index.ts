// @ts-nocheck
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
      let commission_rate = 0.05;
      if (type === 'quote') {
        commission_rate = metadata.is_admin_quote === 'true' ? 0.0 : 0.125;
      }
      if (type === 'event') commission_rate = 0.15;
      
      const net_amount = parseFloat((total_price * (1 - commission_rate)).toFixed(2));
      const fee_amount = parseFloat((total_price * commission_rate).toFixed(2));
      const { provider_id, buyer_id, item_id } = metadata;

      let payout_status = 'released';
      let payout_release_date = null;

      // --- LOGIQUE DE RETENUE (PHASE PRO) ---
      if (type === 'event') {
        payout_status = 'pending';
        // Chercher la date de l'événement pour libérer le lendemain
        const { data: eventData } = await supabase.from('events').select('date').eq('id', item_id).single();
        if (eventData?.date) {
            const releaseDate = new Date(eventData.date);
            releaseDate.setDate(releaseDate.getDate() + 1);
            payout_release_date = releaseDate.toISOString();
        }
      } else if (type === 'crowdfunding') {
        payout_status = 'pending';
        // Crowdfunding : Libéré seulement quand l'objectif est atteint (logique manuelle ou automatique ultérieure)
      }

      // --- LOG UNIFIÉ POUR TOUTES LES TRANSACTIONS ---
      await supabase.from('platform_transactions').insert({
        type,
        gross_amount: total_price,
        fee_amount: fee_amount,
        net_amount: net_amount,
        provider_id: provider_id || null,
        buyer_id: buyer_id || null,
        stripe_session_id: session.id,
        payout_status,
        payout_release_date
      });

      if (type === 'showcase') {
        // 1. Enregistrer la commande
        const { error: orderError } = await supabase
          .from('showcase_orders')
          .insert({
            item_id,
            provider_id,
            buyer_id: buyer_id || null,
            total_price,
            status: 'paid',
            stripe_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
          });

        if (orderError) throw orderError;

        // 2. Créditer l'expert immédiatement
        await supabase.rpc('credit_expert_balance', {
          p_provider_id: provider_id,
          p_net_amount: net_amount,
          p_total_price: total_price,
        });

      } else if (type === 'quote') {
        // 1. Update quote status
        const { error: quoteError } = await supabase
          .from('business_docs')
          .update({ 
            status: 'paid',
            stripe_session_id: session.id,
            payment_intent_id: session.payment_intent as string,
          })
          .eq('id', item_id);

        if (quoteError) throw quoteError;

        // 2. Créditer l'expert immédiatement
        await supabase.rpc('credit_expert_balance', {
          p_provider_id: provider_id,
          p_net_amount: net_amount,
          p_total_price: total_price,
        });

        // 3. Créer automatiquement le canal "Sas" de discussion projet
        try {
          const { data: quoteDoc } = await supabase
            .from('business_docs')
            .select('project_title, client_id')
            .eq('id', item_id)
            .single();

          if (quoteDoc) {
            const sasId = crypto.randomUUID();
            const sasTitle = `Sas - ${quoteDoc.project_title || 'Nouveau Projet'}`;
            
            // Create Sas room
            await supabase
              .from('conversations')
              .insert({
                id: sasId,
                title: sasTitle,
                updated_at: new Date().toISOString()
              });

            // Add participants (provider and client)
            const participants = [
              { conversation_id: sasId, user_id: provider_id, lead_status: 'Nouveau' }
            ];
            const clientUserId = quoteDoc.client_id || buyer_id;
            if (clientUserId) {
              participants.push({ conversation_id: sasId, user_id: clientUserId, lead_status: 'Nouveau' });
            }

            await supabase
              .from('conversation_participants')
              .insert(participants);

            // Send automated welcome message inside Sas
            await supabase
              .from('messages')
              .insert({
                conversation_id: sasId,
                sender_id: provider_id,
                content: `⚡️ [Système] Le règlement de l'acompte de la prestation "${quoteDoc.project_title}" a été validé par Stripe.\n\nBienvenue dans votre Sas de discussion et de pilotage DTC. Cet espace privé réunit le client et le prestataire pour centraliser vos échanges, documents et validations sans passer par des groupes WhatsApp externes.`
              });

            console.log(`[stripe-webhook] Sas de projet créé avec succès: ${sasId} (${sasTitle})`);
          }
        } catch (sasErr) {
          console.error('[stripe-webhook] Erreur lors de la création du Sas de projet:', sasErr);
        }

      } else if (type === 'event') {
        // 1. Créer le billet
        const { error: ticketError } = await supabase
          .from('tickets')
          .insert({
            event_id: item_id,
            buyer_id: buyer_id || null,
            buyer_email: session.customer_details?.email || 'inconnu@dtc.com',
            amount_paid: total_price,
            stripe_session_id: session.id,
            status: 'valide'
          });

        if (ticketError) throw ticketError;

        // NOTE : On ne crédite PAS l'organisateur immédiatement. 
        // L'argent est en "payout_status: pending" dans platform_transactions.

        // 3. Increment Promo Use if applicable
        if (metadata.promo_id) {
            await supabase.rpc('increment_promo_usage', { p_promo_id: metadata.promo_id });
        }

      } else if (type === 'crowdfunding') {
        // 1. Enregistrer la contribution
        const { error: contribError } = await supabase
          .from('contributions')
          .insert({
            project_id: item_id,
            donor_id: buyer_id || null,
            amount: total_price,
            status: 'completed',
            stripe_session_id: session.id,
          });

        if (contribError) throw contribError;

        // 2. Mettre à jour le total levé du projet
        await supabase.rpc('increment_project_raised', {
          p_project_id: item_id,
          p_amount: total_price
        });
        
        // NOTE : L'argent reste "pending" jusqu'à validation de la campagne.

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
