(ns app.gameplay
  (:require [app.quadtree :as aq])
  (:require [app.map :as map]))

(def mapViewSize [20 20])

(defn rectByUnit [{[x y] :position}]
  [x y (+ 0.5 x) (+ 0.5 y)])

(defn world2local [camera position]
  (map - position camera))

(defn local2world [camera position]
  (map + position camera))

(def defaultGameplayModel {:map nil
                           :temp {:cursor [0 0]
                                  :camera [0 0]
                                  :moveRange []}
                           :players {:player {:faction 0}
                                     :ai1 {:faction 1}
                                     :ai2 {:faction 1}}
                           :units (-> (aq/make-qdtree [0 0 100 100] 3)
                                      (aq/add rectByUnit {:key (gensym)
                                                          :player :player
                                                          :type :robot
                                                          :state {:key 0}
                                                          :position [0 0]})
                                      (aq/add rectByUnit {:key (gensym)
                                                          :player :player
                                                          :type :robot
                                                          :state {:key 0}
                                                          :position [10 5]})
                                      (aq/balance))
                           :focusUnitKey nil})

(defn updateUnit [ctx unit nextUnit]
  (update ctx :units (fn [origin]
                       (-> origin
                           (aq/delete rectByUnit unit)
                           (aq/add rectByUnit nextUnit)
                           (aq/balance)))))


(defn setMap [ctx map]
  (update ctx :map (constantly map)))

(defn getMap [ctx]
  (:map ctx))

(defn setCamera [ctx camera]
  (let [mapSize (map/getMapSize (getMap ctx))
        camera (->> camera
                    (map min (map - mapSize mapViewSize))
                    (map max [0 0]))]
    (update-in ctx [:temp :camera] (constantly camera))))

(defn getPlayers [ctx]
  (:players ctx))

(defn getCamera [ctx]
  (get-in ctx [:temp :camera]))

(defn setCursor [ctx cursor]
  (update-in ctx [:temp :cursor] (constantly cursor)))

(defn getCursor [ctx]
  (get-in ctx [:temp :cursor]))

(defn getUnits [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))
        searchSize (or searchSize (aq/makeRectFromPoint camera mapViewSize))
        units (aq/search (:units ctx) rectByUnit searchSize)]
    units))

(defn getLocalMap [ctx camera]
  (let [camera (or camera (getCamera ctx))
        playmap (:map ctx)]
    (map/subMap camera mapViewSize playmap)))

(defn getLocalUnits [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))]
    (->> (getUnits ctx camera searchSize)
         (map (fn [unit]
                (update unit :position (partial world2local camera)))))))

(defn getLocalCursor [ctx camera]
  (let [camera (or camera (getCamera ctx))
        cursor (getCursor ctx)]
    (world2local camera cursor)))