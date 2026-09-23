import csv
import json
import os

csv_path = '식품의약품안전처_통합식품영양성분정보(음식).csv'
js_path = 'data.js'

data = []
seen_names = set()

with open(csv_path, 'r', encoding='utf-8') as f:
    reader = csv.reader(f)
    headers = next(reader)
    
    # Indices based on header inspection
    idx_name = 1
    idx_origin = 5
    idx_kcal = 17
    idx_protein = 19
    idx_fat = 20
    idx_carbs = 22

    for row in reader:
        if len(row) < 23:
            continue
            
        base_name = row[idx_name].strip()
        origin = row[idx_origin].strip()
        
        # Some foods have the same name, we can append origin to make them unique
        # e.g., "흰죽 (초등학교급식)"
        name = f"{base_name} ({origin})" if origin else base_name
        
        # To avoid massive file size, let's just keep unique names
        if name in seen_names:
            continue
        seen_names.add(name)
        
        try:
            kcal = float(row[idx_kcal]) if row[idx_kcal] else 0
            protein = float(row[idx_protein]) if row[idx_protein] else 0
            fat = float(row[idx_fat]) if row[idx_fat] else 0
            carbs = float(row[idx_carbs]) if row[idx_carbs] else 0
        except ValueError:
            continue
            
        data.append({
            'name': name,
            'kcal': kcal,
            'carbs': carbs,
            'protein': protein,
            'fat': fat
        })

print(f"Processed {len(data)} unique food items.")

with open(js_path, 'w', encoding='utf-8') as f:
    f.write('const nutritionData = ')
    json.dump(data, f, ensure_ascii=False, separators=(',', ':'))
    f.write(';\n')

print("Saved to data.js")
