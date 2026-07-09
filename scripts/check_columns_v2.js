const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://vlpzmxddgdjjtrpbtksd.supabase.co', 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF');

async function checkSchema() {
    const { data, error } = await supabase
        .from('job_applications')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching data:', error);
        return;
    }
    
    if (data && data.length > 0) {
        console.log('Columns:', Object.keys(data[0]));
    } else {
        console.log('Table is empty, trying to get columns via another way or just assume missing.');
    }
}

checkSchema();
