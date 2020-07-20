(ns module.v1.system.battleMenuViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.session.battleMenu :as battleMenu])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm]))


(defn handleBattleMenuSession [gameplayCtx unit playerTurn? [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::spec/battleMenuView ::type/robot) [gameplayCtx unit])
         (common/explainValid? ::spec/unitMenuView gameplayCtx)]}
  (common/assertSpec ::spec/battleMenuView gameplayCtx)
  (common/assertSpec ::spec/unitMenuView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)
          handleWeaponView (fn [gameplayCtx]
                             (let [state (-> gameplayCtx :fsm tool.fsm/load)
                                   {:keys [menuCursor battleMenuSession]} state
                                   {:keys [weapons weaponIdx]} (:data state)
                                   cursor1 (tool.menuCursor/getCursor1 menuCursor)
                                   cursor2 (tool.menuCursor/getCursor2 menuCursor)
                                   ; 選到武器時, 更新面板
                                   battleMenuSession (if (= cursor1 weaponIdx)
                                                       (let [weapon (nth weapons cursor2)]
                                                         (cond-> battleMenuSession
                                                           true
                                                           (battleMenu/setLeftAction [:attack weapon] gameplayCtx data/getUnitHitRate)

                                                           ; 我方回合並選到武器時, 更新敵方的反應動作
                                                           playerTurn?
                                                           (battleMenu/setRightActionFromReaction gameplayCtx data/getUnitHitRate data/thinkReaction)))
                                                       battleMenuSession)
                                   state (assoc state :battleMenuSession battleMenuSession)
                                   gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
                               gameplayCtx))]
      (cond
        ; 處理敵人回合的選單移動
        (and (not playerTurn?)
             (#{:up :down} action))
        (let [state (-> gameplayCtx :fsm tool.fsm/load)
              {:keys [menuCursor battleMenuSession]} state
              cursor1 (tool.menuCursor/getCursor1 menuCursor)
              weaponIdx (-> state :data :weaponIdx)
              select (tool.menuCursor/getSelect menuCursor)
              {rightUnit :unit [_ rightWeapon] :action} (get battleMenuSession 1)
              ; 如果選到evade
              hitRate (cond-> (data/getUnitHitRate gameplayCtx rightUnit rightWeapon unit)
                        (= "evade" select)
                        (/ 2))
              ; 更新命中率和武器面板
              battleMenuSession (cond-> (update-in battleMenuSession [1 :hitRate] (constantly hitRate))
                                  (#{"evade" "guard"} select)
                                  (update-in [0 :action] (constantly [(keyword select)])))
              _ (common/assertSpec ::battleMenu/defaultModel battleMenuSession)
              ; 套用
              state (assoc state :battleMenuSession battleMenuSession)
              gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))
              ; 上下移動時也會選到武器
              gameplayCtx (if (= cursor1 weaponIdx)
                            (handleWeaponView gameplayCtx)
                            gameplayCtx)]
          gameplayCtx)

        (#{:left :right} action)
        (handleWeaponView gameplayCtx)

        :else
        gameplayCtx))

    :else
    gameplayCtx))