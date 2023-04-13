(ns game.component.cuts
  (:require [clojure.spec.alpha :as s]
            [game.component.spec]))

(s/def ::spec (s/keys :req-un [:game.component.spec/cuts]))

(def cuts {:cuts [[]]})

(defn get-top-cut
  "取得最新的切入"
  [ctx]
  (-> ctx :cuts first (or [])))

(defn map-top-cut
  "映射最新的切入. 如果堆疊為空, 吐出錯誤"
  [ctx f]
  (when (-> ctx :cuts count (= 0))
    (throw (Exception. "cuts.length is 0")))
  (update-in ctx [:cuts 0] f))

(defn cut-in
  "切入效果, 切入位置必須在最新的切入的堆裡"
  [ctx block]
  (map-top-cut ctx #(cons block %)))

(defn new-cut
  "新的切入"
  [ctx block]
  (update ctx :cuts #(cons [block] %)))

; ============= test ===========
(defn- test-get-top-cut []
  (let [ctx {:cuts [[1 2 3]]}]
    (assert (= (get-top-cut ctx) [1 2 3])
            "get-top-cut test failed")))

(defn- test-map-top-cut []
  (let [ctx {:cuts [[1 2 3]]}]
    (-> ctx
        (map-top-cut (fn [c] (rest c)))
        (#(= (get-top-cut %) [2 3]))
        (assert "map-top-cut test failed"))))

(defn- test-cut-in []
  (let [ctx {:cuts [[1 2 3]]}]
    (-> ctx
        (cut-in 4)
        (#(= (get-top-cut %) [4 1 2 3]))
        (assert "cut-in test failed"))))

(defn- test-new-cut []
  (let [ctx {:cuts [[1 2 3]]}]
    (-> ctx
        (new-cut 4)
        (#(= (get-top-cut %) [4]))
        (assert "new-cut test failed"))))

(defn tests []
  (s/assert ::spec cuts)
  (test-get-top-cut)
  (test-map-top-cut)
  (test-cut-in)
  (test-new-cut))