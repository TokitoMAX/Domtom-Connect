const { createClient } = require('@supabase/supabase-js');

async function check() {
    const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    const res = await supabase.from('messages').update({ content: 'test', updated_at: new Date().toISOString() }).eq('id', '11111111-1111-1111-1111-111111111111');
    console.log(res);
}

check();
