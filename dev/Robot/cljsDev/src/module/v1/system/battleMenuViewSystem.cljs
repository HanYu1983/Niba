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
  {:pre [(common/explainValid? (s/tuple ::spec/battleMenuView ::type/unit) [gameplayCtx unit])]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)
          handleWeaponView (fn [gameplayCtx]
                             (let [state (-> gameplayCtx :fsm tool.fsm/load)
                                   {:keys [menuCursor battleMenuSession]} state
                                   cursor1 (tool.menuCursor/getCursor1 menuCursor)
                                   cursor2 (tool.menuCursor/getCursor2 menuCursor)
                                   weaponIdx (-> state :data :weaponIdx)
                                   battleMenuSession (if (= cursor1 weaponIdx)
                                                       (let [weapon (-> (data/getUnitWeapons gameplayCtx unit)
                                                                        second
                                                                        (nth cursor2))]
                                                         (cond-> battleMenuSession
                                                           true
                                                           (battleMenu/setLeftAction [:attack weapon] gameplayCtx data/getUnitHitRate)

                                                           playerTurn?
                                                           (battleMenu/setRightActionFromReaction gameplayCtx data/getUnitHitRate data/thinkReaction)))
                                                       battleMenuSession)
                                   state (assoc state :battleMenuSession battleMenuSession)
                                   gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
                               gameplayCtx))]
      (cond
        (and (not playerTurn?)
             (#{:up :down} action))
        (let [state (-> gameplayCtx :fsm tool.fsm/load)
              {:keys [menuCursor battleMenuSession]} state
              cursor1 (tool.menuCursor/getCursor1 menuCursor)
              weaponIdx (-> state :data :weaponIdx)
              select (tool.menuCursor/getSelect menuCursor)
              {rightUnit :unit [_ rightWeapon] :action} (get battleMenuSession 1)
              hitRate (cond-> (data/getUnitHitRate gameplayCtx rightUnit rightWeapon unit)
                        (= "evade" select)
                        (/ 2))
              battleMenuSession (cond-> (update-in battleMenuSession [1 :hitRate] (constantly hitRate))
                                  (#{"evade" "guard"} select)
                                  (update-in [0 :action] (constantly [(keyword select)])))
              _ (common/assertSpec ::battleMenu/defaultModel battleMenuSession)
              state (assoc state :battleMenuSession battleMenuSession)
              gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))
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