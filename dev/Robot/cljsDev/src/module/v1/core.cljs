(ns module.v1.core
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [app.module])
  (:require [module.v1.type])
  (:require [tool.map])
  (:require-macros [module.v1.core]))

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

(def gameView {:mapView {:map [[]]
                         :camera [0 0]
                         :viewsize [20 20]} 
               :cursorView {:cursor [0 0]
                            :camera [0 0]
                            :mapsize [20 20]}
               :unitsView {:units []
                           :camera [0 0]}})


(def mapViewSize [20 20])

(defn world2local [camera position]
  (map - position camera))


(defn handleMapView [gameView [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameView [:mapView :camera] #(mapv + % (action {:rup [0 -1]
                                                                   :rdown [0 1]
                                                                   :rleft [-1 0]
                                                                   :rright [1 0]})))
        :else
        gameView))

    :else
    gameView))

(defn handleCursorView [gameView [cmd args]]
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (actions args)]
      (cond
        (some #(= % action) [:rup :rdown :rleft :rright])
        (update-in gameView [:cursorView :camera] #(mapv + % (action {:rup [0 -1]
                                                                      :rdown [0 1]
                                                                      :rleft [-1 0]
                                                                      :rright [1 0]})))

        (some #(= % action) [:up :down :left :right])
        (update-in gameView [:cursorView :cursor] #(mapv + % (action {:up [0 -1]
                                                                      :down [0 1]
                                                                      :left [-1 0]
                                                                      :right [1 0]})))
        :else
        gameView))

    :else
    gameView))



(defn render [gameView]
  (assertSpec module.v1.type/gameView gameView)
  {:map (let [camera (get-in gameView [:mapView :camera])
              playmap (get-in gameView [:mapView :map])]
          (tool.map/subMap camera mapViewSize playmap))
   :cursor (let [camera (get-in gameView [:mapView :camera])
                 cursor (get-in gameView [:cursorView :cursor])]
             (world2local camera cursor))})

(module.v1.core/defwait paint [ctx args])


(defmethod app.module/loadData :v1 [_]
  (a/go
    nil))

(defmethod app.module/lobbyGetUnits :v1 [_ lobbyCtx])

(defmethod app.module/lobbyGetPilots :v1 [_ lobbyCtx])

(defmethod app.module/gameplayStart :v1 [_ ctx inputCh outputCh]
  (a/go
    (let [playmap (tool.map/generateMap 100 100
                                        {:deepsea 0.6
                                         :sea 0.6
                                         :sand 0.1
                                         :grass 1
                                         :hill 1
                                         :city 0.3
                                         :tree 0.4
                                         :award 0.01
                                         :power 1
                                         :offset 0})
          gameView (update-in gameView [:mapView :map] (constantly playmap))]
      (loop [gameView gameView]
        (a/<! (paint nil (render gameView) inputCh outputCh))
        (let [evt (a/<! inputCh)]
          (recur (-> gameView
                     (handleMapView evt)
                     (handleCursorView evt))))))))