(ns gundam.card3.table.engine
  "以 Clara session 對牌堆圖下指令：洗牌、自頂端移牌（一步一指令，避免規則競態）。"
  (:require [clara.rules :as cr]
            [gundam.card3.table.model :refer [->CardStack]]
            [gundam.card3.table.rules :as tr]))

(defn- stacks-from-session [session]
  (into {}
        (map (fn [row]
               ;; Clara 0.24：每列多為「變數→fact」對照圖（或 {:bindings m}）；此 query 僅一個綁定。
               (let [m (if (and (map? row) (:bindings row)) (:bindings row) row)
                     s (first (vals m))]
                 [(:stack-key s) (vec (:ids s))])))
        (cr/query session tr/card-stacks)))

(defn apply-command
  "`stacks` 為 stack-key → [card-id ...]（0 為頂）。`cmd` 為記錄 ShuffleCmd 或 MoveTopCmd。
  回傳新的 stacks map（僅含仍存在的 CardStack）。"
  [stacks cmd]
  (let [facts (concat (map (fn [[k ids]] (->CardStack k (vec ids))) stacks) [cmd])
        session (-> (apply cr/insert (cr/mk-session 'gundam.card3.table.rules) facts)
                    (cr/fire-rules))]
    (stacks-from-session session)))

(defn apply-commands
  "依序套用多個指令（純 reduce）。"
  [stacks cmds]
  (reduce apply-command stacks cmds))
