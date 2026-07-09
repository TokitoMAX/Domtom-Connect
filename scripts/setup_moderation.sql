-- 1. Table des signalements
CREATE TABLE IF NOT EXISTS public.post_reports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES public.showcase_items(id) ON DELETE CASCADE,
    reporter_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, reporter_id) -- Un utilisateur ne peut signaler un post qu'une seule fois
);

-- RLS sur post_reports
ALTER TABLE public.post_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can insert reports" ON public.post_reports;
CREATE POLICY "Users can insert reports" ON public.post_reports
    FOR INSERT WITH CHECK (auth.uid() = reporter_id);

DROP POLICY IF EXISTS "Users can read own reports" ON public.post_reports;
CREATE POLICY "Users can read own reports" ON public.post_reports
    FOR SELECT USING (auth.uid() = reporter_id);

-- 2. Fonction et Trigger pour cacher un post après X signalements
CREATE OR REPLACE FUNCTION public.check_post_reports()
RETURNS TRIGGER AS $$
DECLARE
    report_count INT;
BEGIN
    SELECT COUNT(*) INTO report_count
    FROM public.post_reports
    WHERE post_id = NEW.post_id;

    -- Si 3 signalements ou plus, on cache le post
    IF report_count >= 3 THEN
        UPDATE public.showcase_items
        SET status = 'flagged'
        WHERE id = NEW.post_id AND status != 'flagged';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_post_reports ON public.post_reports;
CREATE TRIGGER trigger_check_post_reports
AFTER INSERT ON public.post_reports
FOR EACH ROW
EXECUTE FUNCTION public.check_post_reports();


-- 3. Fonction Anti-Spam (Limitation de publication)
CREATE OR REPLACE FUNCTION public.check_post_rate_limit()
RETURNS TRIGGER AS $$
DECLARE
    post_count INT;
BEGIN
    -- Ne s'applique qu'aux statuts et stories
    IF NEW.category IN ('status', 'story') THEN
        -- Compter les posts de l'utilisateur dans la dernière minute
        SELECT COUNT(*) INTO post_count
        FROM public.showcase_items
        WHERE user_id = NEW.user_id
        AND category IN ('status', 'story')
        AND created_at > (NOW() - INTERVAL '1 minute');

        -- Si plus de 5 posts par minute -> erreur
        IF post_count >= 5 THEN
            RAISE EXCEPTION 'Rate limit exceeded: You are posting too fast.';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_check_post_rate_limit ON public.showcase_items;
CREATE TRIGGER trigger_check_post_rate_limit
BEFORE INSERT ON public.showcase_items
FOR EACH ROW
EXECUTE FUNCTION public.check_post_rate_limit();
