const urls = [
'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1516280440502-3c220f188365?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1544376798-89aa6b82c6cd?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1589197331516-4b8fa8795c47?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800'
];

async function run() {
    for (let u of urls) {
        try {
            const res = await fetch(u);
            console.log(u.split('photo-')[1].split('?')[0] + ' : ' + res.status);
        } catch (e) {
            console.log('Error ' + u);
        }
    }
}
run();
