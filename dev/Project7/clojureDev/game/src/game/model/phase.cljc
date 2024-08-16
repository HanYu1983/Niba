(ns game.model.phase
  (:require [clojure.spec.alpha :as s]
            [game.model-spec.core]
            [game.define.timing]))

(defn get-phase [ctx]
  (s/assert :game.model-spec.core/has-phase ctx)
  (->> ctx :phase (s/assert :game.define.timing/timing)))

(defn set-phase [ctx timing]
  (s/assert :game.model-spec.core/has-phase ctx)
  (s/assert :game.define.timing/timing timing)
  (-> ctx (assoc :phase timing)))

(defn next-phase [ctx]
  (s/assert :game.model-spec.core/has-phase ctx)
  (-> ctx get-phase game.define.timing/next-timing ((fn [timing] (set-phase ctx timing)))))

(defn tests []
  (let [_ (-> {:phase [:maintenance :start]} (set-phase [:reroll :rule]) get-phase (= [:reroll :rule]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:maintenance :start]} next-phase get-phase (= [:maintenance :free1]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:battle :end :turn-end]} next-phase get-phase (= [:reroll :start]) (or (throw (ex-info "" {}))))]))