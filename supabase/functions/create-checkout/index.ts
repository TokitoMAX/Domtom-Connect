// Supabase Edge Function : create-checkout
// Crée une session Stripe Checkout pour :
// 1. Showcase (Produits/Services Marketplace)
// 2. Business Quotes (Devis)
// 3. Subscriptions (Packs Authority/Growth)

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
    const body = await req.json();
    const { 
      type = 'showcase', // showcase, quote, subscription
      item_id, 
      item_title, 
      item_price, 
      provider_id, 
      buyer_id,
      tier, // For subscriptions: 'authority' or 'growth'
      plan_id // For subscriptions: Stripe Price ID
    } = body;

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log(`[create-checkout] Type: ${type}, Item: ${item_id}, Price: ${item_price}`);

    let sessionConfig: any = {
      payment_method_types: ['card'],
      success_url: `${req.headers.get('origin') || 'https://domtomconnect.com'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${req.headers.get('origin') || 'https://domtomconnect.com'}/mon-espace`,
      locale: 'fr',
      metadata: {
        type,
        item_id: item_id || '',
        provider_id: provider_id || '',
        buyer_id: buyer_id || '',
        tier: tier || '',
      },
    };

    if (type === 'subscription') {
      sessionConfig.mode = 'subscription';
      sessionConfig.line_items = [
        {
          price: plan_id,
          quantity: 1,
        },
      ];
      sessionConfig.client_reference_id = buyer_id;
    } else {
      const amount = Math.round(item_price * 100);
      let paymentData: any = {};

      if ((type === 'showcase' || type === 'quote') && provider_id) {
        const { data: expert } = await supabaseClient
          .from('profiles')
          .select('stripe_connect_id')
          .eq('id', provider_id)
          .single();

        if (expert?.stripe_connect_id) {
          // Commission : 5% pour Showcase, 12.5% pour Quotes
          const feePercent = type === 'quote' ? 0.125 : 0.05;
          const fee = Math.round(amount * feePercent);
          
          paymentData = {
            application_fee_amount: fee,
            transfer_data: {
              destination: expert.stripe_connect_id,
            },
          };
        }
      }

      sessionConfig.mode = 'payment';
      sessionConfig.payment_intent_data = paymentData;
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item_title || (type === 'quote' ? 'Règlement Devis' : 'Service Expert'),
              description: type === 'quote' ? 'Domtom Connect — Paiement Sécurisé de Devis' : 'Domtom Connect — Solution Expert',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ];
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

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
