
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: 'd:/DomtomConnect-Website/.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

async function checkColumns() {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .limit(1);

    if (error) {
        console.error("Error:", error);
        return;
    }

    console.log("Columns in profiles:", Object.keys(data[0] || {}));
}

checkColumns();
