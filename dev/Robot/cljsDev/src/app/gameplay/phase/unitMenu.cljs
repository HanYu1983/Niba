(ns app.gameplay.phase.unitMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.data])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unitState])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updateUnitSelectMovePosition
                                               updateUnitMenu
                                               unitMoveAnim

                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]]))

(declare unitMenu)

(m/defstate unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  nil
  (m/basicNotify
   {:tempUnit unit}
   (a/<! (updateUnitSelectMovePosition nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:up :down :left :right])
   (m/handleCursor _ (recur gameplayCtx))

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (= :cancel action)
   [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]

   (= :enter action)
   (let [cursor (app.gameplay.model/getCursor gameplayCtx)
         camera (app.gameplay.model/getCamera gameplayCtx)
         path (tool.map/buildPath paths cursor)]
     (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial app.gameplay.model/world2local camera) path)} inputCh outputCh))
     (let [tempUnit (merge unit {:position cursor})
           state (merge state {:tempUnit tempUnit})
           units (-> gameplayCtx
                     (app.gameplay.model/getUnits)
                     (tool.units/delete unit)
                     (tool.units/add tempUnit))
           gameplayCtx (-> gameplayCtx
                           (app.gameplay.model/setUnits units)
                           (app.gameplay.model/setFsm (tool.fsm/save fsm state)))

           [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
       (if isEnd
         [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true]
         (let [tempUnit (:tempUnit state)
               units (-> gameplayCtx
                         (app.gameplay.model/getUnits)
                         (tool.units/delete tempUnit)
                         (tool.units/add unit))
               gameplayCtx (-> gameplayCtx
                               (app.gameplay.model/setUnits units))]
           (recur gameplayCtx)))))))

(m/defstate unitMenu [gameplayCtx {unit :unit}]
  nil
  (m/basicNotify
   (let [weapons (into [] (app.gameplay.unitState/getWeapons nil (:state unit) (app.gameplay.model/getData gameplayCtx)))
         menu [["move"] (into [] (range (count weapons))) ["cancel"]]]
     {:menuCursor (tool.menuCursor/model menu)
      :data {:weaponIdx 1
             :weapons weapons
             :weaponRange (into []
                                (map (fn [{[min max] "range" type "type" :as weapon}]
                                       (->> (tool.map/simpleFindPath (:position unit) (dec min))
                                            (into #{})
                                            (clojure.set/difference (->> (tool.map/simpleFindPath (:position unit) max)
                                                                         (into #{})))))
                                     weapons))}})
   (a/<! (updateUnitMenu nil state inputCh outputCh)))

  (= "KEY_DOWN" cmd)
  (m/handleKeyDown
   args action

   (some #(= % action) [:rup :rdown :rleft :rright])
   (m/handleCamera _ (recur gameplayCtx))

   (some #(= % action) [:up :down])
   (let [state (update state :menuCursor (fn [ctx]
                                           (tool.menuCursor/mapCursor1 ctx
                                                                       (action {:up dec :down inc}))))

         cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         menu (tool.menuCursor/getMenu (:menuCursor state))
         weaponIdx (get-in state [:data :weaponIdx])
         attackRange (if (= cursor1 weaponIdx)
                       (get-in state [:data :weaponRange cursor2])
                       [])

         gameplayCtx (-> gameplayCtx
                         (app.gameplay.model/setFsm (tool.fsm/save fsm state))
                         (app.gameplay.model/setAttackRange attackRange))]
     (recur gameplayCtx))

   (some #(= % action) [:left :right])
   (let [state (update state :menuCursor (fn [ctx]
                                           (tool.menuCursor/mapCursor2 ctx
                                                                       (action {:left dec :right inc}))))
         cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         menu (tool.menuCursor/getMenu (:menuCursor state))
         weaponIdx (get-in state [:data :weaponIdx])
         attackRange (if (= cursor1 weaponIdx)
                       (get-in state [:data :weaponRange cursor2])
                       [])

         gameplayCtx (-> gameplayCtx
                         (app.gameplay.model/setFsm (tool.fsm/save fsm state))
                         (app.gameplay.model/setAttackRange attackRange))]
     (recur gameplayCtx))

   (= :enter action)
   (let [cursor1 (tool.menuCursor/getCursor1 (:menuCursor state))
         cursor2 (tool.menuCursor/getCursor2 (:menuCursor state))
         weaponIdx (get-in state [:data :weaponIdx])
         select (tool.menuCursor/getSelect (:menuCursor state))]
     (cond
       (= cursor1 weaponIdx)
       (let [menu (tool.menuCursor/getMenu (:menuCursor state))
             weapons (get-in state [:data :weapons])
             weapon (get weapons cursor2)
             weaponType (get weapon "type")]
         (cond
           (= "single" weaponType)
           (let [[gameplay isEnd] (a/<! (unitSelectSingleTarget gameplayCtx {:unit unit :attackRange []} inputCh outputCh))]
             (if isEnd
               [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true]
               (recur gameplayCtx)))

           (= "line" weaponType)
           (recur gameplayCtx)

           :else
           (recur gameplayCtx)))

       (= "move" select)
       (let [[mw mh] app.gameplay.model/mapViewSize
             shortestPathTree (tool.map/findPath (:position unit)
                                                 (fn [{:keys [totalCost]} curr]
                                                   [(>= totalCost 5) false])
                                                 (fn [[x y]]
                                                   [[x (min mh (inc y))]
                                                    [x (max 0 (dec y))]
                                                    [(min mw (inc x)) y]
                                                    [(max 0 (dec x)) y]])
                                                 (constantly 1)
                                                 (constantly 0))
             moveRange (map first shortestPathTree)
             [gameplayCtx isEnd] (a/<! (unitSelectMovePosition gameplayCtx {:unit unit :paths shortestPathTree} inputCh outputCh))]
         (if isEnd
           [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) true]
           (recur gameplayCtx)))

       (= "cancel" select)
       (let []
         [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false])

       :else
       (recur gameplayCtx)))

  (= :cancel action)
  [(app.gameplay.model/setFsm gameplayCtx (tool.fsm/popState fsm)) false]))