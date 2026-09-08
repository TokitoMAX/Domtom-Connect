const fs = require('fs');

function inspectFile(name) {
  const content = fs.readFileSync(name, 'utf8');
  const regex = /"id":\s*"([^"]+)"/g;
  const ids = [];
  let m;
  while ((m = regex.exec(content)) !== null) {
    ids.push(m[1]);
  }
  console.log(name, 'IDs count:', ids.length, 'unique:', [...new Set(ids)]);
}

inspectFile('scratch/saved_from_871.js');
inspectFile('scratch/saved_from_730.js');
inspectFile('scratch/saved_from_1054.js');
inspectFile('scratch/saved_from_1310.js');
