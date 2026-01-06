# deploy to UnityPlayworks
1. npm i
1. sh build.sh
1. 將index.html, luna.json, playable_health_check.json, playground.json一起打包成zip, 就能在網頁中上傳成功
1. luna.json, playable_health_check.json, playground.json由UnityPlayworks plugin在unity build出來的
## UnityPlayworks
https://playground.lunalabs.io/applications

# development
1. npm i
1. sh run.sh
1. http://localhost:8080/html

# 讓AI產img路徑
## 印出資料夾樹狀結構
    cd html2
    tree assets
    assets
    ├── board_character
    │   ├── bright.png
    │   ├── 〇.png
    │   ├── う.png
    │   ├── き.png
    │   └── ょ.png
    ├── combo
    │   ├── 00_256_332.png
    │   ├── 01_256_332.png
    │   ├── 02_256_332.png
    │   ├── 03_256_332.png
    │   ├── 04_256_332.png
    │   ├── 05_256_332.png
    │   ├── 06_256_332.png
    │   ├── 07_256_332.png
    │   ├── 08_256_332.png
    │   ├── 09_256_332.png
    │   ├── 10_256_332.png
    │   ├── 11_256_332.png
    │   ├── 12_256_332.png
    │   ├── 13_256_332.png
    │   └── 14_256_332.png
    ├── endcard
    │   ├── 01_bg_0_0.png
    │   ├── 02_logo_30_138.png
    │   ├── 03_text_63_864.png
    │   ├── 04_cta_104_1357.png
    │   └── 05_mixi_829_1893.png
    ├── hand_character
    │   ├── う.png
    │   ├── こ.png
    │   ├── し.png
    │   └── ん.png
    ├── playable
    │   ├── 01_bg2_0_0.png
    │   ├── 02_bg1_0_0.png
    │   ├── 03_bg_board_0_1016.png
    │   ├── 04_bg_number_762_218.png
    │   ├── 05_logo_208_20.png
    │   ├── 06_mixi_829_1893.png
    │   ├── 07_telop_bg_0_1756.png
    │   ├── 08_telop_0_1785.png
    │   ├── 09_bg_word_1_1085.png
    │   ├── 10_bg_result_0_0.png
    │   ├── number_dot.png
    │   ├── number_large.png
    │   ├── number_small.png
    │   ├── rank1.png
    │   ├── rank2.png
    │   └── rank3.png
    ├── result
    │   ├── 00_97_496.png
    │   ├── 01_97_496.png
    │   ├── 02_97_496.png
    │   ├── 03_97_496.png
    │   ├── 04_97_496.png
    │   ├── 05_97_496.png
    │   ├── 06_97_496.png
    │   ├── 07_97_496.png
    │   ├── 08_97_496.png
    │   ├── 09_97_496.png
    │   ├── 10_97_496.png
    │   ├── 11_97_496.png
    │   ├── 12_97_496.png
    │   ├── 13_97_496.png
    │   └── 14_97_496.png
    └── tutorial
        ├── 01_bg1_0_0.png
        ├── 02_bg_board_0_1016.png
        ├── 03_bg_word_1_1085.png
        ├── 04_か_-15_1047.png
        ├── 04_ん_130_1047.png
        ├── 04_り_877_1047.png
        ├── 05_256_332.png
        ├── 05_ん_308_1452.png
        ├── 05_と_549_1452.png
        ├── 05_あ_790_1452.png
        ├── 05_ぱ_67_1452.png
        ├── 06_bg2_0_0.png
        ├── 07_logo1_0_32.png
        ├── 07_logo2_208_20.png
        ├── 08_start_79_1305.png
        ├── 08_text1_22_651.png
        ├── 08_text2_24_761.png
        ├── 08_text3_79_550.png
        ├── 08_text4_125_555.png
        ├── 09_mixi_829_1893.png
        ├── 10_guide1_374_1597.png
        ├── 10_guide2_393_1313.png
        ├── 10_guide3_351_1229.png
        ├── 10_guide4_363_1170.png
        ├── 11_game_ready_77_501.png
        └── 11_game_start_105_511.png
## 丟給AI
將以下資料夾結構的所有路徑改為<img src=...>的形式，id填入src，其中的src是從assets開始的相對路徑，src和id的值要加入雙引號變成字串

# PIXI 8 base64
        async function loadImage(key) {
            const dom = document.getElementById(key)
            if (dom == null) {
                throw new Error(`loadImage not found: ${key}`)
            }
            if (dom.src.startsWith("data")) {
                return PIXI.Texture.from(dom)
            }
            return PIXI.Assets.load(dom.src)
        }

# p5 base64
        function loadImage(p, key) {
            const dom = document.getElementById(key)
            if (dom == null) {
            throw new Error(`loadImage not found: ${key}`)
            }
            return p.loadImage(dom.src)
        }