-- CONFIGURATION : Automatisation des E-mails Domtom Connect (Resend)
-- Ce script centralise les notifications pour les ventes et les dons.

CREATE OR REPLACE FUNCTION public.notify_transaction_success()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  resend_api_key TEXT := 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7'; -- Clé API de l'utilisateur
  buyer_email TEXT;
  provider_email TEXT;
  item_title TEXT;
  provider_name TEXT;
  buyer_name TEXT;
  net_amount DECIMAL(10,2);
BEGIN

  -- SCÉNARIO 1 : VENTES VITRINE (showcase_orders)
  IF (TG_TABLE_NAME = 'showcase_orders') THEN
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid')) THEN
      
      -- Récupérer les infos nécessaires
      SELECT email, full_name INTO buyer_email, buyer_name FROM public.profiles WHERE id = NEW.buyer_id;
      SELECT email, full_name INTO provider_email, provider_name FROM public.profiles WHERE id = NEW.provider_id;
      SELECT title INTO item_title FROM public.showcase_items WHERE id = NEW.item_id;
      net_amount := NEW.total_price * 0.95;

      -- 1. E-mail à l'EXPERT (Le vendeur)
      PERFORM extensions.http_post(
        'https://api.resend.com/emails',
        json_build_object(
          'from', 'Domtom Connect <onboarding@resend.dev>',
          'to', ARRAY[provider_email],
          'subject', '💰 Nouvelle vente : ' || item_title,
          'html', '<h1>Félicitations ' || provider_name || ' !</h1><p>' || buyer_name || ' vient de vous acheter <strong>' || item_title || '</strong>.</p><p>Votre solde Domtom Connect a été crédité de <strong>' || net_amount || ' €</strong> (après commission de 5%).</p><a href="https://domtomconnect.com/mon-espace">Voir mon solde</a>'
        )::text,
        'application/json',
        ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
      );

      -- 2. E-mail au CLIENT (L'acheteur)
      PERFORM extensions.http_post(
        'https://api.resend.com/emails',
        json_build_object(
          'from', 'Domtom Connect <onboarding@resend.dev>',
          'to', ARRAY[buyer_email],
          'subject', '✅ Confirmation de votre commande : ' || item_title,
          'html', '<h1>Merci pour votre confiance !</h1><p>Votre achat de <strong>' || item_title || '</strong> a été validé.</p><p>Montant total : ' || NEW.total_price || ' €.</p><p>L''expert a été prévenu et reviendra vers vous rapidement.</p>'
        )::text,
        'application/json',
        ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
      );
    END IF;

  -- SCÉNARIO 2 : DONS / CROWDFUNDING (contributions)
  ELSIF (TG_TABLE_NAME = 'contributions') THEN
    IF (NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed')) THEN
      
      -- Récupérer les infos
      SELECT title, (SELECT email FROM profiles WHERE id = projects.owner_id), (SELECT full_name FROM profiles WHERE id = projects.owner_id) 
      INTO item_title, provider_email, provider_name 
      FROM public.projects WHERE id = NEW.project_id;
      
      buyer_name := COALESCE(NEW.donor_name, 'Un supporter anonyme');
      -- On suppose qu'on a le donor_email ou on l'extrait du profil
      SELECT email INTO buyer_email FROM public.profiles WHERE id = NEW.donor_id;

      -- 1. E-mail au PORTEUR DE PROJET
      PERFORM extensions.http_post(
        'https://api.resend.com/emails',
        json_build_object(
          'from', 'Domtom Connect <onboarding@resend.dev>',
          'to', ARRAY[provider_email],
          'subject', '🚀 Nouveau soutien pour ' || item_title,
          'html', '<h1>C''est un grand jour !</h1><p><strong>' || buyer_name || '</strong> vient de propulser votre épopée avec un don de ' || NEW.amount || ' €.</p><p>Continuez comme ça !</p>'
        )::text,
        'application/json',
        ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
      );

      -- 2. E-mail au DONATEUR (si inscrit)
      IF (buyer_email IS NOT NULL) THEN
        PERFORM extensions.http_post(
          'https://api.resend.com/emails',
          json_build_object(
            'from', 'Domtom Connect <onboarding@resend.dev>',
            'to', ARRAY[buyer_email],
            'subject', '🙏 Merci pour votre soutien à ' || item_title,
            'html', '<h1>Vous êtes un Gardien de l''Épopée !</h1><p>Votre contribution de ' || NEW.amount || ' € pour <strong>' || item_title || '</strong> a bien été reçue.</p><p>Ensemble, nous faisons briller les Outre-mer.</p>'
          )::text,
          'application/json',
          ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

-- TRIGGERS pour activer l'automatisation
DROP TRIGGER IF EXISTS tr_notify_order_success ON public.showcase_orders;
CREATE TRIGGER tr_notify_order_success AFTER UPDATE ON public.showcase_orders FOR EACH ROW EXECUTE FUNCTION public.notify_transaction_success();

DROP TRIGGER IF EXISTS tr_notify_donation_success ON public.contributions;
CREATE TRIGGER tr_notify_donation_success AFTER UPDATE ON public.contributions FOR EACH ROW EXECUTE FUNCTION public.notify_transaction_success();
