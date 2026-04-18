(ns game.core
  (:require [game.basic :refer :all]))

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

(defn -main [args]
  (game.basic/test-text))