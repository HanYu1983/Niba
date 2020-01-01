(ns app.gameplay
  (:require [app.map :as map])
  (:require [app.unitState])
  (:require [app.fsm])
  (:require [app.units]))

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
                           :units (-> app.units/model
                                      (app.units/add {:key (gensym)
                                                      :player :player
                                                      :type :robot
                                                      :state app.unitState/default
                                                      :position [0 0]})
                                      (app.units/add {:key (gensym)
                                                      :player :player
                                                      :type :robot
                                                      :state app.unitState/default
                                                      :position [2 2]}))
                           :fsm app.fsm/model})

(defn getFsm [ctx]
  (:fsm ctx))

(defn setFsm [ctx fsm]
  (merge ctx {:fsm fsm}))

(defn setData [ctx data]
  (update ctx :data (constantly data)))

(defn updateUnit [ctx unit nextUnit]
  (update ctx :units (fn [origin]
                       (-> origin
                           (app.units/delete unit)
                           (app.units/add nextUnit)))))


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
        [p1 p2] (or searchSize [(map - camera mapViewSize)
                                   (map + camera mapViewSize)])
        units (app.units/getByRegion (:units ctx) p1 p2)]
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