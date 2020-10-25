(ns app2.phase.player-turn
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]])
  (:require-macros [app2.macros :refer [async->]]))

(defn player-turn [ctx input-ch]
  (a/go
    (try
      (loop [ctx ctx]
        (let [evt (a/<! input-ch)
              _ (when (nil? evt)
                  (throw (js/Error. "close")))
              ctx (async-> ctx
                           (handle-cursor-component evt))
              ctx (if (fn? evt)
                    (evt ctx)
                    ctx)]
          (recur ctx)))
      (catch js/Error err
        [ctx err]))))



