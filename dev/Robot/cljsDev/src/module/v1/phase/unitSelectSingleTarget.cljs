(ns module.v1.phase.unitSelectSingleTarget
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.units])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [module.v1.session.battleMenu :as battleMenu])
  (:require [module.v1.step.selectPosition :refer [selectPosition]])
  (:require [module.v1.phase.unitBattleMenu :refer [unitBattleMenu]]))

(core/defstate unitSelectSingleTarget {:keys [unit weapon]}
  {:nameCtx gameplayCtx
   :initState nil
   :initCtx nil}
  (common/explainValid? (s/tuple ::type/robot ::type/weaponState) [unit weapon])
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[gameplayCtx result] (a/<! (selectPosition gameplayCtx {} inputCh outputCh))]
      (cond
        (false? result)
        [gameplayCtx false]

        (true? result)
        (let [{:keys [cursor units]} gameplayCtx
              unitAtCursor (tool.units/getByPosition units cursor)]
          (if unitAtCursor
            (let [weaponRange (into #{} (data/getUnitWeaponRange gameplayCtx unit weapon))
                  unitInRange? (weaponRange cursor)
                  friendlyUnit? (data/isFriendlyUnit gameplayCtx unit unitAtCursor)
                  invalidWeaponMsg (data/invalidWeapon? gameplayCtx unit weapon nil)]
              (cond
                invalidWeaponMsg
                (do
                  (a/<! (common/showMessage nil {:message invalidWeaponMsg} inputCh outputCh))
                  (recur gameplayCtx))

                (not unitInRange?)
                (do
                  (a/<! (common/showMessage nil {:message (str "目標不在範圍內")} inputCh outputCh))
                  (recur gameplayCtx))

                friendlyUnit?
                (do
                  (a/<! (common/showMessage nil {:message (str "請選擇敵方目標")} inputCh outputCh))
                  (recur gameplayCtx))

                :else
                (let [_ (a/<! (common/unitTargetingAnim nil {:units (map #(->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} %)
                                                                               (data/mapUnitToLocal gameplayCtx nil)) [unit unitAtCursor])} inputCh outputCh))
                      [gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx
                                                                {:battleMenu (-> battleMenu/defaultModel
                                                                                 (battleMenu/setUnits unit unitAtCursor)
                                                                                 (battleMenu/setLeftAction [:attack weapon] gameplayCtx data/getUnitHitRate)
                                                                                 (battleMenu/setRightActionFromReaction gameplayCtx data/getUnitHitRate data/thinkReaction))
                                                                 :playerTurn? true}
                                                                inputCh outputCh))]
                  (if isEnd
                    [gameplayCtx isEnd]
                    (recur gameplayCtx)))))
            (do
              (a/<! (common/showMessage nil {:message (str "請選擇目標")} inputCh outputCh))
              (recur gameplayCtx))))))))