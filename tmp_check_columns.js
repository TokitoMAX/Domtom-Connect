const { createClient } = require('@supabase/supabase-js');

async function check() {
    const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // We try to insert a fake updated_at to see if it throws a PGRST204 column not found
    const res = await supabase.from('messages').select('*').limit(1);
    if (res.data && res.data.length > 0) {
        console.log("Columns:", Object.keys(res.data[0]));
    } else {
        console.log("Empty or error", res.error);
    }
}

check();
