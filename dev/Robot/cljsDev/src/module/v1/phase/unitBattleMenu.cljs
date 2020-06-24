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
  (:require [module.v1.system.spec :as spec])
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


(defn- handleCore [gameplayCtx fixRight inputCh outputCh [cmd args]]
  (common/assertSpec ::spec/unitMenuView gameplayCtx)
  (common/assertSpec ::spec/battleMenuView gameplayCtx)
  (common/assertSpec boolean? fixRight)
  (a/go
    (common/assertSpec
     ::type/returnCtx
     (cond
       (= "KEY_DOWN" cmd)
       (let [action (common/actions args)]
         (cond
           ; 如果選單中有cancel, 才能按快速鍵跳出
           (and (let [state (-> gameplayCtx :fsm tool.fsm/load)
                      menu (-> state :menuCursor :menu)
                      cancelButton? (common/assertSpec
                                     boolean?
                                     (->> menu flatten (into #{}) (#(contains? % "cancel"))))]
                  cancelButton?)
                (= :cancel action))
           [gameplayCtx false]
           
           (= :enter action)
           (let [state (-> gameplayCtx :fsm tool.fsm/load)
                 {:keys [menuCursor data battleMenuSession]} state
                 [{left :unit} {right :unit}] battleMenuSession
                 {:keys [weaponIdx weapons]} data
                 cursor1 (tool.menuCursor/getCursor1 menuCursor)
                 select (tool.menuCursor/getSelect menuCursor)
                 handleBattle (fn [gameplayCtx leftAction rightAction]
                                (a/go
                                  (common/assertSpec
                                   ::type/gameplayCtx
                                   (let [result (common/assertSpec
                                                 ::data/actionResult
                                                 (if fixRight
                                                   (->> (data/calcActionResult gameplayCtx right rightAction left leftAction)
                                                        reverse
                                                        (into []))
                                                   (data/calcActionResult gameplayCtx left leftAction right rightAction)))
                                         [leftAfter rightAfter] (data/applyActionResult gameplayCtx left leftAction right rightAction result)
                                         _ (a/<! (common/unitBattleAnim nil {:units (map #(->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                                                               (data/mapUnitToLocal gameplayCtx nil)) (cond-> [left right]
                                                                                                                                    fixRight reverse))
                                                                             :unitsAfter (map #(->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                                                                    (data/mapUnitToLocal gameplayCtx nil)) (cond-> [leftAfter rightAfter]
                                                                                                                                             fixRight reverse))
                                                                             :results (cond-> result fixRight reverse)} inputCh outputCh))
                                         gameplayCtx (-> gameplayCtx
                                                         (data/updateUnit left (constantly leftAfter))
                                                         (data/updateUnit right (constantly rightAfter)))
                                       ; 進攻方死亡
                                         gameplayCtx (common/assertSpec
                                                      ::type/gameplayCtx
                                                      (if (data/gameplayGetUnitIsDead nil gameplayCtx leftAfter)
                                                        (let [gameplayCtx (-> (:units gameplayCtx)
                                                                              (tool.units/delete leftAfter)
                                                                              ((fn [units]
                                                                                 (assoc gameplayCtx :units units))))
                                                              gameplayCtx (a/<! (data/gameplayOnUnitDead nil gameplayCtx leftAfter))
                                                              _ (a/<! (common/unitDeadAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} leftAfter)
                                                                                                           (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh))]
                                                          gameplayCtx)
                                                        gameplayCtx))
                                       ; 防守方死亡
                                         gameplayCtx (common/assertSpec
                                                      ::type/gameplayCtx
                                                      (if (data/gameplayGetUnitIsDead nil gameplayCtx rightAfter)
                                                        (let [gameplayCtx (-> (:units gameplayCtx)
                                                                              (tool.units/delete rightAfter)
                                                                              ((fn [units]
                                                                                 (assoc gameplayCtx :units units))))
                                                              gameplayCtx (a/<! (data/gameplayOnUnitDead nil gameplayCtx rightAfter))
                                                              _ (a/<! (common/unitDeadAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} rightAfter)
                                                                                                           (data/mapUnitToLocal gameplayCtx nil))} inputCh outputCh))]
                                                          gameplayCtx)
                                                        gameplayCtx))
                                         gameplayCtx (dissoc gameplayCtx :attackRange :checkHitRate)]
                                     gameplayCtx))))]
             (cond
               (= cursor1 weaponIdx)
               (let [cursor2 (tool.menuCursor/getCursor2 menuCursor)
                     weapon (common/assertSpec
                             ; 先假設weapons的size一定大於零, 若沒有武器可用, 應該不能出現武器選單
                             ::type/weapon
                             (nth weapons cursor2))
                     attackRange (data/getUnitWeaponRange gameplayCtx left weapon)
                     isTargetInRange (some #(= (:position right) %) attackRange)
                     invalidWeaponMsg (data/invalidWeapon? gameplayCtx  left weapon)]
                 (cond
                   invalidWeaponMsg
                   (do
                     (a/<! (common/showMessage nil {:message invalidWeaponMsg} inputCh outputCh))
                     gameplayCtx)

                   (not isTargetInRange)
                   (do
                     (a/<! (common/showMessage nil {:message (str "不在範圍內")} inputCh outputCh))
                     gameplayCtx)

                   :else
                   (let [leftAction (get-in battleMenuSession [0 :action])
                         rightAction (get-in battleMenuSession [1 :action])
                         gameplayCtx (a/<! (handleBattle gameplayCtx leftAction rightAction))]
                     [gameplayCtx true])))

               (#{"guard" "evade"} select)
               (let [leftAction [(keyword select)]
                     rightAction (get-in battleMenuSession [1 :action])
                     gameplayCtx (a/<! (handleBattle gameplayCtx leftAction rightAction))]
                 [gameplayCtx true])

               (= "cancel" select)
               [gameplayCtx false]

               :else
               gameplayCtx))

           :else
           gameplayCtx))

       :else
       gameplayCtx))))


(core/defstate unitBattleMenu {[{left :unit leftAction :action}
                                {right :unit} :as battleMenuModel] :battleMenu
                               playerTurn? :playerTurn?}
  {:nameCtx gameplayCtx
   :initState
   (let [_ (common/assertSpec ::battleMenu/defaultModel battleMenuModel)
         _ (common/assertSpec boolean? playerTurn?)
         [menu data] (data/getMenuData gameplayCtx left playerTurn?)
         [leftActionType leftWeapon] leftAction]
     {:menuCursor (common/assertSpec
                   ::tool.menuCursor/model
                   (cond-> (tool.menuCursor/model menu)
                     (#{:evade} leftActionType)
                     (tool.menuCursor/mapCursor1 (constantly 1))

                     (#{:guard} leftActionType)
                     (tool.menuCursor/mapCursor1 (constantly 2))

                     (#{:attack} leftActionType)
                     (tool.menuCursor/mapCursor2 (:weaponIdx data) (constantly (let [indexMap (zipmap (-> (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} left)
                                                                                                          second)
                                                                                                      (range))
                                                                                     weaponIdx (indexMap leftWeapon)]
                                                                                 weaponIdx)))))
      :data data
      :unit left
      :battleMenuSession battleMenuModel})
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [evt (a/<! inputCh)
          returnCtx (-> gameplayCtx
                        (mapViewSystem/handleMapView evt)
                        (menuCursorViewSystem/handleMenuCursor evt)
                        (attackRangeViewSystem/handleAttackRangeView left evt)
                        (hitRateViewSystem/handleHitRateView left evt)
                        (battleMenuViewSystem/handleBattleMenuSession left playerTurn? evt)
                        (#(systemCore/asyncMapReturn handleCore % (not playerTurn?) inputCh outputCh evt))
                        (a/<!))]
      (systemCore/return returnCtx))))