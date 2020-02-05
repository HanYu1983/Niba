(ns app.gameplay.model
  (:require [tool.fsm])
  (:require [tool.map])
  (:require [tool.units])
  (:require [app.gameplay.module]))

; ==============
; === helper ===
; ==============

(defn rectByUnit [{[x y] :position}]
  [x y (+ 0.5 x) (+ 0.5 y)])

(defn world2local [camera position]
  (map - position camera))

(defn local2world [camera position]
  (map + position camera))

; ==============
; === config ===
; ==============

(def mapViewSize [20 20])

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

(defn getPlayers [ctx]
  (:players ctx))

; ===================
; === Phase State ===
; ===================

(defn getFsm [ctx]
  (:fsm ctx))

(defn setFsm [ctx fsm]
  (merge ctx {:fsm fsm}))

; ===========
; === Map ===
; ===========

; map
(declare getCamera)

(defn setMap [ctx map]
  (update ctx :map (constantly map)))

(defn getMap [ctx]
  (:map ctx))

(defn getLocalMap [ctx camera]
  (let [camera (or camera (getCamera ctx))
        playmap (:map ctx)]
    (tool.map/subMap camera mapViewSize playmap)))

; camera
(defn setCamera [ctx camera]
  (update-in ctx [:temp :camera] (constantly camera)))

(defn getCamera [ctx]
  (get-in ctx [:temp :camera]))

(defn boundCamera [ctx camera]
  (->> camera
       (map min (map - (tool.map/getMapSize (getMap ctx)) mapViewSize))
       (map max [0 0])))

; cursor
(defn setCursor [ctx cursor]
  (update-in ctx [:temp :cursor] (constantly cursor)))

(defn getCursor [ctx]
  (get-in ctx [:temp :cursor]))

(defn boundCursor [ctx cursor]
  (->> cursor
       (map max [0 0])
       (map min (map dec (tool.map/getMapSize (getMap ctx))))))

(defn getLocalCursor [ctx camera]
  (let [camera (or camera (getCamera ctx))
        cursor (getCursor ctx)]
    (world2local camera cursor)))

; ============
; === unit ===
; ============

(defn updateUnit [ctx unit f]
  (update ctx :units (fn [origin]
                       (-> origin
                           (tool.units/delete unit)
                           (tool.units/add (f unit))))))

(defn setUnits [ctx units]
  (update ctx :units (constantly units)))

(defn getUnits [ctx]
  (:units ctx))

(defn getUnitsInRange [ctx range]
  (->> (map (fn [pos]
              (tool.units/getByPosition (getUnits ctx) pos))
            range)
       (filter identity)))

(defn getUnitsByRegion [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))
        [p1 p2] (or searchSize [(map - camera mapViewSize)
                                (map + camera mapViewSize)])
        units (tool.units/getByRegion (getUnits ctx) p1 p2)]
    units))

(defn mapUnitToLocal [ctx camera unit]
  (let [camera (or camera (getCamera ctx))]
    (-> unit
        (update :position (partial world2local camera))
        ((fn [unit]
           (app.gameplay.module/unitGetInfo app.gameplay.module/*module ctx unit))))))

(defn getLocalUnits [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))]
    (->> (getUnitsByRegion ctx camera searchSize)
         (map (fn [unit]
                (mapUnitToLocal ctx camera unit))))))

(defn isBelongToPlayer [ctx unit]
  (= (:player unit) :player))

(defn isFriendlyUnit [ctx unit targetUnit]
  (if (= unit targetUnit)
    true
    (->> [unit targetUnit]
         (map :player)
         (map (fn [player]
                (get-in ctx [:players player :faction])))
         (apply =))))

; ============
; === view ===
; ============

(defn updateTemp [ctx f]
  (update-in ctx [:temp] f))

(defn setMoveRange [ctx v]
  (update-in ctx [:temp :moveRange] (constantly v)))

(defn getMoveRange [ctx]
  (get-in ctx [:temp :moveRange]))


(defn setAttackRange [ctx v]
  (update-in ctx [:temp :attackRange] (constantly v)))

(defn getAttackRange [ctx]
  (get-in ctx [:temp :attackRange]))


(defn getLocalMoveRange [ctx camera]
  (let [camera (or camera (getCamera ctx))
        moveRange (getMoveRange ctx)]
    (map (partial world2local camera) moveRange)))

(defn getLocalAttackRange [ctx camera]
  (let [camera (or camera (getCamera ctx))
        range (getAttackRange ctx)]
    (map (partial world2local camera) range)))

(defn formatToDraw [ctx]
  (app.gameplay.module/formatToDraw app.gameplay.module/*module ctx))

; ==============
; === module ===
; ==============

(defn createUnit [ctx {:keys [key position] :as unit} args]
  (-> (getUnits ctx)
      (tool.units/add (merge (app.gameplay.module/unitOnCreate app.gameplay.module/*module ctx unit args)
                             {:key (or key (gensym))
                              :position (or position [0 0])}))
      ((fn [units]
         (setUnits ctx units)))))