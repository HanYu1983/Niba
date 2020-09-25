(ns app2.gameplay.core
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op])
  (:require [app2.gameplay.spec]
            [app2.gameplay.model]
            [app2.gameplay.view]
            [app2.gameplay.control.player :refer [fire-control player-control]]
            [app2.gameplay.control.camera :refer [camera-control]]
            [app2.gameplay.control.brain :refer [brain-control]]
            [app2.gameplay.control.position :refer [velocity-control last-position-control]]
            [app2.gameplay.control.time :refer [expire-control expire-evt-control timer-control]]
            [app2.gameplay.control.collision :refer [collision-control]]
            [tool.rbush]
            [tool.math]))

(defn comp-reduce [fns ctx args]
  (reduce (fn [ctx f]
            (f ctx args))
          ctx
          fns))

(defn entities-reduce [fns gameplay [cmd args]]
  (update-in gameplay [:state :entities] (fn [entities]
                                           (->> (vals entities)
                                                (map (fn [entity]
                                                       (reduce (fn [entity f]
                                                                 (f entity gameplay [cmd args]))
                                                               entity
                                                               fns)))
                                                (zipmap (keys entities))))))

(defn main []
  (let [gameplay app2.gameplay.model/gameplay
        gameplay-event (-> gameplay :js :outputSubject)

        view-event (rx/Subject.)

        tick-signal (-> view-event
                        (.pipe (rx-op/filter
                                (fn [[t]]
                                  (= :tick t)))
                               (rx-op/timeInterval)
                               (rx-op/map
                                (fn [obj]
                                  [(first (.-value obj)) (/ (.-interval obj) 1000)]))))
        
        update-fn (partial comp-reduce [camera-control
                                        fire-control
                                        expire-control
                                        (partial entities-reduce
                                                 [timer-control
                                                  expire-evt-control
                                                  player-control
                                                  velocity-control
                                                  brain-control
                                                  collision-control
                                                  last-position-control])])

        model-signal (rx/Subject.)

        ; 用subscribe把事件流轉發到另一個subject, 不然在#1的處理後每個事件會被多發一次, 不知為何
        _ (-> (rx/merge tick-signal
                        view-event
                        gameplay-event)
              (.pipe (rx-op/scan update-fn gameplay)
                     (rx-op/tap (fn [gameplay]
                                  (s/assert ::app2.gameplay.spec/gameplay gameplay))))
              (.subscribe model-signal))

        ; #1
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

        atom-gameplay (atom gameplay)

        _ (.subscribe model-signal
                      (fn [gameplay]
                        (s/assert ::app2.gameplay.spec/gameplay gameplay)
                        (reset! atom-gameplay gameplay)))

        _ (app2.gameplay.view/view atom-gameplay view-event)]))