import json
import os
import re

def extract_pdfs():
    transcript_path = r"C:\Users\kahi6\.gemini\antigravity\brain\17469fea-4051-480d-8725-9791a845f98f\.system_generated\logs\transcript_full.jsonl"
    
    if not os.path.exists(transcript_path):
        print("Transcript not found.")
        return

    content = ""
    with open(transcript_path, 'r', encoding='utf-8') as f:
        for line in f:
            try:
                data = json.loads(line)
                if data.get('type') == 'USER_INPUT':
                    content += data.get('content', '')
            except json.JSONDecodeError:
                continue

    # Find all PDFs
    # There are three PDFs in the text bounded by ==Start of PDF== and ==End of PDF==
    pdfs = []
    start_idx = 0
    while True:
        start_marker = "==Start of PDF=="
        end_marker = "==End of PDF=="
        start = content.find(start_marker, start_idx)
        if start == -1:
            break
        end = content.find(end_marker, start + len(start_marker))
        if end == -1:
            break
        pdfs.append(content[start + len(start_marker):end])
        start_idx = end + len(end_marker)

    print(f"Found {len(pdfs)} PDFs in transcript.")
    
    if len(pdfs) >= 3:
        # Assuming the order in prompt:
        # 1. 2nd test (66 q)
        # 2. 3rd test (111 q)
        # 3. 1st test (168 q)
        with open('raw2.txt', 'w', encoding='utf-8') as f:
            f.write(pdfs[0])
        with open('raw3.txt', 'w', encoding='utf-8') as f:
            f.write(pdfs[1])
        with open('raw1.txt', 'w', encoding='utf-8') as f:
            f.write(pdfs[2])
        print("Successfully extracted raw1.txt, raw2.txt, raw3.txt")
    else:
        print("Not enough PDFs found. Check logic.")

if __name__ == '__main__':
    extract_pdfs()
