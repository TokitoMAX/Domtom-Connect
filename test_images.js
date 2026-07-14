const ids = ['1590602847861-f357a9332bbc', '1516280440502-3c220f188365', '1478737270239-2f02b77fc618', '1451187580459-43490279c0fa', '1460925895917-afdab827c52f', '1504384308090-c894fdcc538d', '1519389950473-47ba0277781c', '1499793983690-e29da59ef1c2', '1507525428034-b723cf961d3e', '1544376798-89aa6b82c6cd', '1589197331516-4b8fa8795c47', '1522071820081-009f0129c71c', '1511632765486-a01980e01a18', '1528605248644-14dd04022da1', '1556761175-5973dc0f32b7', '1454165804606-c3d57bc86b40', '1444653614773-995cb1ef9efa'];

async function test() {
    for (const id of ids) {
        const url = \https://images.unsplash.com/photo-\?auto=format&fit=crop&q=80&w=800\;
        try {
            const res = await fetch(url);
            console.log(id + ' : ' + res.status);
        } catch (e) {
            console.log(id + ' : ERROR');
        }
    }
}
test();
