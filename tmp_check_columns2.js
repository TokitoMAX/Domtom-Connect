const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function check() {
    const jsPath = 'd:/DomtomConnect-Website/assets/js/territory_config.js';
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    const urlMatch = jsContent.match(/window\.SUPABASE_URL\s*=\s*['"]([^'"]+)['"]/);
    const keyMatch = jsContent.match(/window\.SUPABASE_KEY\s*=\s*['"]([^'"]+)['"]/);
    
    if (urlMatch && keyMatch) {
        const supabase = createClient(urlMatch[1], keyMatch[1]);
        const { data, error } = await supabase.from('events').select('ticket_tiers, agenda').limit(1);
        console.log("events query:", data, error);
    } else {
        console.log("Could not find Supabase credentials");
    }
}

check();
