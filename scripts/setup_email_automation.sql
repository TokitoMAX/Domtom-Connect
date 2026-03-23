-- 1. ACTIVER LES EXTENSIONS NÉCESSAIRES
-- L'extension vault permet de stocker la clé API en toute sécurité (optionnel mais recommandé)
CREATE EXTENSION IF NOT EXISTS "http" WITH SCHEMA "extensions";

-- 2. CRÉER LA FONCTION DE DÉCLENCHEMENT (TRIGGER)
CREATE OR REPLACE FUNCTION public.send_ticket_confirmation_email()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  event_title TEXT;
  resend_api_key TEXT := 're_452nrNAV_MDD6utRFPXVHtKRtYgPMt1y7'; -- Votre clé API
BEGIN
  -- Récupérer le titre de l'événement
  SELECT title INTO event_title FROM public.events WHERE id = NEW.event_id;

  -- Envoyer l'appel HTTP à Resend
  PERFORM
    extensions.http_post(
      'https://api.resend.com/emails',
      json_build_object(
        'from', 'Domtom Connect <onboarding@resend.dev>',
        'to', ARRAY[NEW.buyer_email],
        'subject', '🎟️ Votre billet : ' || event_title,
        'html', 
          '<html><body style="font-family: sans-serif; line-height: 1.5; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">' ||
          '<div style="text-align: center; margin-bottom: 20px;">' ||
          '<h1 style="color: #10b981; margin-bottom: 5px;">Félicitations !</h1>' ||
          '<p style="font-size: 1.1rem; margin-top: 0;">Votre réservation pour <strong>' || event_title || '</strong> est confirmée.</p>' ||
          '</div>' ||
          '<div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">' ||
          '<p style="margin: 5px 0;"><strong>Client :</strong> ' || NEW.attendee_name || '</p>' ||
          '<p style="margin: 5px 0;"><strong>Type de billet :</strong> ' || NEW.tier_name || '</p>' ||
          '<p style="margin: 5px 0;"><strong>Prix payé :</strong> ' || NEW.amount_paid || ' €</p>' ||
          '</div>' ||
          '<p>Vous pouvez télécharger votre billet en format PDF directement sur la page de l''événement ou dans votre espace personnel.</p>' ||
          '<div style="text-align: center; margin-top: 30px;">' ||
          '<a href="https://domtom-connect.com/mon-espace" style="background: #10b981; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 8px;">Accéder à mes billets</a>' ||
          '</div>' ||
          '<p style="font-size: 0.8rem; color: #999; margin-top: 40px; text-align: center;">Domtom Connect - Le réseau expert des Outre-Mer.</p>' ||
          '</body></html>'
      )::text,
      'application/json',
      ARRAY[extensions.http_header('Authorization', 'Bearer ' || resend_api_key)]
    );

  RETURN NEW;
END;
$$;

-- 3. CRÉER LE DÉCLENCHEUR (TRIGGER)
-- Supprimer l'ancien s'il existe pour éviter les erreurs
DROP TRIGGER IF EXISTS trigger_send_ticket_email ON public.tickets;

CREATE TRIGGER trigger_send_ticket_email
AFTER INSERT ON public.tickets
FOR EACH ROW
EXECUTE FUNCTION public.send_ticket_confirmation_email();

-- COMMENTAIRE DE VÉRIFICATION
COMMENT ON FUNCTION public.send_ticket_confirmation_email IS 'Envoie automatiquement un email via Resend lors de l''achat d''un billet.';
