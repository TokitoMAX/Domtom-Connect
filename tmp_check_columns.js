
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function checkColumns() {
    const { data, error } = await supabase.from('projects').select('*').limit(1);
    if (error) {
        console.error(error);
        return;
    }
    console.log(Object.keys(data[0]));
}
checkColumns();
