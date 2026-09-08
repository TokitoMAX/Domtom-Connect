const fs = require('fs');
const readline = require('readline');

async function findEarlyChapters() {
  const stream = fs.createReadStream('C:/Users/Silen/.gemini/antigravity-ide/brain/5aa2988e-b35b-44eb-bc9b-f2d96c3d67c6/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (line.includes('chapitre-2') && line.includes("Le mur que tu t'es construit")) {
      console.log('Found full early chapters at lineNum:', lineNum);
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        if (tc.args && (tc.args.CodeContent || tc.args.ReplacementContent)) {
          fs.writeFileSync('scratch/early_chapters.json', JSON.stringify(tc.args, null, 2));
          console.log('Saved scratch/early_chapters.json!');
          return;
        }
      }
    }
  }
  console.log('Finished stream without match.');
}
findEarlyChapters();
