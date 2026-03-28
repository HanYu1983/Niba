(ns gundam.card3.table.model)

(defrecord CardStack [stack-key ids])
;; ids：由上而下的順序；index 0 ＝牌堆頂（先抽／先被削），見 gameRule/07。

(defrecord ShuffleCmd [stack-key])
;; 將該堆洗牌（均匀亂序）。

(defrecord MoveTopCmd [from-key to-key n to-position])
;; 自 from 頂端移出 n 張至 to。to-position 為 :bottom（接在目標向量尾端，07 預設）
;; 或 :top（插在目標 index 0，對應 insertId===0 置頂）。
