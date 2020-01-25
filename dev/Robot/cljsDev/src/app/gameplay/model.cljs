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
    (update unit :position (partial world2local camera))))

(defn getLocalUnits [ctx camera searchSize]
  (let [camera (or camera (getCamera ctx))]
    (->> (getUnitsByRegion ctx camera searchSize)
         (map (fn [unit]
                (mapUnitToLocal ctx camera unit))))))



(defn isFriendlyUnit [ctx unit targetUnit]
  (if (= unit targetUnit)
    true
    false))

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
  (let [state (-> (getFsm ctx)
                  (tool.fsm/currState))
        stateDetail (-> (getFsm ctx)
                        (tool.fsm/load))]
    {:units (getLocalUnits ctx nil nil)
     :map (getLocalMap ctx nil)
     :cursor (getLocalCursor ctx nil)
     :moveRange (getLocalMoveRange ctx nil)
     :attackRange (getLocalAttackRange ctx nil)
     :checkHitRate (->> (get-in ctx [:temp :checkHitRate])
                        (map (fn [info]
                               (-> info
                                   (update :unit (partial mapUnitToLocal ctx nil))
                                   (update :targetUnit (partial mapUnitToLocal ctx nil))))))
     :unitMenu (when (some #(= % state) [:unitMenu :unitBattleMenu])
                 (select-keys stateDetail [:menuCursor :data]))
     :systemMenu (when (some #(= % state) [:menu])
                   (select-keys stateDetail [:menuCursor :data]))
     :battleMenu (when (some #(= % state) [:unitBattleMenu])
                   (let [{args :args} stateDetail]
                     {:preview args}))
     :state state
     :stateDetail stateDetail}))

; ==============
; === module ===
; ==============

(defn createUnit [ctx {:keys [key position] :as unit} args]
  (-> (getUnits ctx)
      (tool.units/add (merge (app.gameplay.module/unitCreate app.gameplay.module/*module ctx unit args)
                             {:key (or key (gensym))
                              :position (or position [0 0])}))
      ((fn [units]
         (setUnits ctx units)))))

(defn getHitRate [ctx unit weapon targetUnit]
  0.8)

(defn getMovePathTree [ctx unit]
  (app.gameplay.module/unitGetMovePathTree app.gameplay.module/*module ctx unit))

(defn getMenuData [ctx unit]
  (app.gameplay.module/unitGetMenuData app.gameplay.module/*module ctx unit))

(defn onMove [ctx unit pos]
  (app.gameplay.module/unitOnMove app.gameplay.module/*module ctx unit pos))

(defn onDone [ctx unit]
  (app.gameplay.module/unitOnDone app.gameplay.module/*module ctx unit))

(defn onTurnStart [ctx unit]
  (app.gameplay.module/unitOnTurnStart app.gameplay.module/*module ctx unit))

(defn getWeapons [ctx unit]
  (app.gameplay.module/unitGetWeapons app.gameplay.module/*module ctx unit))

(defn getWeaponRange [ctx unit weapon]
  (app.gameplay.module/unitGetWeaponRange app.gameplay.module/*module ctx unit weapon))

(defn getWeaponType [ctx unit weapon]
  (app.gameplay.module/unitGetWeaponType app.gameplay.module/*module ctx unit weapon))

(defn selectCounterAttackAction [ctx unit fromUnit weapon]
  (let [hitRate (getHitRate ctx fromUnit weapon unit)]
    [:attack weapon]))

(defn calcActionResult [ctx left leftAction right rightAction]
  {})

(defn applyActionResult [ctx result]
  ctx)