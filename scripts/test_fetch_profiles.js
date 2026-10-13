const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vlpzmxddgdjjtrpbtksd.supabase.co',
  'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF'
);

async function test() {
  const { data, error, count } = await supabase
    .from('profiles')
    .select('id, full_name, role', { count: 'exact' });

  if (error) {
    console.log('Error profiles:', error.message);
  } else {
    console.log('Total profiles count:', count, 'data length:', data ? data.length : 0);
    if (data && data.length > 0) {
      console.log('Sample profile:', data[0]);
    }
  }
}

test();
