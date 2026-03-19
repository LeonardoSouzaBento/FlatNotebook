import os
import re

ui_dir = r"c:\Users\souza\Desktop\projetos2\flatnotebook\src\ui"
search_dirs = [
    r"c:\Users\souza\Desktop\projetos2\flatnotebook\src\ui",
    r"c:\Users\souza\Desktop\projetos2\flatnotebook\src\pages",
    r"c:\Users\souza\Desktop\projetos2\flatnotebook\src\components"
]

ui_files = [f for f in os.listdir(ui_dir) if f.endswith(('.ts', '.tsx')) and f != 'index.ts']

# Function to get capitalized name from slug
def to_camel(slug):
    return "".join(word.capitalize() for word in slug.split("-"))

ui_data = []
for f in ui_files:
    stem = os.path.splitext(f)[0]
    ui_data.append({
        'file': f,
        'path': os.path.normpath(os.path.join(ui_dir, f)),
        'stem': stem,
        'capitalized': to_camel(stem),
        'usages': 0
    })

for s_dir in search_dirs:
    for root, _, files in os.walk(s_dir):
        for f in files:
            if not f.endswith(('.ts', '.tsx')): continue
            fpath = os.path.normpath(os.path.join(root, f))
            try:
                with open(fpath, 'r', encoding='utf-8', errors='ignore') as content_f:
                    content = content_f.read()
                    for item in ui_data:
                        if fpath == item['path']:
                            continue
                        # Search for import or JSX usage
                        # Specifically look for "@/ui/stem" or capitalized usage
                        if (item['stem'] in content) or (item['capitalized'] in content):
                            item['usages'] += 1
            except:
                continue

print("--- USAGE REPORT ---")
unused = []
for item in ui_data:
    if item['usages'] == 0:
        unused.append(item['file'])
    print(f"{item['file']}: {item['usages']} usages")

print("\n--- UNUSED FILES ---")
for f in unused:
    print(f)
