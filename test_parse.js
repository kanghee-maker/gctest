const fs = require('fs');

function parseText(content, filePath) {
    const blocks = content.split(/(?:\*\s*)?정답\s*:\s*[①②③④⑤12345]/);
    const answersMatches = [...content.matchAll(/(?:\*\s*)?정답\s*:\s*([①②③④⑤12345])/g)];
    
    let saved = 0;
    for (let i = 0; i < answersMatches.length; i++) {
        let block = blocks[i].trim();
        block = block.replace(/-\s*\d+\s*-/g, '').trim();
        block = block.replace(/\(정정\)\s*/g, '');
        block = block.replace(/\(.*?삭제.*?\)/g, '');

        const match = block.match(/(?:^|\n)\s*(\d{1,3})\.?\.\s+([\s\S]*)/) || block.match(/^(\d{1,3})[\.\s]+([\s\S]*)/);
        if (!match) {
            console.log(`[${filePath}] NO MATCH:`, block.substring(0, 40).replace(/\n/g, ' '));
            continue;
        }

        const qNum = match[1];
        const rest = match[2];

        const optRegex = /([①②③④⑤])\s*(.*?)(?=[①②③④⑤]|$)/gs;
        const optMatches = [...rest.matchAll(optRegex)];

        if (optMatches.length < 2) {
            console.log(`[${filePath}] NO OPTS:`, qNum);
            continue;
        }
        saved++;
    }
    console.log(`[${filePath}] Saved: ${saved}`);
}

const raw3Content = fs.readFileSync('raw3.txt', 'utf-8');
parseText(raw3Content, 'raw3');
