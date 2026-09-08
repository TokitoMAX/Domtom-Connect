const fs = require('fs');
const readline = require('readline');

async function findAssociation() {
  const stream = fs.createReadStream('C:/Users/Silen/.gemini/antigravity-ide/brain/5aa2988e-b35b-44eb-bc9b-f2d96c3d67c6/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes("faut-il t'associer") && line.includes("chapitre-")) {
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        const s = JSON.stringify(tc);
        if (s.includes("faut-il t'associer")) {
          fs.writeFileSync('scratch/association_chapter.json', JSON.stringify(tc.args, null, 2));
          console.log('Saved scratch/association_chapter.json at lineNum:', lineNum);
          return;
        }
      }
    }
  }
  console.log('Finished without matching tool call.');
}
findAssociation();
