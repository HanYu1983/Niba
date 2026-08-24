(ns gundam.card3.table.zones
  "場所（BaSyouKeyword）— 依 gameRule/02-board-and-zones.md、entry.md 與 07 牌桌模型。")

(def ba-syou-keywords
  "程式 `getAll()` 列舉之場所；戦闘エリア1＝地球、戦闘エリア2＝宇宙（見 02）。"
  ["本国"
   "捨て山"
   "取り除かれたカード"
   "Gゾーン"
   "ジャンクヤード"
   "手札"
   "ハンガー"
   "戦闘エリア1"
   "戦闘エリア2"
   "配備エリア"])

(def ^:const play-area-sentinel
  "型別上另見「プレイされているカード」；實際堆疊以 cardStack 為準（02 補遺）。"
  "プレイされているカード")

(defn ba-syou?
  [s]
  (boolean (some #{s} (conj ba-syou-keywords play-area-sentinel))))
