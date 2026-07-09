
const { createClient } = require('@supabase/supabase-client');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
    console.log("--- BUSINESS_DOCS SCHEMA ---");
    const { data: bData, error: bError } = await supabase.from('business_docs').select('*').limit(1);
    if (bError) console.error("Error fetching business_docs:", bError.message);
    else console.log("Columns:", Object.keys(bData[0] || {}).join(', '));

    console.log("\n--- COLLABORATORS SCHEMA ---");
    const { data: cData, error: cError } = await supabase.from('collaborators').select('*').limit(1);
    if (cError) console.error("Error fetching collaborators:", cError.message);
    else console.log("Columns:", Object.keys(cData[0] || {}).join(', '));
}

checkSchema();
