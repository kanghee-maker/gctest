const fs = require('fs');

function debugParse(content, filePath) {
    const blocks = content.split(/\*\s*정답\s*:\s*[①②③④⑤12345]/);
    const answersMatches = [...content.matchAll(/\*\s*정답\s*:\s*([①②③④⑤12345])/g)];
    
    console.log(`[${filePath}] Blocks: ${blocks.length}, Answers: ${answersMatches.length}`);
    
    const ansMap = {'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5};
    let savedCount = 0;

    for (let i = 0; i < answersMatches.length; i++) {
        let block = blocks[i].trim();
        const ansChar = answersMatches[i][1];
        const ans = ansMap[ansChar] || 1;

        block = block.replace(/-\s*\d+\s*-/g, '').trim();

        // Relaxed regex: match digit(s) followed by . or ..
        const match = block.match(/(?:^|\n)\s*(\d{1,3})\.?\.\s+([\s\S]*)/) || block.match(/(?:^|\n)\s*(\d{1,3})\.\s+([\s\S]*)/) || block.match(/^(\d{1,3})[\.\s]+([\s\S]*)/);
        
        if (!match) {
            console.log(`[${filePath}] SKIP NO MATCH Q: Block start: ${block.substring(0, 30).replace(/\n/g, ' ')}`);
            continue;
        }

        const qNum = match[1];
        const rest = match[2];

        const optRegex = /([①②③④⑤])\s*(.*?)(?=[①②③④⑤]|$)/gs;
        const optMatches = [...rest.matchAll(optRegex)];

        if (optMatches.length < 2) {
            console.log(`[${filePath}] SKIP NO OPTIONS Q${qNum}: options count ${optMatches.length}`);
            continue;
        }
        savedCount++;
    }
    console.log(`[${filePath}] Total Saved: ${savedCount}`);
}

function main() {
    let raw1Content = "";
    if (fs.existsSync('raw1_part1.txt')) raw1Content += fs.readFileSync('raw1_part1.txt', 'utf-8') + "\n";
    if (fs.existsSync('raw1_part2.txt')) raw1Content += fs.readFileSync('raw1_part2.txt', 'utf-8') + "\n";
    debugParse(raw1Content, 'raw1');

    const raw2Content = fs.existsSync('raw2.txt') ? fs.readFileSync('raw2.txt', 'utf-8') : "";
    if(raw2Content) debugParse(raw2Content, 'raw2');

    const raw3Content = fs.existsSync('raw3.txt') ? fs.readFileSync('raw3.txt', 'utf-8') : "";
    if(raw3Content) debugParse(raw3Content, 'raw3');
}

main();
