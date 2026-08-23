(ns gundam.card3.table.stack-key
  "牌堆鍵與 07 一致：JSON 陣列字串 `[PlayerID,BaSyouKeyword]`（無空格）。")

(defn stack-key
  "例如 PlayerA + 本国 → [\"PlayerA\",\"本国\"]"
  [^String player-id ^String zone]
  (str "[\"" player-id "\",\"" zone "\"]"))

(def player-a "PlayerA")
(def player-b "PlayerB")
