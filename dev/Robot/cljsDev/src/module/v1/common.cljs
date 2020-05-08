(ns module.v1.common
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core])
  (:require [module.v1.type])
  (:require [tool.map]))


(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        (println args)
        false)))

(defn assertSpec [sp args]
  (when true
    (when (not (clojure.spec.alpha/valid? sp args))
      (println (clojure.spec.alpha/explain-str sp args))
      (println args)
      (throw (js/Error. (str "error"))))))

(def actions {87 :up
              83 :down
              65 :left
              68 :right
              13 :enter
              27 :cancel
              38 :rup
              40 :rdown
              37 :rleft
              39 :rright})

(module.v1.core/defwait paint [ctx args])

(defn handleMapView [gameplayCtx [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameplayCtx [:mapView :camera] #(mapv + % (action {:rup [0 -1]
                                                                   :rdown [0 1]
                                                                   :rleft [-1 0]
                                                                   :rright [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))

(defn handleCursorView [gameplayCtx [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameplayCtx [:cursorView :camera] #(mapv + % (action {:rup [0 -1]
                                                                      :rdown [0 1]
                                                                      :rleft [-1 0]
                                                                      :rright [1 0]})))

        (some #(= % action) [:up :down :left :right])
        (update-in gameplayCtx [:cursorView :cursor] #(mapv + % (action {:up [0 -1]
                                                                      :down [0 1]
                                                                      :left [-1 0]
                                                                      :right [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))


(defn handleMoveRange [gameplayCtx [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameplayCtx [:moveRangeView :camera] #(mapv + % (action {:rup [0 -1]
                                                                            :rdown [0 1]
                                                                            :rleft [-1 0]
                                                                            :rright [1 0]})))
        :else
        gameplayCtx))

    :else
    gameplayCtx))



(defn world2local [camera position]
  (map - position camera))


(defn render [gameplayCtx]
  (assertSpec module.v1.type/gameplayCtx gameplayCtx)
  {:map (let [{:keys [camera map viewsize]} (:mapView gameplayCtx)]
          (tool.map/subMap camera viewsize map))
   :cursor (let [{:keys [camera cursor]} (:cursorView gameplayCtx)]
             (world2local camera cursor))})