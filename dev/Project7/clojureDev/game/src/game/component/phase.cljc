(ns game.component.phase
  (:require [clojure.spec.alpha :as s]
            [game.define.timing]))

(s/def ::timing :game.define.timing/timing)
(s/def ::phase any?)
(s/def ::spec (s/keys :req-un [::phase]))

(defn get-phase [ctx]
  (s/assert ::spec ctx)
  (->> ctx :phase (s/assert ::timing)))

(defn set-phase [ctx timing]
  (s/assert ::spec ctx)
  (s/assert ::timing timing)
  (-> ctx (assoc :phase timing)))

(defn next-phase [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-phase game.define.timing/next-timing ((fn [timing] (set-phase ctx timing)))))

(defn can-play-card-or-text [ctx]
  (s/assert ::spec ctx)
  (->> ctx get-phase (filter #{:free1 :free2}) count pos?))

(defn tests []
  (let [_ (-> {:phase [:maintenance :start]} (set-phase [:reroll :rule]) get-phase (= [:reroll :rule]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:maintenance :start]} next-phase get-phase (= [:maintenance :free1]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:battle :end :turn-end]} next-phase get-phase (= [:reroll :start]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:battle :return :start]} can-play-card-or-text (= false) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:battle :return :free1]} can-play-card-or-text (= true) (or (throw (ex-info "" {}))))]))