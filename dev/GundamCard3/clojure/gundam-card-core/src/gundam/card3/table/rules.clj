(ns gundam.card3.table.rules
  (:require [clara.rules :refer [defquery defrule insert-unconditional! retract!]]
            [gundam.card3.table.model :refer [->CardStack]])
  (:import [gundam.card3.table.model CardStack MoveTopCmd ShuffleCmd]))

(defquery card-stacks []
  [?s <- CardStack])

(defrule apply-shuffle
  "處理 ShuffleCmd：撤銷舊堆、插入洗牌後向量（規則書 prepareDeck 等）。"
  {:salience 100}
  [?cmd <- ShuffleCmd (= stack-key ?k)]
  [?cs <- CardStack (= stack-key ?k)]
  =>
  (retract! ?cmd ?cs)
  ;; 結論不可使用邏輯 insert!：LHS 已 retract 後真理維護會一併撤銷新堆。
  (insert-unconditional! (->CardStack ?k (vec (shuffle (:ids ?cs))))))

(defrule apply-move-top-append
  "預設移動：新牌接在目標陣列尾端（TableFns.moveCard 預設）。"
  {:salience 50}
  [?m <- MoveTopCmd (= from-key ?fk) (= to-key ?tk) (= n ?n) (= to-position :bottom)]
  [?from <- CardStack (= stack-key ?fk)]
  [?to <- CardStack (= stack-key ?tk)]
  =>
  (let [ids (:ids ?from)
        n-take (min (max 0 ?n) (count ids))]
    (if (pos? n-take)
      (let [moving (vec (take n-take ids))
            rest-from (vec (drop n-take ids))
            to-ids (:ids ?to)
            new-to (vec (concat to-ids moving))]
        (retract! ?m ?from ?to)
        (insert-unconditional! (->CardStack ?fk rest-from))
        (insert-unconditional! (->CardStack ?tk new-to)))
      (retract! ?m))))

(defrule apply-move-top-prepend
  "置頂插入：對應 insertId===0（本国傷害／回復等置頂語意）。"
  {:salience 50}
  [?m <- MoveTopCmd (= from-key ?fk) (= to-key ?tk) (= n ?n) (= to-position :top)]
  [?from <- CardStack (= stack-key ?fk)]
  [?to <- CardStack (= stack-key ?tk)]
  =>
  (let [ids (:ids ?from)
        n-take (min (max 0 ?n) (count ids))]
    (if (pos? n-take)
      (let [moving (vec (take n-take ids))
            rest-from (vec (drop n-take ids))
            to-ids (:ids ?to)
            new-to (vec (concat moving to-ids))]
        (retract! ?m ?from ?to)
        (insert-unconditional! (->CardStack ?fk rest-from))
        (insert-unconditional! (->CardStack ?tk new-to)))
      (retract! ?m))))
