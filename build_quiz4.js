const fs = require('fs');

function parseQuiz4() {
    const rawTxt = fs.readFileSync('raw4.txt', 'utf-8');
    const ex4Txt = fs.readFileSync('ex4.txt', 'utf-8');

    // Parse questions from raw4.txt
    // Regex for blocks: 
    // (\d{2})\.\s*([\s\S]*?)(?=①)
    // ①\s*([\s\S]*?)(?=②)
    // ②\s*([\s\S]*?)(?=③)
    // ③\s*([\s\S]*?)(?=④)
    // ④\s*([\s\S]*?)(?=⑤)
    // ⑤\s*([\s\S]*?)(?=\[정답\])
    // \[정답\]\s*([①②③④⑤])
    
    const blockRegex = /(\d{2})\.\s*([\s\S]*?)(?=①)①\s*([\s\S]*?)(?=②)②\s*([\s\S]*?)(?=③)③\s*([\s\S]*?)(?=④)④\s*([\s\S]*?)(?=⑤)⑤\s*([\s\S]*?)(?=\[정답\])\[정답\]\s*([①②③④⑤])/g;
    
    const answerMap = { '①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5 };

    const questions = [];
    const matches = [...rawTxt.matchAll(blockRegex)];

    for (const match of matches) {
        const id = parseInt(match[1]);
        const questionText = match[2].trim();
        const options = [
            match[3].trim(),
            match[4].trim(),
            match[5].trim(),
            match[6].trim(),
            match[7].trim()
        ];
        const answer = answerMap[match[8]];
        
        questions.push({
            id,
            question: questionText,
            options,
            answer,
            explanation: `해설: (기본 해설입니다.)` // Will be replaced
        });
    }

    // Now merge explanations from ex4.txt
    // Format: 01. <...>정답: ④  해설:이중부정문은 의미를 혼동시키거나...
    // Let's split by "해설:" and match to question IDs
    // Example: "01. <알기 쉬운...정답: ④  해설:이중부정문은..."
    // Wait, let's just split ex4.txt by /(\d{2})\.\s*/
    
    const exMatches = [...ex4Txt.matchAll(/(\d{2})\.\s*[\s\S]*?해설:\s*([\s\S]*?)(?=(?:\d{2}\.\s*|$))/g)];
    
    for (const exMatch of exMatches) {
        const id = parseInt(exMatch[1]);
        const explText = exMatch[2].trim();
        
        const q = questions.find(q => q.id === id);
        if (q) {
            // Include the extra options explanation if present, but since we just want the explanation part, we take everything up to the next question.
            q.explanation = '해설: ' + explText;
        }
    }

    fs.writeFileSync('src/data/quiz4.json', JSON.stringify(questions, null, 2), 'utf-8');
    console.log(`Parsed ${questions.length} questions from raw4.txt`);
    console.log(`Merged ${exMatches.length} explanations from ex4.txt`);
}

parseQuiz4();
