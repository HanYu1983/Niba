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