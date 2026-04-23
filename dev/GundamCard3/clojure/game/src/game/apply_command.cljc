(ns game.apply-command
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.basic :refer :all]))

(defmulti game-move-top-card (fn [game from to n] (:env game)))
(defmulti game-get-setgroups-from-tip (fn [game tip] (:env game)))
(defmulti game-move-setgroups (fn [game to setgroups] (:env game)))
(defmulti game-create-can-attack-tip (fn [game where] (:env game)))

(defn draw-phase-rule-effect-create [player-id]
  {:id :draw-phase-rule-effect-create
   :reason {:type :rule, :player-id player-id}
   :text {:actions [{:action-script `(fn [~'game ~'effect ~'tips]
                                       (game-move-top-card ~'game
                                                           [~player-id :hon-goku]
                                                           [~player-id :te-hu-ta]
                                                           1))}]}})

(defn attack-phase-rule-effect-create [player-id]
  {:id :attack-phase-rule-effect-create
   :reason {:type :rule, :player-id player-id}
   :text {:actions [{:conditions [{:id :attack-space
                                   :tip-script `(fn [~'game ~'effect]
                                                  (game-create-can-attack-tip ~'game :space-area))
                                   :action-script `(fn [~'game ~'effect ~'tip]
                                                     (let [~'pairs (game-get-setgroups-from-tip ~'game ~'tip)
                                                           ~'game (game-move-setgroups game
                                                                                       [~player-id :space-area]
                                                                                       pairs)]
                                                       ~'game))}
                                  {:id :attack-earth
                                   :tip-script `(fn [~'game ~'effect]
                                                  (game-create-can-attack-tip ~'game :earth-area))
                                   :action-script `(fn [~'game ~'effect ~'tip]
                                                     (let [~'pairs (game-get-setgroups-from-tip ~'game ~'tip)
                                                           ~'game (game-move-setgroups game
                                                                                       [~player-id :earth-area]
                                                                                       pairs)]
                                                       ~'game))}]}]}})


(defmethod game-get-effect-card-id :game.apply-command [game eff]
  "runtime-card-id")

(defmethod game-move-top-card :game.apply-command [game from to n]
  game)
(defmethod game-get-setgroups-from-tip :game.apply-command [game tip]
  game)
(defmethod game-move-setgroups :game.apply-command [game to setgroups]
  game)
(defmethod game-create-can-attack-tip  :game.apply-command [game where]
  game)
(defmethod game-get-tips :game.apply-command [game card-id]
  game)

(defn test-rules []
  (let [eff (draw-phase-rule-effect-create player-a)
        _ (s/assert :game.basic/effect eff)
        _ (println eff)
        game {:env :game.apply-command}
        game (-> (effect-get-text eff) (text-get-action 0) (action-evaluate-conditions game eff))]))



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