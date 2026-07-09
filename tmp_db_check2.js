const { createClient } = require('@supabase/supabase-js');

async function check() {
    const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';

    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from('conversations').select('id').eq('id', 'mastermind_global').maybeSingle();
    console.log("Conversations:", data, error);
    
    if (!data && !error) {
        console.log("Inserting conversation...");
        const res = await supabase.from('conversations').insert({
            id: 'mastermind_global',
            title: 'Salon Mastermind DTC',
            type: 'group'
        });
        console.log("Insert res:", res);
    }
}

check();
