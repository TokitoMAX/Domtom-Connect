// @ts-nocheck
// Supabase Edge Function : create-checkout
// Crée une session Stripe Checkout pour :
// 1. Showcase (Produits/Services Marketplace)
// 2. Business Quotes (Devis)
// 3. Subscriptions (Packs Authority/Growth)

import Stripe from 'https://esm.sh/stripe@14?target=deno';
import nodemailer from 'npm:nodemailer';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-04-10',
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cache-control, pragma',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { 
      type = 'showcase', // showcase, quote, subscription, event
      item_id, 
      item_title, 
      item_description,
      item_price, 
      provider_id, 
      buyer_id,
      tier, // For subscriptions: 'authority' or 'growth'
      tier_name, // For events: ticket tier name
      plan_id, // For subscriptions: Stripe Price ID
      is_admin_quote,
      promo_id
    } = body;

    const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get real buyer from Authorization header
    const authHeader = req.headers.get('Authorization');
    let real_buyer_id = buyer_id || '';
    let real_buyer_email = 'inconnu@dtc.com';

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      if (user) {
        real_buyer_id = user.id;
        real_buyer_email = user.email;
      }
    }

    console.log(`[create-checkout] Type: ${type}, Item: ${item_id}, Price: ${item_price}`);

    let amount = Math.round((item_price || 0) * 100);

    // --- SERVER-SIDE PRICE VERIFICATION FOR EVENTS ---
    if (type === 'event' && item_id) {
        const { data: evData, error: evError } = await supabaseClient
            .from('events')
            .select('price, ticket_tiers')
            .eq('id', item_id)
            .single();
            
        if (evError || !evData) {
            throw new Error("Événement introuvable");
        }

        let basePrice = parseFloat(evData.price) || 0;
        
        // Find tier price if applicable
        if (tier_name && evData.ticket_tiers && Array.isArray(evData.ticket_tiers)) {
            const tierObj = evData.ticket_tiers.find((t: any) => t.name === tier_name);
            if (tierObj && tierObj.price !== undefined) {
                basePrice = parseFloat(tierObj.price);
            }
        }
        
        // Apply Promo Code if provided
        let finalPrice = basePrice;
        if (promo_id) {
            const { data: promoData } = await supabaseClient
                .from('event_promo_codes')
                .select('*')
                .eq('id', promo_id)
                .single();
                
            if (promoData && promoData.event_id === item_id) {
                if (promoData.max_uses === 0 || promoData.used_count < promoData.max_uses) {
                    if (promoData.discount_type === 'percent') {
                        finalPrice = basePrice * (1 - promoData.discount_value / 100);
                    } else {
                        finalPrice = Math.max(0, basePrice - promoData.discount_value);
                    }
                }
            }
        }
        
        amount = Math.round(finalPrice * 100);
        console.log(`[create-checkout] Server calculated amount for event: ${amount} cents`);
    }

    // ==========================================
    // 🎟️ GESTION DES BILLETS GRATUITS (0€)
    // ==========================================
    if (type === 'event' && amount === 0) {
      console.log('[create-checkout] Billet gratuit détecté, bypass de Stripe.');
      
      const { data: evData } = await supabaseClient.from('events').select('title, event_date, location').eq('id', item_id).maybeSingle();
      const eventTitle = evData?.title || 'Votre Événement';
      let eventDateStr = '';
      if (evData?.event_date) {
          const d = new Date(evData.event_date);
          eventDateStr = d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      }
      const eventLocation = evData?.location || 'En ligne';

      // Créer le billet directement
      await supabaseClient.from('tickets').insert({
        event_id: item_id,
        buyer_id: real_buyer_id || null,
        buyer_email: real_buyer_email,
        amount_paid: 0,
        stripe_session_id: 'gratuit_' + crypto.randomUUID(),
        status: 'valide',
        tier_name: tier_name || null
      });

      if (promo_id) {
         await supabaseClient.rpc('increment_promo_usage', { p_promo_id: promo_id });
      }

      // Envoi du mail
      if (real_buyer_email !== 'inconnu@dtc.com') {
        try {
            // Formatage du lieu avec lien cliquable si c'est une URL
            const formatLocation = (loc: string) => {
                const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/[^\s]*)?)/g;
                return loc.replace(urlRegex, (url) => {
                    if (url.includes('@')) return url; // Ignore les emails
                    let href = url;
                    if (!href.startsWith('http://') && !href.startsWith('https://')) {
                        href = 'https://' + href;
                    }
                    return `<a href="${href}" target="_blank">${url}</a>`;
                });
            };
            const displayLocation = formatLocation(eventLocation);

            const htmlContent = `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
                <h2>Confirmation de votre billet (Gratuit)</h2>
                <p>Bonjour,</p>
                <p>Votre place pour l'événement <strong>${eventTitle}</strong> est bien confirmée !</p>
                <p>📅 <strong>Date :</strong> ${eventDateStr}</p>
                <p>📍 <strong>Lieu :</strong> ${displayLocation}</p>
                <p>Conservez cet email précieusement, il fait office de billet électronique.</p>
                <p>À très bientôt sur Domtom Connect !</p>
              </div>
            `;

            const transporter = nodemailer.createTransport({
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: "domtomconnect@gmail.com",
                    pass: Deno.env.get("GMAIL_APP_PASSWORD"),
                },
            });

            await transporter.sendMail({
                from: '"Domtom Connect" <domtomconnect@gmail.com>',
                to: real_buyer_email,
                bcc: "domtomconnect@gmail.com",
                subject: `Votre billet pour ${eventTitle}`,
                html: htmlContent,
            });

            // Alerte organisateur
            if (provider_id) {
                const { data: userData } = await supabaseClient.auth.admin.getUserById(provider_id);
                const organizerEmail = userData?.user?.email;
                if (organizerEmail) {
                    await transporter.sendMail({
                        from: '"Domtom Connect" <domtomconnect@gmail.com>',
                        to: organizerEmail,
                        subject: `🎉 Nouvelle inscription pour ${eventTitle} !`,
                        html: `<h2>Nouvelle inscription ! 🎉</h2><p>Un participant s'est inscrit gratuitement à votre événement <strong>${eventTitle}</strong>.</p><p><strong>Participant :</strong> ${real_buyer_email}</p>`,
                    });
                }
            }
            
            return new Response(JSON.stringify({ 
                url: `${req.headers.get('origin') || 'https://domtomconnect.com'}/payment-success.html?session_id=free&type=event` 
            }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

        } catch (e) {
            console.error('[create-checkout] Erreur mail gratuit:', e);
            // On renvoie l'erreur en clair pour comprendre ce qui bloque
            return new Response(JSON.stringify({ 
                error: `Erreur d'envoi Gmail: ${e.message}` 
            }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }
      }
    }

    // ==========================================
    // 💳 GESTION DES BILLETS PAYANTS (Stripe)
    // ==========================================
    let sessionConfig: any = {
      payment_method_types: ['card'],
      success_url: `${req.headers.get('origin') || 'https://domtomconnect.com'}/payment-success.html?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: `${req.headers.get('origin') || 'https://domtomconnect.com'}/mon-espace`,
      locale: 'fr',
      metadata: {
        type,
        item_id: item_id || '',
        provider_id: provider_id || '',
        buyer_id: real_buyer_id || '',
        tier: tier || '',
        tier_name: tier_name || '',
        promo_id: promo_id || '',
        item_description: item_description || '',
        is_admin_quote: is_admin_quote || 'false',
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
      sessionConfig.client_reference_id = real_buyer_id;
    } else {
      let paymentData: any = {};
      let has_connect = false;

      if ((type === 'showcase' || type === 'quote' || type === 'event') && provider_id && is_admin_quote !== 'true') {
        const { data: expert } = await supabaseClient
          .from('profiles')
          .select('stripe_connect_id, stripe_payouts_enabled')
          .eq('id', provider_id)
          .maybeSingle();

        if (expert?.stripe_connect_id && expert?.stripe_payouts_enabled) {
          has_connect = true;
          let feePercent = 0.05;
          if (type === 'quote') feePercent = 0.10;
          if (type === 'event') feePercent = 0.10;
          
          const fee = Math.round(amount * feePercent);
          
          paymentData = {
            application_fee_amount: fee,
            transfer_data: {
              destination: expert.stripe_connect_id,
            },
          };
        }
      }

      sessionConfig.metadata.has_connect = has_connect ? 'true' : 'false';
      sessionConfig.mode = 'payment';
      sessionConfig.payment_intent_data = paymentData;
      sessionConfig.line_items = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: item_title || (type === 'quote' ? 'Règlement Devis' : 'Service Expert'),
              description: item_description || (type === 'quote' ? 'Domtom Connect — Paiement Sécurisé de Devis' : 'Domtom Connect — Solution Expert'),
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

  } catch (err: any) {
    console.error('[create-checkout] Erreur:', err);
    
    let errorMessage = err.message;
    if (errorMessage && errorMessage.includes('transfers') && errorMessage.includes('capabilities')) {
      errorMessage = "Le compte Stripe de ce prestataire n'est pas encore entièrement configuré pour recevoir des paiements. Veuillez le contacter pour qu'il termine sa configuration.";
    }

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
