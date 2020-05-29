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


(defn handleBattleMenuSession [gameplayCtx unit [cmd args]]
  {:pre [(common/explainValid? (s/tuple ::spec/battleMenuView ::type/unit) [gameplayCtx unit])]}
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:left :right])
        (let [state (-> gameplayCtx :fsm tool.fsm/load)
              {:keys [menuCursor battleMenuSession]} state
              cursor1 (tool.menuCursor/getCursor1 menuCursor)
              cursor2 (tool.menuCursor/getCursor2 menuCursor)
              weaponIdx (-> state :data :weaponIdx)
              battleMenuSession (if (= cursor1 weaponIdx)
                                  (let [weapon (-> (data/getUnitWeapons gameplayCtx unit)
                                                   second
                                                   (nth cursor2))]
                                    (-> battleMenuSession
                                        (battleMenu/setLeftAction [:attack weapon] gameplayCtx data/getUnitHitRate)
                                        (battleMenu/setRightActionFromReaction gameplayCtx data/getUnitHitRate data/thinkReaction)))
                                  battleMenuSession)
              state (assoc state :battleMenuSession battleMenuSession)
              gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
          gameplayCtx)
        
        :else
        gameplayCtx))

    :else
    gameplayCtx))