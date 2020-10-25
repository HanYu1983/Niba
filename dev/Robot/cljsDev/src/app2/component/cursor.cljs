(ns app2.component.cursor
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]])
  (:require [app2.gameplay-spec]))

(defn handle-cursor-component [ctx evt]
  (a/go
    (try
      (s/assert ::app2.gameplay-spec/cursor-component ctx)
      (cond
        (= [:on-click "w"] evt)
        [(update ctx :cursor #(m/add % [0 -1])) nil]

        (= [:on-click "s"] evt)
        [(update ctx :cursor #(m/add % [0 1])) nil]

        (= [:on-click "a"] evt)
        [(update ctx :cursor #(m/add % [-1 0])) nil]

        (= [:on-click "d"] evt)
        [(update ctx :cursor #(m/add % [1 0])) nil]
        
        :else
        [ctx nil])
      (catch js/Error e
        [ctx e]))))