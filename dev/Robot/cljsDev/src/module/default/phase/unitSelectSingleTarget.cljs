(ns module.default.phase.unitSelectSingleTarget
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.default.data])
  (:require-macros [module.default.macros :as m])
  (:require [module.default.phase.common])
  (:require [module.default.phase.unitBattleMenu :refer [unitBattleMenu]])
  (:require [module.default.step.selectPosition])
  (:require [module.default.session.battleMenu])
  (:require [module.default.data]))

(m/defbasic unitSelectSingleTarget [gameplayCtx {:keys [unit attackRange weapon]}]
  [[gameplayCtx result] (a/<! (module.default.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil
  (m/basicNotify
   {:tempUnit unit})

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (module.default.data/getCursor gameplayCtx)
        units (module.default.data/getUnits gameplayCtx)
        unitAtCursor (tool.units/getByPosition units cursor)]
    (if (and unitAtCursor (not (module.default.data/isFriendlyUnit gameplayCtx unit unitAtCursor)))
      (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx
                                                      (-> module.default.session.battleMenu/defaultModel
                                                          (module.default.session.battleMenu/setUnits unit unitAtCursor)
                                                          (module.default.session.battleMenu/setLeftAction [:attack weapon] gameplayCtx))
                                                      inputCh outputCh))]
        (if isEnd
          (m/returnPop true)
          (recur gameplayCtx)))
      (let []
        (a/<! (module.default.phase.common/showMessage nil {:message (str "請選擇目標")} inputCh outputCh))
        (recur gameplayCtx)))))