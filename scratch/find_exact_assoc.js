const fs = require('fs');
const readline = require('readline');

async function findExactAssoc() {
  const stream = fs.createReadStream('C:/Users/Silen/.gemini/antigravity-ide/brain/5aa2988e-b35b-44eb-bc9b-f2d96c3d67c6/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes("faut-il t'associer") && line.includes('lead-text')) {
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        const s = JSON.stringify(tc);
        if (s.includes("faut-il t'associer") && s.includes('lead-text')) {
          fs.writeFileSync('scratch/exact_assoc.txt', tc.args.CodeContent || tc.args.ReplacementContent || s);
          console.log('Saved scratch/exact_assoc.txt at lineNum:', lineNum);
          return;
        }
      }
    }
  }
  console.log('Not found.');
}
findExactAssoc();
