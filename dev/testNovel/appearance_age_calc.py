import csv
from pathlib import Path

# Current OE years to calculate snapshots for
current_years = [25500, 30000]

roles = [
    {
        'name': '艾琳娜',
        'birth_oe': 24975,
        'stage': '金丹期',
        'last_breakthrough_oe': 25050,
        'appearance_at_breakthrough': 45,
        'aging_factor': 1/50,
        'declared_appearance': '約 45-50 歲',
        'declared_as_of_oe': 25500,
        'notes': '金丹期突破後年輕化，推算 25500 年左右外貌。',
    },
    {
        'name': '陸天行',
        'birth_oe': 24970,
        'stage': '築基期',
        'last_breakthrough_oe': 25000,
        'appearance_at_breakthrough': 30,
        'aging_factor': 1/40,
        'declared_appearance': '約 30 歲',
        'declared_as_of_oe': 25000,
        'notes': '築基期新手，25000 年左右外貌設定。',
    },
    {
        'name': '蘇清月',
        'birth_oe': 24710,
        'stage': '金丹期',
        'last_breakthrough_oe': 24800,
        'appearance_at_breakthrough': 50,
        'aging_factor': 1/50,
        'declared_appearance': '約 48-52 歲',
        'declared_as_of_oe': 25500,
        'notes': '金丹期突破後容顏年輕化至約 50 歲。',
    },
    {
        'name': '李雲鋒',
        'birth_oe': 24680,
        'stage': '元嬰期',
        'last_breakthrough_oe': 24750,
        'appearance_at_breakthrough': 50,
        'aging_factor': 1/100,
        'declared_appearance': '約 50 歲',
        'declared_as_of_oe': 25500,
        'notes': '元嬰期修為，外貌維持穩定、威儀莊重。',
    },
    {
        'name': '趙無極',
        'birth_oe': 24700,
        'stage': '築基期',
        'last_breakthrough_oe': 24900,
        'appearance_at_breakthrough': 80,
        'aging_factor': 1/80,
        'declared_appearance': '約 80 歲',
        'declared_as_of_oe': 25500,
        'notes': '築基期老練者，容貌接近壽命上限。',
    },
    {
        'name': '王清風',
        'birth_oe': 24900,
        'stage': '金丹期',
        'last_breakthrough_oe': 24950,
        'appearance_at_breakthrough': 40,
        'aging_factor': 1/50,
        'declared_appearance': '約 45-50 歲',
        'declared_as_of_oe': 25500,
        'notes': '金丹期突破後外貌年輕化，仍有中年長老氣質。',
    },
    {
        'name': '李玄機',
        'birth_oe': 24800,
        'stage': '元嬰期',
        'last_breakthrough_oe': 24900,
        'appearance_at_breakthrough': 50,
        'aging_factor': 1/100,
        'declared_appearance': '約 55-60 歲',
        'declared_as_of_oe': 25000,
        'notes': '掌門代表元嬰期外貌，較早期設定。',
    },
    {
        'name': '梅林迪斯',
        'birth_oe': 24150,
        'stage': '魔導師',
        'last_breakthrough_oe': 24500,
        'appearance_at_breakthrough': 65,
        'aging_factor': 1/100,
        'declared_appearance': '約 65-70 歲',
        'declared_as_of_oe': 30000,
        'notes': '魔導師/大魔導師外貌，睿智開明。',
    },
    {
        'name': '張無涯',
        'birth_oe': 24750,
        'stage': '金丹期',
        'last_breakthrough_oe': 24850,
        'appearance_at_breakthrough': 55,
        'aging_factor': 1/50,
        'declared_appearance': '約 60 歲',
        'declared_as_of_oe': 25500,
        'notes': '金丹期保守派長老，莊重嚴肅。',
    },
    {
        'name': '陸天行(年輕)',
        'birth_oe': 24970,
        'stage': '築基期',
        'last_breakthrough_oe': 25000,
        'appearance_at_breakthrough': 30,
        'aging_factor': 1/50,
        'declared_appearance': '約 30 歲',
        'declared_as_of_oe': 25000,
        'notes': '築基期新手，外貌設定適配 25000 年故事節點。',
    },
]

OUTPUT_CSV = Path('e:/Vic/Git/Niba/dev/testNovel/appearance_age_check.csv')
with OUTPUT_CSV.open('w', newline='', encoding='utf-8') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow([
        'Role',
        'Birth OE',
        'Current OE',
        'Actual Age',
        'Stage',
        'Last Breakthrough OE',
        'Appearance at Breakthrough',
        'Aging Factor',
        'Computed Appearance Age',
        'Declared Appearance Age',
        'Declared As Of OE',
        'Difference',
        'Notes',
    ])
    for role in roles:
        for current_oe in current_years:
            actual_age = current_oe - role['birth_oe']
            computed = role['appearance_at_breakthrough'] + max(0, current_oe - role['last_breakthrough_oe']) * role['aging_factor']
            diff = ''
            if role['declared_as_of_oe'] == current_oe:
                try:
                    declared_min = int(role['declared_appearance'].split('約 ')[1].split('-')[0].strip())
                    diff = f"{computed - declared_min:.1f}"
                except Exception:
                    diff = ''
            writer.writerow([
                role['name'],
                role['birth_oe'],
                current_oe,
                actual_age,
                role['stage'],
                role['last_breakthrough_oe'],
                role['appearance_at_breakthrough'],
                role['aging_factor'],
                round(computed, 2),
                role['declared_appearance'],
                role['declared_as_of_oe'],
                diff,
                role['notes'],
            ])
print(f'Created {OUTPUT_CSV}')
