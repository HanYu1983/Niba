(ns app2.gameplay.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op])
  (:require [tool.rbush]
            [tool.math]
            [app2.gameplay.model]
            [app2.gameplay.view]))

(defn comp-reduce [fns ctx args]
  (reduce (fn [ctx f]
            (f ctx args))
          ctx
          fns))

(defn main []
  (let [gameplay app2.gameplay.model/gameplay

        atom-gameplay (atom gameplay)
        input-signal (rx/Subject.)
        _ (app2.gameplay.view/view atom-gameplay input-signal)


        tick-signal (let [fps 60]
                      (-> (rx/interval (/ 1000 fps))
                          (.pipe (rx-op/map (fn [] [:tick (/ 1 fps)])))))

        update-fn (partial comp-reduce [app2.gameplay.model/camera-control
                                        app2.gameplay.model/player-control])

        model-signal (-> (rx/merge tick-signal
                                   input-signal)
                         (.pipe (rx-op/scan update-fn gameplay)
                                (rx-op/tap (fn [gameplay]
                                             (s/assert ::app2.gameplay.model/gameplay gameplay)))))

        _ (-> model-signal
              (.pipe (rx-op/map (fn [gameplay]
                                  (get-in gameplay [:state :entities])))
                     (rx-op/bufferCount 2 1)
                     (rx-op/filter (fn [args]
                                     (let [old (aget args 0)
                                           now (aget args 1)]
                                       (not= old now)))))
              (.subscribe (fn [args]
                            (let [old (aget args 0)
                                  now (aget args 1)
                                  ; 直接修改記憶體
                                  ; :js的部分是不會動的
                                  _ (tool.rbush/update! (get-in gameplay [:js :rbush])
                                                        #(not= (:position %1) (:position %2))
                                                        old now)]))))

        _ (.subscribe model-signal
                      (fn [gameplay]
                        (reset! atom-gameplay gameplay)))]))