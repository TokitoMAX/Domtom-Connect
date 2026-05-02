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

  // Traitement des événements
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    const { item_id, provider_id, buyer_id } = session.metadata!;
    const total_price = (session.amount_total! / 100); // Convertir centimes → euros
    const commission_rate = 0.05;
    const net_amount = parseFloat((total_price * (1 - commission_rate)).toFixed(2));

    console.log(`[stripe-webhook] Paiement reçu: ${total_price}€ | Expert: ${provider_id}`);

    try {
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

      // 2. Créditer le solde de l'expert (95%)
      const { error: balanceError } = await supabase.rpc('credit_expert_balance', {
        p_provider_id: provider_id,
        p_net_amount: net_amount,
        p_total_price: total_price,
      });

      if (balanceError) {
        // Fallback : mise à jour directe si la fonction RPC n'existe pas
        await supabase
          .from('profiles')
          .update({
            balance: supabase.rpc('increment', { x: net_amount }),
            total_earnings: supabase.rpc('increment', { x: total_price }),
          })
          .eq('id', provider_id);
      }

      // 3. Log de transaction pour audit
      await supabase.from('transaction_logs').insert({
        order_id: order.id,
        provider_id,
        amount: net_amount,
        type: 'credit',
        status: 'success',
        stripe_session_id: session.id,
      });

      // 4. Récupérer les emails pour les notifications
      const { data: expertProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', provider_id)
        .single();

      const { data: buyerProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', buyer_id)
        .single();

      const { data: item } = await supabase
        .from('showcase_items')
        .select('title')
        .eq('id', item_id)
        .single();

      // 5. Envoyer les e-mails via Resend
      const resendKey = Deno.env.get('RESEND_API_KEY');
      if (resendKey && expertProfile) {
        // Email à l'expert
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Domtom Connect <onboarding@resend.dev>',
            to: [expertProfile.email],
            subject: `💰 Nouvelle vente : ${item?.title || 'Votre service'}`,
            html: `
              <h2>Félicitations ${expertProfile.full_name} !</h2>
              <p>Vous venez de réaliser une vente sur Domtom Connect.</p>
              <p><strong>Service vendu :</strong> ${item?.title}</p>
              <p><strong>Votre gain net (95%) :</strong> ${net_amount.toFixed(2)} €</p>
              <p>Votre solde a été mis à jour. Le reversement s'effectue le 1er et le 15 du mois.</p>
              <a href="https://domtomconnect.com/mon-espace" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Voir mon solde</a>
            `,
          }),
        });

        // Email à l'acheteur
        if (buyerProfile) {
          await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'Domtom Connect <onboarding@resend.dev>',
              to: [buyerProfile.email],
              subject: `✅ Commande confirmée : ${item?.title || 'Votre achat'}`,
              html: `
                <h2>Merci pour votre confiance !</h2>
                <p>Votre achat a été validé avec succès.</p>
                <p><strong>Service acheté :</strong> ${item?.title}</p>
                <p><strong>Montant payé :</strong> ${total_price.toFixed(2)} €</p>
                <p>L'expert a été notifié et reviendra vers vous très prochainement.</p>
                <a href="https://domtomconnect.com/mon-espace" style="background:#000;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin-top:16px;">Voir mes commandes</a>
              `,
            }),
          });
        }
      }

      console.log(`[stripe-webhook] ✅ Commande ${order.id} traitée avec succès.`);

    } catch (dbErr) {
      console.error('[stripe-webhook] Erreur DB:', dbErr);
      return new Response(JSON.stringify({ error: dbErr.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
