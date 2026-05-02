// Supabase Edge Function : create-checkout
// Crée une session Stripe Checkout pour un article de la vitrine
// Deploy : Supabase Dashboard > Edge Functions > New Function > "create-checkout"

import Stripe from 'https://esm.sh/stripe@14?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { item_id, item_title, item_price, provider_id, buyer_id } = await req.json();

    if (!item_id || !item_price || !provider_id) {
      return new Response(JSON.stringify({ error: 'Paramètres manquants' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item_title || 'Service Expert',
              description: 'Domtom Connect — Solution Expert',
            },
            unit_amount: Math.round(item_price * 100), // Stripe travaille en centimes
          },
          quantity: 1,
        },
      ],
      // Métadonnées pour identifier la commande lors du webhook
      metadata: {
        item_id,
        provider_id,
        buyer_id: buyer_id || '',
        platform: 'domtom_connect_showcase',
      },
      // Redirection après paiement
      success_url: `https://domtomconnect.com/payment-success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://domtomconnect.com/marketplace/solutions.html`,
      locale: 'fr',
    });

    return new Response(JSON.stringify({ url: session.url, session_id: session.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('[create-checkout] Erreur:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
