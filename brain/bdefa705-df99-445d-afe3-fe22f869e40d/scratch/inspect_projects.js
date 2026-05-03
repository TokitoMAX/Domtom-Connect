
const { createClient } = require('@supabase/supabase-js');
const SUPABASE_URL = 'https://vlpzmxddgdjjtrpbtksd.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkSchema() {
    try {
        const { data, error } = await supabase.from('projects').select('*').limit(1);
        if (error) {
            console.error("Error fetching project:", error);
            // Try to fetch just one column to see if it works
            const { error: err2 } = await supabase.from('projects').select('id').limit(1);
            console.log("Fetch ID only error:", err2);
        } else if (data && data.length > 0) {
            console.log("Project Columns:", Object.keys(data[0]));
        } else {
            console.log("No projects found to inspect schema.");
        }
    } catch (e) {
        console.error("Exception:", e);
    }
}

checkSchema();
