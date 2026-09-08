const fs = require('fs');
const readline = require('readline');

async function findAssocEarly() {
  const stream = fs.createReadStream('C:/Users/Silen/.gemini/antigravity-ide/brain/5aa2988e-b35b-44eb-bc9b-f2d96c3d67c6/.system_generated/logs/transcript_full.jsonl');
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });

  let lineNum = 0;
  for await (const line of rl) {
    lineNum++;
    if (lineNum < 600 && line.includes("faut-il t'associer") && line.includes('replace_file_content')) {
      const parsed = JSON.parse(line);
      for (const tc of parsed.tool_calls || []) {
        if (tc.name === 'replace_file_content' && tc.args.ReplacementContent && tc.args.ReplacementContent.includes("faut-il t'associer")) {
          fs.writeFileSync('scratch/early_assoc_content.txt', tc.args.ReplacementContent);
          console.log('Saved early_assoc_content.txt from lineNum:', lineNum);
          return;
        }
      }
    }
  }
}
findAssocEarly();
