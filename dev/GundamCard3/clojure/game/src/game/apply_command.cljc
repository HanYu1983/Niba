(ns game.apply-command
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.basic :refer :all]))

(s/def ::game (s/keys :req-un [:game.basic/card-table]))

(def game {:card-table {:card-map {} :card-stack-map {}}})

(defmulti game-cut-in (fn [game effect] (:env game)))
(defmulti game-set-cut-pass (fn [game player-id] (:env game)))

(defn apply-command [game {:keys [player-id payload] :as cmd}]
  (match payload
    {:id :handle-active-effect, :value effect}
    game

    {:id :set-active-effect, :values [effect]}
    (assoc game :active-effect effect)

    ; 所有破壞效果進堆疊, 這時就可以切入破壞無效
    {:id :convert-destroy-effects-to-new-cut, :values destroy-card-ids}
    game

    {:id :set-cut-in, :value effect}
    (game-cut-in game effect)

    {:id :set-pass-cut}
    (game-set-cut-pass game player-id)

    {:id :next-phase, :value phase}
    game

    {:id :handle-phase, :value phase}
    game

    :else
    (throw (ex-info "unknown command" {:command cmd}))))