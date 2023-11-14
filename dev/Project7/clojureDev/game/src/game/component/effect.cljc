(ns game.component.effect
  (:require [clojure.spec.alpha :as s]
            [game.define.runtime]
            [game.define.effect]
            [game.component.spec]
            [game.component.cuts]))

(s/def ::spec (s/keys :req-un [:game.component.spec/cuts
                               :game.component.spec/effects]))

(defn get-effects [ctx ids]
  (s/assert ::spec ctx)
  (mapv #((:effects ctx) %) ids))

(defn get-top-cut
  [ctx]
  (s/assert ::spec ctx)
  (-> ctx :cuts first (or []) (#(get-effects ctx %))))

(defn cut-in
  [ctx id effect]
  (s/assert ::spec ctx)
  (-> ctx
      (game.component.cuts/cut-in id)
      (assoc-in [:effects id] effect)))

(defn new-cut
  [ctx id effect]
  (s/assert ::spec ctx)
  (-> ctx
      (game.component.cuts/new-cut id)
      (assoc-in [:effects id] effect)))

(defn map-effects
  [ctx f]
  (s/assert ::spec ctx)
  (update ctx :effects (fn [effects]
                         (->> effects
                              (map (fn [[effect-id effect]] [effect-id (f effect)]))
                              (into {})))))

(defn remove-effect [ctx id]
  (s/assert ::spec ctx)
  (-> ctx
      (game.component.cuts/remove-effect id)
      (update :effects #(dissoc % id))))

(defn- test-get-effects []
  (let [ctx {:cuts []
             :effects {1 :effect1
                       2 :effect2
                       3 :effect3}}]
    (assert (= (get-effects ctx [1 3])
               [:effect1 :effect3]))
    (assert (= (get-effects ctx [])
               []))))

(defn- test-get-top-cut []
  (let [ctx {:cuts [[1 2 3]]
             :effects {1 :effect1
                       2 :effect2
                       3 :effect3}}]
    (assert (= (get-top-cut ctx)
               [:effect1 :effect2 :effect3]))
    (assert (= (get-top-cut {:cuts [] :effects {}})
               []))))

(defn- test-cut-in []
  (let [ctx {:cuts [[1 2 3]]
             :effects {1 :effect1
                       2 :effect2
                       3 :effect3}}
        ctx (cut-in ctx 4 :effect4)]
    (assert (= (:cuts ctx)
               [[4 1 2 3]]))
    (assert (= (:effects ctx)
               {1 :effect1
                2 :effect2
                3 :effect3
                4 :effect4}))))

(defn- test-new-cut []
  (let [ctx {:cuts [[1 2 3]]
             :effects {1 :effect1
                       2 :effect2
                       3 :effect3}}
        ctx (new-cut ctx 4 :effect4)]
    (assert (= (:cuts ctx)
               [[4] [1 2 3]]))
    (assert (= (:effects ctx)
               {1 :effect1
                2 :effect2
                3 :effect3
                4 :effect4}))))

(defn- test-map-effects []
  (let [ctx {:cuts [[1 2 3]]
             :effects {1 1
                       2 2
                       3 3}}
        ctx (map-effects ctx inc)]
    (assert (= (:effects ctx)
               {1 2
                2 3
                3 4}))))

(defn- test-remove-effect []
  (let [ctx {:cuts [[1 2 3] [4 5]]
             :effects {1 :effect1
                       2 :effect2
                       3 :effect3
                       4 :effect4
                       5 :effect5}}]
    (-> ctx
        (remove-effect 2)
        (remove-effect 4)
        (#(= % {:cuts [[1 3] [5]]
                :effects {1 :effect1
                          3 :effect3
                          5 :effect5}}))
        (assert "test-remove-effect test failed"))))

(defn tests []
  (s/check-asserts false)
  (test-cut-in)
  (test-get-effects)
  (test-get-top-cut)
  (test-new-cut)
  (test-map-effects)
  (test-remove-effect)
  (s/check-asserts true))