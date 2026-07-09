const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
    const jsPath = 'd:/DomtomConnect-Website/assets/js/territory_config.js';
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const urlMatch = jsContent.match(/window\.SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
    const keyMatch = jsContent.match(/window\.SUPABASE_KEY\s*=\s*['"]([^'"]+)['"]/);
    
    if (urlMatch && keyMatch) {
        const supabase = createClient(urlMatch[1], keyMatch[1]);
        const { data, error } = await supabase.from('conversations').select('id').eq('id', 'mastermind_global').maybeSingle();
        console.log("Conversations:", data, error);
        
        const { data: mData, error: mError } = await supabase.from('messages').select('*').limit(2);
        console.log("Messages table:", mError ? mError : "Exists, " + mData.length + " rows");
    } else {
        console.log("Could not find Supabase credentials");
    }
}

check();
