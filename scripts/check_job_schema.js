
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
    const { data, error } = await supabase
        .from('job_offers')
        .select('*')
        .limit(1);
    
    if (error) {
        console.error('Error fetching job_offers:', error);
    } else {
        console.log('Columns in job_offers:', data && data.length > 0 ? Object.keys(data[0]) : 'No data, columns unknown');
    }
}

checkSchema();
