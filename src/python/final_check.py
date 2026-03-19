import os
import re

ui_dir = r"c:\Users\souza\Desktop\projetos2\flatnotebook\src\ui"
src_dir = r"c:\Users\souza\Desktop\projetos2\flatnotebook\src"

ui_files = [f for f in os.listdir(ui_dir) if f.endswith(('.ts', '.tsx')) and f != 'index.ts']

all_src_files = []
for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(('.ts', '.tsx')):
            all_src_files.append(os.path.normpath(os.path.join(root, f)))

def to_camel(slug):
    if slug == 'input-otp': return 'InputOTP'
    return "".join(word.capitalize() for word in slug.split("-"))

unused = []
for f in ui_files:
    stem = os.path.splitext(f)[0]
    path = os.path.normpath(os.path.join(ui_dir, f))
    cap = to_camel(stem)
    
    found = False
    for src_f in all_src_files:
        if src_f == path: continue
        try:
            with open(src_f, 'r', encoding='utf-8', errors='ignore') as cf:
                content = cf.read()
                if (f'ui/{stem}' in content) or (f'./{stem}' in content) or (re.search(r'\b' + re.escape(cap) + r'\b', content)):
                    found = True
                    break
        except: continue
    if not found:
        unused.append(f)

for u in sorted(unused):
    print(u)
