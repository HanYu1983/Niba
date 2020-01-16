(ns app.gameplay.model
  (:require [app.gameplay.unit])
  (:require [tool.fsm])
  (:require [tool.map :as map])
  (:require [tool.units]))

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
                                  :moveRange []
                                  :attackRange []
                                  :mapAttackRange []}
                           :players {:player {:faction 0}
                                     :ai1 {:faction 1}
                                     :ai2 {:faction 1}}
                           :units tool.units/model
                           :fsm tool.fsm/model})

(defn getFsm [ctx]
  (:fsm ctx))

(defn setFsm [ctx fsm]
  (merge ctx {:fsm fsm}))

(defn updateUnit [ctx unit nextUnit]
  (update ctx :units (fn [origin]
                       (-> origin
                           (tool.units/delete unit)
                           (tool.units/add nextUnit)))))


(defn setMap [ctx map]
  (update ctx :map (constantly map)))

(defn getMap [ctx]
  (:map ctx))

(defn setCamera [ctx camera]
  (update-in ctx [:temp :camera] (constantly camera)))

(defn getPlayers [ctx]
  (:players ctx))

(defn getCamera [ctx]
  (get-in ctx [:temp :camera]))

(defn setCursor [ctx cursor]
  (update-in ctx [:temp :cursor] (constantly cursor)))

(defn boundCursor [ctx cursor]
  (->> cursor
       (map max [0 0])
       (map min (map dec (map/getMapSize (getMap ctx))))))

(defn boundCamera [ctx camera]
  (->> camera
       (map min (map - (map/getMapSize (getMap ctx)) mapViewSize))
       (map max [0 0])))

(defn getCursor [ctx]
  (get-in ctx [:temp :cursor]))

(defn setMoveRange [ctx v]
  (update-in ctx [:temp :moveRange] (constantly v)))

(defn getMoveRange [ctx]
  (get-in ctx [:temp :moveRange]))

(defn setAttackRange [ctx v]
  (update-in ctx [:temp :attackRange] (constantly v)))

(defn getAttackRange [ctx]
  (get-in ctx [:temp :attackRange]))

(defn setUnits [ctx units]
  (update ctx :units (constantly units)))

(defn getUnits [ctx]
  (:units ctx))

(defn getUnitsByRegion [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))
        [p1 p2] (or searchSize [(map - camera mapViewSize)
                                (map + camera mapViewSize)])
        units (tool.units/getByRegion (getUnits ctx) p1 p2)]
    units))

(defn getLocalMap [ctx camera]
  (let [camera (or camera (getCamera ctx))
        playmap (:map ctx)]
    (map/subMap camera mapViewSize playmap)))

(defn getLocalUnits [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))]
    (->> (getUnitsByRegion ctx camera searchSize)
         (map (fn [unit]
                (update unit :position (partial world2local camera)))))))

(defn getLocalCursor [ctx camera]
  (let [camera (or camera (getCamera ctx))
        cursor (getCursor ctx)]
    (world2local camera cursor)))

(defn getLocalMoveRange [ctx camera]
  (let [camera (or camera (getCamera ctx))
        moveRange (getMoveRange ctx)]
    (map (partial world2local camera) moveRange)))

(defn getLocalAttackRange [ctx camera]
  (let [camera (or camera (getCamera ctx))
        range (getAttackRange ctx)]
    (map (partial world2local camera) range)))