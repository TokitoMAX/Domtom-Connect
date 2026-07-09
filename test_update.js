const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vlpzmxddgdjjtrpbtksd.supabase.co', 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF');

async function test() {
    const { data, error } = await supabase.from('job_applications').select('id, status').limit(1);
    console.log('App:', data);
    
    if (data && data.length > 0) {
        const appId = data[0].id;
        const res = await supabase.from('job_applications').update({ status: 'rejected' }).eq('id', appId);
        console.log('Update res:', res);
    }
}
test();
