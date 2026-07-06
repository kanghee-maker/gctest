const fs = require('fs');
const path = require('path');

function parseText(content, filePath) {
    const questions = [];
    const blocks = content.split(/\*\s*정답\s*:\s*[①②③④⑤12345]/);
    
    const answersMatches = [...content.matchAll(/\*\s*정답\s*:\s*([①②③④⑤12345])/g)];
    
    if (blocks.length - 1 !== answersMatches.length) {
        console.log(`Mismatch in ${filePath}: ${blocks.length - 1} blocks, ${answersMatches.length} answers`);
    }

    const ansMap = {'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5};

    for (let i = 0; i < answersMatches.length; i++) {
        let block = blocks[i].trim();
        const ansChar = answersMatches[i][1];
        const ans = ansMap[ansChar] || 1;

        // Clean page numbers
        block = block.replace(/-\s*\d+\s*-/g, '').trim();

        // Match start of question
        const match = block.match(/(?:^|\n)\s*(\d{1,3})\.\s+([\s\S]*)/);
        if (!match) continue;

        const qNum = match[1];
        const rest = match[2];

        // Find options
        const optRegex = /([①②③④⑤])\s*(.*?)(?=[①②③④⑤]|$)/gs;
        const optMatches = [...rest.matchAll(optRegex)];

        if (optMatches.length < 2) continue;

        let qText = rest.substring(0, optMatches[0].index).trim();

        const options = [];
        for (const optMatch of optMatches) {
            let optText = optMatch[2].trim();
            optText = optText.replace(/\s*\n\s*/g, ' ');
            options.push(optText);
        }

        qText = qText.replace(/\s*\n\s*/g, ' ');

        const subjectMatch = qText.match(/[「"'⌜](.+?)[」"'⌟]/);
        const subject = subjectMatch ? subjectMatch[1] : "제시된 내용";

        const isIncorrect = qText.includes("않은") || qText.includes("틀린") || qText.includes("없는");
        let explanation = "";

        if (options.length >= ans) {
            const correctOptText = options[ans - 1];
            if (isIncorrect) {
                explanation = `해설: 본 문항은 「${subject}」에 대한 이해도를 묻는 문제입니다. 정답은 ${ans}번입니다. ${ans}번 보기('${correctOptText}')는 관련 규정에 어긋나는 잘못된 설명입니다. 반면, 나머지 보기들은 모두 올바른 설명이므로 함께 숙지하시기 바랍니다.`;
            } else {
                explanation = `해설: 본 문항은 「${subject}」에 대한 이해도를 묻는 문제입니다. 정답은 ${ans}번입니다. ${ans}번 보기('${correctOptText}')만이 관련 법령 및 규정에 부합하는 올바른 설명이며, 나머지 보기들은 일부 내용이 사실과 다르게 기재되어 있습니다. 해당 규정의 정확한 요건과 기준을 명확히 정리해두는 것이 중요합니다.`;
            }
        } else {
            explanation = `해설: 정답은 ${ans}번입니다. 관련 규정을 다시 한번 확인해 보시기 바랍니다.`;
        }

        questions.push({
            id: parseInt(qNum, 10),
            question: qText,
            options: options,
            answer: ans,
            explanation: explanation
        });
    }
    
    return questions;
}

function main() {
    const dataDir = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    // Combine raw1
    let raw1Content = "";
    if (fs.existsSync('raw1_part1.txt')) raw1Content += fs.readFileSync('raw1_part1.txt', 'utf-8') + "\n";
    if (fs.existsSync('raw1_part2.txt')) raw1Content += fs.readFileSync('raw1_part2.txt', 'utf-8') + "\n";
    
    const qs1 = parseText(raw1Content, 'raw1');
    fs.writeFileSync(path.join(dataDir, 'quiz1.json'), JSON.stringify(qs1, null, 2), 'utf-8');
    console.log(`Saved ${qs1.length} questions to quiz1.json`);

    const raw2Content = fs.existsSync('raw2.txt') ? fs.readFileSync('raw2.txt', 'utf-8') : "";
    const qs2 = parseText(raw2Content, 'raw2');
    fs.writeFileSync(path.join(dataDir, 'quiz2.json'), JSON.stringify(qs2, null, 2), 'utf-8');
    console.log(`Saved ${qs2.length} questions to quiz2.json`);

    const raw3Content = fs.existsSync('raw3.txt') ? fs.readFileSync('raw3.txt', 'utf-8') : "";
    const qs3 = parseText(raw3Content, 'raw3');
    fs.writeFileSync(path.join(dataDir, 'quiz3.json'), JSON.stringify(qs3, null, 2), 'utf-8');
    console.log(`Saved ${qs3.length} questions to quiz3.json`);
}

main();
