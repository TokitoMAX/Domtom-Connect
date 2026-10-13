const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vlpzmxddgdjjtrpbtksd.supabase.co',
  'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF'
);

async function check() {
  const { data, error } = await supabase.from('profiles').select('*').limit(3);
  if (error) console.log(error);
  else console.log(Object.keys(data[0]), data[0]);
}

check();
