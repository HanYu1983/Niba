(ns game.impl
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.basic :refer :all]
            [game.data :refer :all]
            [game.query-command :refer :all]))

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


(s/def ::game (s/keys :req-un [:game.basic/card-table]))

(def game {:env :impl
           :card-table {:card-map {} :card-stack-map {}}})

(defmethod game-is-phase :impl [game]
  (:phase game))
(defmethod game-set-tip :impl [game card-id condition-id tip]
  (update-in game [:tips card-id] #(assoc % condition-id tip)))
(defmethod game-get-tip :impl [game card-id condition-id]
  (get-in game [:tips card-id condition-id]))
(defmethod game-get-tips :impl [game card-id]
  (-> (get-in game [:tips card-id] vals)))
(defmethod game-tip-is-ok-to-perform :impl [game tip]
  false)
(defmethod game-get-effect-owner-id :impl [game effect]
  player-a)
(defmethod game-get-effect-card-id :impl [game effect]
  :card-a)
(defmethod game-get-active-effect :impl [game]
  (:active-effect game))
(defmethod game-get-active-player-id :impl [game]
  (:active-player-id game))
(defmethod game-get-immediate-effects :impl [game]
  (-> (:stack-system game) game-get-immediate-effects))
(defmethod game-get-stack-effects :impl [game]
  (-> (:stack-system game) game-get-stack-effects))
(defmethod game-get-player-pass-cut :impl [game player-id]
  ((:player-has-cut game) player-id))

(defn game-query-play-card-effect [game player-id]
  [])
(defn game-query-play-text-effect [game player-id]
  [])
(defn game-query-quick-play-card-effect [game player-id]
  [])
(defmethod game-get-player-can-play-texts :impl [game player-id]
  (let [play-effects (match (game-get-phase game)
                       [:maintenance :free1]
                    ; play g, unit, character, operation
                       (concat (game-query-play-card-effect game player-id)
                    ; play text
                               (game-query-play-text-effect game player-id))

                       (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
                       ; quick
                       (concat (game-query-quick-play-card-effect game player-id)
                               (game-query-play-text-effect game player-id))

                       :else
                       [])]
    play-effects))
(defmethod game-get-effect-owner-id :impl [eff]
  (-> eff :reason :player-id))
(defmethod game-get-phase :impl [game]
  [:battle :attack :start])
(defmethod game-has-handle-phase :impl [game phase]
  true)