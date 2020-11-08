(ns app2.gameplay.phase.hook.animation
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.const :refer [*test]]))

; hook
(defn animate-player-turn-start [ctx]
  (go
    (if *test
      (println "animate-player-turn-start:" (:active-player-key ctx))
      (println "animate-player-turn-start:" (:active-player-key ctx)))))

(defn alert [msg]
  (go
    (if *test
      (println "alert:" msg)
      (println "alert:" msg))))

(defn animate-targeting-aim [ctx args]
  (go
    (if *test
      (println "animate-targeting-aim:")
      (println "animate-targeting-aim:"))))

(defn animate-battle [ctx args]
  (go
    (if *test
      (println "animate-battle:")
      (println "animate-battle:"))))

(defn animate-unit-dead [ctx args]
  (go
    (if *test
      (println "animate-unit-dead:")
      (println "animate-unit-dead:"))))