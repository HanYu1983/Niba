(ns module.v1.phase.unitBattleMenu
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [module.v1.system.core :as systemCore])
  (:require-macros [module.v1.system.core :as systemCore])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.cursorViewSystem :as cursorViewSystem])
  (:require [module.v1.system.moveRangeViewSystem :as moveRangeViewSystem])
  (:require [module.v1.system.attackRangeViewSystem :as attackRangeViewSystem])
  (:require [module.v1.system.hitRateViewSystem :as hitRateViewSystem])
  (:require [module.v1.system.battleMenuViewSystem :as battleMenuViewSystem])
  (:require [module.v1.system.menuCursorViewSystem :as menuCursorViewSystem])
  (:require [module.v1.session.battleMenu :as battleMenu])
  (:require [module.v1.step.selectPosition :refer [selectPosition]]))


(defn handleCore [gameplayCtx [{left :unit} {right :unit} :as battleMenuModel] inputCh outputCh [cmd args]]
  {:pre [(common/explainValid? ::battleMenu/defaultModel battleMenuModel)]}
  (a/go
    (cond
      (= "KEY_DOWN" cmd)
      (let [action (common/actions args)]
        (cond
          (= :cancel action)
          [gameplayCtx false]

          (= :enter action)
          (let [state (-> gameplayCtx :fsm tool.fsm/load)
                {:keys [menuCursor data battleMenuSession]} state
                cursor1 (tool.menuCursor/getCursor1 menuCursor)
                weaponIdx (:weaponIdx data)
                select (tool.menuCursor/getSelect menuCursor)]
            (cond
              (= cursor1 weaponIdx)
              (let [cursor2 (tool.menuCursor/getCursor2 menuCursor)
                    weapon (-> (data/getUnitWeapons gameplayCtx left)
                               second
                               (nth cursor2))
                    attackRange (data/getUnitWeaponRange gameplayCtx left weapon)
                    isTargetInRange (some #(= (:position right) %) attackRange)]
                (if (not isTargetInRange)
                  (do
                    (a/<! (common/showMessage nil {:message (str "不在範圍內")} inputCh outputCh))
                    gameplayCtx)
                  (let [leftAction (get-in battleMenuSession [0 :action])
                        rightAction (get-in battleMenuSession [1 :action])
                        result (data/calcActionResult gameplayCtx left leftAction right rightAction)
                        gameplayCtx (data/applyActionResult gameplayCtx left leftAction right rightAction result)
                        leftAfter (-> (:units gameplayCtx)
                                      (tool.units/getByKey (:key left)))
                        rightAfter (-> (:units gameplayCtx)
                                       (tool.units/getByKey (:key right)))
                        _ (when (nil? leftAfter)
                            (print (:units gameplayCtx))
                            (throw (js/Error. (str "leftAfter " (:key left) " not found"))))
                        _ (when (nil? rightAfter)
                            (print (:units gameplayCtx))
                            (throw (js/Error. (str "rightAfter " (:key left) " not found"))))
                        _ (a/<! (common/unitBattleAnim nil {:units [(data/mapUnitToLocal gameplayCtx nil left)
                                                                    (data/mapUnitToLocal gameplayCtx nil right)]
                                                            :unitsAfter [(data/mapUnitToLocal gameplayCtx nil leftAfter)
                                                                         (data/mapUnitToLocal gameplayCtx nil rightAfter)]
                                                            :results result} inputCh outputCh))
                          ; 進攻方死亡
                        gameplayCtx (if (data/gameplayGetUnitIsDead nil gameplayCtx leftAfter)
                                      (let [gameplayCtx (-> (:units gameplayCtx)
                                                            (tool.units/delete leftAfter)
                                                            ((fn [units]
                                                               (assoc gameplayCtx :units units))))
                                            gameplayCtx (a/<! (data/gameplayOnUnitDead nil gameplayCtx leftAfter))
                                            _ (a/<! (common/unitDeadAnim nil {:unit (data/mapUnitToLocal gameplayCtx nil leftAfter)} inputCh outputCh))]
                                        gameplayCtx)
                                      gameplayCtx)
                          ; 防守方死亡
                        gameplayCtx (if (data/gameplayGetUnitIsDead nil gameplayCtx rightAfter)
                                      (let [gameplayCtx (-> (:units gameplayCtx)
                                                            (tool.units/delete rightAfter)
                                                            ((fn [units]
                                                               (assoc gameplayCtx :units units))))
                                            gameplayCtx (a/<! (data/gameplayOnUnitDead nil gameplayCtx rightAfter))
                                            _ (a/<! (common/unitDeadAnim nil {:unit (data/mapUnitToLocal gameplayCtx nil rightAfter)} inputCh outputCh))]
                                        gameplayCtx)
                                      gameplayCtx)]
                    [gameplayCtx true])))

              (= "cancel" select)
              [gameplayCtx false]

              :else
              gameplayCtx))

          :else
          gameplayCtx))

      :else
      gameplayCtx)))


(core/defstate unitBattleMenu [{left :unit [leftActionType leftWeapon :as leftAction] :action}
                               {right :unit} :as battleMenuModel]
  {:nameCtx gameplayCtx
   :initState
   (let [[menu data] (data/getMenuData gameplayCtx left)
         [_ weapon] leftAction]
     {:menuCursor (-> (tool.menuCursor/model menu)
                      (tool.menuCursor/mapCursor2 (:weaponIdx data) (constantly (let [indexMap (zipmap (-> (data/getUnitWeapons gameplayCtx left)
                                                                                                           second)
                                                                                                       (range))
                                                                                      weaponIdx (indexMap leftWeapon)]
                                                                                  weaponIdx))))
      :data data
      :battleMenuSession (-> battleMenuModel
                             (battleMenu/setRightActionFromReaction gameplayCtx data/getUnitHitRate data/thinkReaction))
      :unit left})
   :initCtx nil}

  (common/assertSpec ::battleMenu/defaultModel battleMenuModel)
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [evt (a/<! inputCh)
          returnCtx (-> gameplayCtx
                        (mapViewSystem/handleMapView evt)
                        (menuCursorViewSystem/handleMenuCursor evt)
                        (attackRangeViewSystem/handleAttackRangeView left evt)
                        (hitRateViewSystem/handleHitRateView left evt)
                        (battleMenuViewSystem/handleBattleMenuSession left evt)
                        (#(systemCore/asyncMapReturn handleCore % battleMenuModel inputCh outputCh evt))
                        (a/<!))]
      (systemCore/return returnCtx))))