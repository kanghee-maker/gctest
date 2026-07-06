const fs = require('fs');
const path = require('path');

function extractPdfs() {
    const transcriptPath = "C:\\Users\\kahi6\\.gemini\\antigravity\\brain\\17469fea-4051-480d-8725-9791a845f98f\\.system_generated\\logs\\transcript_full.jsonl";
    
    if (!fs.existsSync(transcriptPath)) {
        console.log("Transcript not found.");
        return;
    }

    let content = "";
    const lines = fs.readFileSync(transcriptPath, 'utf-8').split('\n');
    for (const line of lines) {
        if (!line.trim()) continue;
        try {
            const data = JSON.parse(line);
            if (data.type === 'USER_INPUT') {
                content += (data.content || '');
            }
        } catch (e) {
            continue;
        }
    }

    const pdfs = [];
    let startIdx = 0;
    const startMarker = "==Start of PDF==";
    const endMarker = "==End of PDF==";

    while (true) {
        const start = content.indexOf(startMarker, startIdx);
        if (start === -1) break;
        const end = content.indexOf(endMarker, start + startMarker.length);
        if (end === -1) break;
        pdfs.push(content.substring(start + startMarker.length, end));
        startIdx = end + endMarker.length;
    }

    console.log(`Found ${pdfs.length} PDFs in transcript.`);
    
    if (pdfs.length >= 3) {
        fs.writeFileSync('raw2.txt', pdfs[0], 'utf-8');
        fs.writeFileSync('raw3.txt', pdfs[1], 'utf-8');
        fs.writeFileSync('raw1.txt', pdfs[2], 'utf-8');
        console.log("Successfully extracted raw1.txt, raw2.txt, raw3.txt");
    } else {
        console.log("Not enough PDFs found. Check logic.");
    }
}

function parseText(filePath) {
    if (!fs.existsSync(filePath)) return null;
    const content = fs.readFileSync(filePath, 'utf-8');

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
    extractPdfs();
    
    const dataDir = path.join(__dirname, 'src', 'data');
    if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
    }

    const files = [
        { in: 'raw1.txt', out: 'quiz1.json' },
        { in: 'raw2.txt', out: 'quiz2.json' },
        { in: 'raw3.txt', out: 'quiz3.json' }
    ];

    for (const file of files) {
        const qs = parseText(file.in);
        if (qs) {
            const outPath = path.join(dataDir, file.out);
            fs.writeFileSync(outPath, JSON.stringify(qs, null, 2), 'utf-8');
            console.log(`Saved ${qs.length} questions to ${outPath}`);
        }
    }
}

main();
