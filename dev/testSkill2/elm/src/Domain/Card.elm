module Domain.Card exposing (Card, CardType(..), EmotionalAttribute(..), initialHand, scenarioPool, eventCardPool, zoneCardPool, cardTargetZone, isGlobal, getEventCardByUid)

{-| 卡牌型別與牌庫，對應 Card_Attributes.md、Card_System.md、Initial_Card_Pool.md
-}

import Domain.Map exposing (Zone(..))


type CardType
    = Scenario
    | Event
    | Purify


type EmotionalAttribute
    = LogicBlue
    | ThermalRed
    | OrganicGreen


type alias Card =
    { uid : String
    , name : String
    , cardType : CardType
    , targetZone : Maybe Zone
    , rpYield : Int
    , stabilityCost : Int
    , riotDelta : Int
    , alertDelta : Int
    , emotionalAttribute : Maybe EmotionalAttribute
    , nonDiscardable : Bool
    , flavorText : String
    }


cardTargetZone : Card -> Maybe Zone
cardTargetZone = .targetZone


isGlobal : Card -> Bool
isGlobal c =
    c.targetZone == Nothing


{-| 初始手牌 5 張（Card_System 初始化手牌範例）
-}
initialHand : List Card
initialHand =
    [ card "H-001" "深夜的低語" Scenario (Just Residential) 10 0 0 0 Nothing False "藍光是最好的鎮靜劑。"
    , card "H-002" "過熱的伺服器" Scenario (Just Industrial) 30 -1 0 0 Nothing False "痛覺消失後，生產力將回歸正常。"
    , card "H-003" "遺失的工卡" Scenario (Just Financial) 20 0 2 0 Nothing False "消耗時間，以換取數據的絕對平庸。"
    , card "H-004" "便利店的燈火" Scenario (Just Residential) 15 0 0 0 Nothing False "行為軌跡已鎖定，變數趨近於零。"
    , card "H-005" "廢棄的畫布" Scenario (Just Artistic) 40 0 0 5 Nothing False "寂靜比旋律更易於管理。"
    ]


card : String -> String -> CardType -> Maybe Zone -> Int -> Int -> Int -> Int -> Maybe EmotionalAttribute -> Bool -> String -> Card
card uid name ct zone rp stab riot alert attr nonDisc flavor =
    { uid = uid
    , name = name
    , cardType = ct
    , targetZone = zone
    , rpYield = rp
    , stabilityCost = stab
    , riotDelta = riot
    , alertDelta = alert
    , emotionalAttribute = attr
    , nonDiscardable = nonDisc
    , flavorText = flavor
    }


{-| 基礎情境卡 S-001～S-005（Initial_Card_Pool）
-}
scenarioPool : List Card
scenarioPool =
    [ card "S-001" "深夜的螢幕光" Scenario (Just Residential) 15 0 1 0 Nothing False "藍光是最好的鎮靜劑。"
    , card "S-002" "過期的止痛藥" Scenario (Just Industrial) 20 -1 0 0 Nothing False "痛覺消失後，生產力將回歸正常。"
    , card "S-003" "無意義的會議" Scenario (Just Financial) 25 -1 2 0 Nothing False "消耗時間，以換取數據的絕對平庸。"
    , card "S-004" "壞掉的隨身聽" Scenario (Just Artistic) 10 0 1 0 Nothing False "寂靜比旋律更易於管理。"
    , card "S-005" "重複的通勤路" Scenario Nothing 18 0 0 0 Nothing False "行為軌跡已鎖定，變數趨近於零。"
    ]


{-| 系統事件卡 E-001～E-005，科技解鎖後注入，不可棄置
-}
eventCardPool : List Card
eventCardPool =
    [ card "E-001" "數據冗餘溢出" Event Nothing 0 0 0 0 Nothing True "系統緩衝區已被廢棄情緒填滿。"
    , card "E-002" "邏輯防火牆失效" Event Nothing 0 0 0 10 Nothing True "防禦協議出現未知漏洞。"
    , card "E-003" "情感殘留共振" Event Nothing 0 -5 0 0 Nothing True "提煉過於粗糙，導致情緒回流。"
    , card "E-004" "駭客指令干擾" Event Nothing 0 0 5 0 Nothing True "偵測到來自藝術區的非經授權訪問。"
    , card "E-005" "核心過熱預警" Event Nothing 0 -10 0 0 Nothing True "硬體正在融化，請立即格式化區域。"
    ]


{-| 依 UID 從事件卡池取得一張卡（用於科技節點注入）
-}
getEventCardByUid : String -> Maybe Card
getEventCardByUid uid =
    eventCardPool |> List.filter (\c -> c.uid == uid) |> List.head


{-| 區域專屬高階卡 Z-001～Z-005
-}
zoneCardPool : List Card
zoneCardPool =
    [ card "Z-001" "連鎖清算代碼" Scenario (Just Financial) 100 0 20 0 (Just LogicBlue) False "生成幽藍屬性心魔。"
    , card "Z-002" "廢棄工廠的火花" Scenario (Just Industrial) 80 -5 0 0 (Just ThermalRed) False "生成燥紅屬性武裝工。"
    , card "Z-003" "禁忌的地下畫展" Scenario (Just Artistic) 120 0 0 15 (Just OrganicGreen) False "生成高級反抗者鋼琴家學徒。"
    , card "Z-004" "老街區的強制拆遷" Scenario (Just Residential) 60 0 30 0 (Just ThermalRed) False "大量低階心魔湧入。"
    , card "Z-005" "虛擬偶像崩潰" Scenario Nothing 150 -20 0 0 (Just OrganicGreen) False "引發全球性的情緒海嘯。"
    ]
