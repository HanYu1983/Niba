(ns app.gameplay.phase.unitSelectSingleTarget
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unit])
  (:require-macros [app.gameplay.macros :as m])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               actions]])
  (:require [app.gameplay.phase.unitBattleMenu :refer [unitBattleMenu]])
  (:require [app.gameplay.step.selectPosition]))

(m/defbasic unitSelectSingleTarget [gameplayCtx {:keys [unit attackRange weapon]}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil
  (m/basicNotify
   {:tempUnit unit})

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (app.gameplay.model/getCursor gameplayCtx)
        units (app.gameplay.model/getUnits gameplayCtx)
        unitAtCursor (tool.units/getByPosition units cursor)]
    (if unitAtCursor
      (let [[gameplayCtx isEnd] (a/<! (unitBattleMenu gameplayCtx
                                                      {:left unit
                                                       :leftAction [:attack weapon]
                                                       :right unitAtCursor
                                                       :rightAction [:pending]}
                                                      inputCh outputCh))]
        (if isEnd
          (m/returnPop true)
          (recur gameplayCtx)))
      (recur gameplayCtx))))