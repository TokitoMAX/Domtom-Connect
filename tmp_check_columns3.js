const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vlpzmxddgdjjtrpbtksd.supabase.co', 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF');

async function check() {
    const { data, error } = await supabase.from('events').select('ticket_tiers, agenda').limit(1);
    console.log("events query:", data, error);
}

check();
