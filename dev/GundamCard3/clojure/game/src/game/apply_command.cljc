(ns game.apply-command
  (:require [game.basic :refer :all]))

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