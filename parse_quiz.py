import json
import re
import os

def parse_text(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Regex to find questions
    # Format: "01. 어쩌고 저쩌고" or "1. 어쩌고"
    # Options: "① ... ② ..."
    # Answer: "* 정답: ⑤" or "*정답: 5"
    
    questions = []
    
    # Split by numbers followed by dot and space/newline, ensuring it's a new question
    # A robust way is to find all occurrences of "정답:" to split the blocks.
    blocks = re.split(r'\*\s*정답\s*:\s*[①②③④⑤12345]', content)
    
    # We need the answer as well, so let's find answers first
    answers_matches = re.findall(r'\*\s*정답\s*:\s*([①②③④⑤12345])', content)
    
    if len(blocks) - 1 != len(answers_matches):
        print(f"Mismatch in {file_path}: {len(blocks)-1} blocks, {len(answers_matches)} answers")
    
    for i in range(len(answers_matches)):
        block = blocks[i].strip()
        ans_char = answers_matches[i].strip()
        
        # Mapping answer to integer
        ans_map = {'①': 1, '②': 2, '③': 3, '④': 4, '⑤': 5, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5}
        ans = ans_map.get(ans_char, 1)
        
        # Clean block (remove page numbers like "- 1 -")
        block = re.sub(r'-\s*\d+\s*-', '', block).strip()
        
        # Find the start of the question (e.g., "01.", "1.", "12.")
        match = re.search(r'(?:^|\n)\s*(\d{1,3})\.\s+(.*)', block, re.DOTALL)
        if not match:
            continue
            
        q_num = match.group(1)
        rest = match.group(2)
        
        # Extract options
        # Options start with ①, ②, ③, ④, ⑤
        opt_matches = list(re.finditer(r'([①②③④⑤])\s*(.*?)(?=[①②③④⑤]|$)', rest, re.DOTALL))
        
        if len(opt_matches) < 2:
            continue
            
        q_text = rest[:opt_matches[0].start()].strip()
        
        options = []
        for opt_match in opt_matches:
            opt_text = opt_match.group(2).strip()
            # Clean up newlines in options
            opt_text = re.sub(r'\s*\n\s*', ' ', opt_text)
            options.append(opt_text)
            
        # Clean up question text
        q_text = re.sub(r'\s*\n\s*', ' ', q_text)
        
        # Generate explanation
        # Extract subject if possible (e.g., words in 「 」, " ", or ' ')
        subject_match = re.search(r'[「"\'⌜](.+?)[」"\'⌟]', q_text)
        subject = subject_match.group(1) if subject_match else "제시된 내용"
        
        is_incorrect = "않은" in q_text or "틀린" in q_text or "없는" in q_text
        
        if len(options) >= ans:
            correct_opt_text = options[ans-1]
            if is_incorrect:
                explanation = f"해설: 본 문항은 「{subject}」에 대한 이해도를 묻는 문제입니다. 정답은 {ans}번입니다. {ans}번 보기('{correct_opt_text}')는 관련 규정에 어긋나는 잘못된 설명입니다. 반면, 나머지 보기들은 모두 올바른 설명이므로 함께 숙지하시기 바랍니다."
            else:
                explanation = f"해설: 본 문항은 「{subject}」에 대한 이해도를 묻는 문제입니다. 정답은 {ans}번입니다. {ans}번 보기('{correct_opt_text}')만이 관련 법령 및 규정에 부합하는 올바른 설명이며, 나머지 보기들은 일부 내용이 사실과 다르게 기재되어 있습니다."
        else:
            explanation = f"해설: 정답은 {ans}번입니다. 관련 규정을 다시 한번 확인해 보시기 바랍니다."

        questions.append({
            "id": int(q_num),
            "question": q_text,
            "options": options,
            "answer": ans,
            "explanation": explanation
        })
        
    return questions

def main():
    os.makedirs('src/data', exist_ok=True)
    
    files = [
        ('raw1.txt', 'quiz1.json'), # 168 questions
        ('raw2.txt', 'quiz2.json'), # 66 questions
        ('raw3.txt', 'quiz3.json')  # 111 questions
    ]
    
    for in_f, out_f in files:
        if os.path.exists(in_f):
            print(f"Parsing {in_f}...")
            qs = parse_text(in_f)
            out_path = os.path.join('src/data', out_f)
            with open(out_path, 'w', encoding='utf-8') as f:
                json.dump(qs, f, ensure_ascii=False, indent=2)
            print(f"Saved {len(qs)} questions to {out_path}")
        else:
            print(f"File {in_f} not found.")

if __name__ == '__main__':
    main()
