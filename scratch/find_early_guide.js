const fs = require('fs');
const readline = require('readline');

async function findEarlyGuideTome1() {
  const stream = fs.createReadStream('C:/Users/Silen/.gemini/antigravity-ide/brain/5aa2988e-b35b-44eb-bc9b-f2d96c3d67c6/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes('guide-tome1.js') && line.includes('chapitre-2') && line.includes("Le mur que tu t'es construit")) {
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        if (tc.args && tc.args.TargetFile && tc.args.TargetFile.includes('guide-tome1.js')) {
          console.log('Found guide-tome1.js modification at lineNum:', lineNum);
          fs.writeFileSync('scratch/early_chapters_content.json', JSON.stringify(tc.args, null, 2));
          console.log('Saved scratch/early_chapters_content.json!');
          return;
        }
      }
    }
  }
}
findEarlyGuideTome1();
