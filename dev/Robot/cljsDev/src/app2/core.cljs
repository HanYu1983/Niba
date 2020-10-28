(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <! >! chan]]
            [app2.tool.const :refer [xf-filter-evt]]))

(defn main []
  (s/check-asserts false)
  (let [input-ch (chan 1 xf-filter-evt)
        _ (go
            (>! input-ch ["KEY_DOWN" 87])
            (>! input-ch ["xx" 0]))
        _ (go
            (println (<! input-ch))
            (println (<! input-ch)))]))

(main)