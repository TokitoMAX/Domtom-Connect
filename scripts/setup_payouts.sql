-- TABLE: Demandes de Retrait (Payouts)
CREATE TABLE IF NOT EXISTS payout_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    paypal_email TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, completed, cancelled
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

-- RLS
ALTER TABLE payout_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payout requests"
    ON payout_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create payout requests"
    ON payout_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);
