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

(core/defstate unitSelectSingleTarget {:keys [unit attackRange weapon]}
  {:nameCtx gameplayCtx
   :initState nil
   :initCtx nil}
  (type/explainValid? (s/tuple ::type/unit ::type/weapon) [unit weapon])
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[gameplayCtx result] (a/<! (selectPosition gameplayCtx {} inputCh outputCh))]
      (cond
        (false? result)
        [gameplayCtx false]

        (true? result)
        (let [{:keys [cursor units]} gameplayCtx
              unitAtCursor (tool.units/getByPosition units cursor)]
          (if (and unitAtCursor (not (data/isFriendlyUnit gameplayCtx unit unitAtCursor)))
            (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx
                                                            (-> battleMenu/defaultModel
                                                                (battleMenu/setUnits unit unitAtCursor)
                                                                (battleMenu/setLeftAction [:attack weapon] gameplayCtx data/getUnitHitRate))
                                                            inputCh outputCh))]
              (if isEnd
                [gameplayCtx isEnd]
                (recur gameplayCtx)))
            (do
              (a/<! (common/showMessage nil {:message (str "請選擇目標")} inputCh outputCh))
              (recur gameplayCtx))))))))