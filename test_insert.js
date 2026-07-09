const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://vlpzmxddgdjjtrpbtksd.supabase.co', 'sb_publishable_C87PskG61FXoIIZMZcu8LQ_kH1iFkCF');

async function testInsert() {
    console.log("Testing insert...");
    
    // Using a fake user ID for testing structure, or try to see if 'url' column is missing
    const updateData = { title: "Test", description: "http://test.com", price: 0, status: 'active', category: 'linktree', user_id: '12345678-1234-1234-1234-123456789012' };
    
    const { data, error } = await supabase.from('showcase_items').insert(updateData);
    
    if (error) {
        console.error("Insert error:", error);
    } else {
        console.log("Insert success:", data);
    }
}

testInsert();
