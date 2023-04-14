(ns game.component.cuts
  (:require [clojure.spec.alpha :as s]
            [game.component.spec]))

(s/def ::spec (s/keys :req-un [:game.component.spec/cuts]))

(defn get-top-cut
  "取得最新的切入"
  [ctx]
  (s/assert ::spec ctx)
  (-> ctx :cuts first (or [])))

(defn cut-in
  "切入效果, 切入位置必須在最新的切入的堆裡"
  [ctx effect]
  (s/assert ::spec ctx)
  (update ctx :cuts (fn [cuts]
                      (into [] (cons (into [] (cons effect (first cuts)))
                                     (rest cuts))))))
(defn new-cut
  "新的切入"
  [ctx effect]
  (s/assert ::spec ctx)
  (update ctx :cuts #(cons [effect] %)))

; ============= test ===========
(defn- test-get-top-cut []
  (let [ctx {:cuts [[1 2 3]]}]
    (assert (= (get-top-cut ctx) [1 2 3])
            "get-top-cut test failed")))

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
  (test-get-top-cut)
  (test-cut-in)
  (test-new-cut))