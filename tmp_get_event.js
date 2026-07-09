const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vlpzmxddgdjjtrpbtksd.supabase.co',
  'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF'
);

async function getEvent(id) {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();
    
    if (error) {
        console.error("Error fetching event:", error);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

getEvent('f419bee1-0f78-48f4-a935-1ac9c8ce4d31');
