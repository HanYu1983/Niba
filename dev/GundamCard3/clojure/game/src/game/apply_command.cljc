(ns game.apply-command
  (:require [clojure.spec.alpha :as s]
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