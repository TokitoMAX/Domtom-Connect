-- 1. Autoriser les utilisateurs à modifier LEURS propres messages
CREATE POLICY "Users can update their own messages" 
ON public.messages
FOR UPDATE 
USING (auth.uid() = sender_id)
WITH CHECK (auth.uid() = sender_id);

-- 2. Autoriser les utilisateurs à supprimer LEURS propres messages
CREATE POLICY "Users can delete their own messages" 
ON public.messages
FOR DELETE 
USING (auth.uid() = sender_id);
