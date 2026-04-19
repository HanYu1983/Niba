(ns game.core
  (:require [game.basic :refer :all]
            [game.command :refer :all]))

; ===============================

(defmethod runtime-get-card-id :default [runtime]
  "runtime-card-id")

(defmethod game-set-tip :default [game card-id condition-id tip]
  (println "game-set-tip " card-id condition-id tip)
  (update-in game [:tips card-id condition-id] (constantly tip)))

(defmethod game-get-tip :default [game card-id condition-id]
  (get-in game [:tips card-id condition-id]))

(defmethod game-get-tips :default [game card-id]
  (get-in game [:tips card-id]))

(defmethod game-tip-is-ok-to-perform :default [game tip]
  true)

(defmethod game-get-active-effect :default [game]
  (effect-create "eff-id" {:player-id player-a} :text)
  nil)
(defmethod game-get-active-player-id :default [game] player-a)
(defmethod game-get-immediate-effects :default [game] [])
(defmethod game-get-stack-effects :default [game] [])
(defmethod game-get-player-pass-cut :default [game player-id] false)
(defmethod game-get-player-can-play-texts :default [game player-id] [])

(defmethod effect-reason-get-owner-id :default [eff] 
  (println "effect-reason-get-owner-id" eff)
  (:player-id eff))

(defn -main [args]
  (test-text)
  (test-query-command {}))