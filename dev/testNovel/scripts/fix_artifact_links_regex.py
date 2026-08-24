import pathlib
import re

base = pathlib.Path('artifacts')

replacements = [
    (
        re.compile(
            r"## 一、傳說物品（傳說階）.*?## 六、魔法物品煉製體系",
            re.DOTALL,
        ),
        (
            '## 一、傳說物品（傳說階）\n'
            '- [奧術法杖](./奧術法杖.md)\n'
            '- [魔網之心](./魔網之心.md)\n\n'
            '## 二、史詩物品（史詩階）\n'
            '- [元素法杖](./元素法杖.md)\n'
            '- [魔法書](./魔法書.md)\n\n'
            '## 三、進階物品（精煉階）\n'
            '- [基礎法杖](./基礎法杖.md)\n'
            '- [藥劑瓶](./藥劑瓶.md)\n'
            '- [靈魔符典](./靈魔符典.md)\n'
            '- [星輝項鏈](./星輝項鏈.md)\n'
            '- [靈魂水晶](./靈魂水晶.md)\n'
            '- [靈魂寶石](./靈魂寶石.md)\n'
            '- [靈魂聖器](./靈魂聖器.md)\n'
            '- [靈魂神器](./靈魂神器.md)\n'
            '- [魔法陣圖鑑](./魔法陣圖鑑.md)\n\n'
            '## 四、基礎物品（基礎階）\n'
            '- [學徒法杖](./學徒法杖.md)\n'
            '- [儲物戒指](./儲物戒指.md)\n\n'
            '## 五、特殊物品\n'
            '- [禁書區典籍](./禁書區典籍.md)\n'
            '- [魔網節點](./魔網節點.md)\n\n'
            '## 六、魔法物品煉製體系'
        ),
        'arcane-tower-artifacts.md',
    ),
    (
        re.compile(
            r"## 一、鎮派法寶（仙階/天階）.*?## 六、法寶煉製體系",
            re.DOTALL,
        ),
        (
            '## 一、鎮派法寶（仙階/天階）\n'
            '- [凌霄劍](./凌霄劍.md)\n'
            '- [蜀山劍印](./蜀山劍印.md)\n\n'
            '## 二、高階法寶（地階）\n'
            '- [劍池靈劍](./劍池靈劍.md)\n'
            '- [兩儀符甲](./兩儀符甲.md)\n'
            '- [劍心鏡](./劍心鏡.md)\n'
            '- [補魂珠](./補魂珠.md)\n'
            '- [養魂玉](./養魂玉.md)\n'
            '- [輪迴鏡](./輪迴鏡.md)\n\n'
            '## 三、進階法寶（玄階）\n'
            '- [靈劍](./靈劍.md)\n'
            '- [符籙袋](./符籙袋.md)\n'
            '- [陣盤](./陣盤.md)\n'
            '- [陣筆](./陣筆.md)\n'
            '- [傳訊玉簡](./傳訊玉簡.md)\n\n'
            '## 四、基礎法寶（黃階）\n'
            '- [鐵劍](./鐵劍.md)\n'
            '- [儲物袋](./儲物袋.md)\n\n'
            '## 五、特殊法寶\n'
            '- [劍冢名劍](./劍冢名劍.md)\n'
            '- [還魂幡](./還魂幡.md)\n'
            '- [劍池靈水](./劍池靈水.md)\n\n'
            '## 六、法寶煉製體系'
        ),
        'shushan-sword-sect-artifacts.md',
    ),
    (
        re.compile(
            r"## 一、核心融合法寶（天階）.*?## 五、融合法寶煉製體系",
            re.DOTALL,
        ),
        (
            '## 一、核心融合法寶（天階）\n'
            '- [雲魔劍](./雲魔劍.md)\n'
            '- [月華劍](./月華劍.md)\n'
            '- [靈魔劍陣圖](./靈魔劍陣圖.md)\n\n'
            '## 二、進階融合法寶（地階）\n'
            '- [靈魔珠](./靈魔珠.md)\n'
            '- [自然之心](./自然之心.md)\n'
            '- [兩儀符甲（融合版）](./兩儀符甲（融合版）.md)\n'
            '- [冰華符甲](./冰華符甲.md)\n\n'
            '## 三、基礎融合法寶（玄階）\n'
            '- [魔劍](./魔劍.md)\n'
            '- [靈魔儲物袋](./靈魔儲物袋.md)\n\n'
            '## 四、特殊融合法寶\n'
            '- [月華共鳴石](./月華共鳴石.md)\n'
            '- [靈魔劍典（典籍版）](./靈魔劍典（典籍版）.md)\n'
            '- [靈魔陣圖](./靈魔陣圖.md)\n\n'
            '## 五、融合法寶煉製體系'
        ),
        'spellblade-arts-artifacts.md',
    ),
]

for pattern, replacement, filename in replacements:
    path = base / filename
    text = path.read_text(encoding='utf-8')
    if not pattern.search(text):
        print(f'Pattern not found in {filename}')
        continue
    new_text = pattern.sub(replacement, text, count=1)
    path.write_text(new_text, encoding='utf-8')
    print(f'Updated {filename}')
