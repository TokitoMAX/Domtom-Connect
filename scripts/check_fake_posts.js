const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://vtdrswqmdjrqjddzhrnt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.log('No supabase key found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkFakePosts() {
  const { data, error } = await supabase
    .from('showcase_items')
    .select('id, title, description, category, user_id')
    .in('category', ['status', 'story']);
    
  if (error) {
    console.error(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

checkFakePosts();
