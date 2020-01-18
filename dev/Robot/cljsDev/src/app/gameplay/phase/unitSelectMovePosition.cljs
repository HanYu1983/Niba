(ns app.gameplay.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unit])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               paint
                                               unitMoveAnim
                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [app.gameplay.step.selectPosition]))

(declare unitMenu)

(m/defbasic unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil

  (-> (m/basicNotify
       {:tempMoveRange (let [[mw mh] app.gameplay.model/mapViewSize
                             shortestPathTree (app.gameplay.unit/getMovePathTree unit gameplayCtx)
                             moveRange (map first shortestPathTree)]
                         moveRange)}
      ((fn [gameplayCtx]
         (app.gameplay.model/setMoveRange gameplayCtx (-> gameplayCtx
                                                          (app.gameplay.model/getFsm)
                                                          (tool.fsm/load)
                                                          (:tempMoveRange)))))))

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (app.gameplay.model/getCursor gameplayCtx)
        camera (app.gameplay.model/getCamera gameplayCtx)
        path (tool.map/buildPath paths cursor)]
    (a/<! (unitMoveAnim gameplayCtx {:unit unit :path (map (partial app.gameplay.model/world2local camera) path)} inputCh outputCh))
    (let [tempUnit (app.gameplay.unit/onMove unit cursor gameplayCtx)
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
        (m/returnPop true)
        (let [tempUnit (:tempUnit state)
              units (-> gameplayCtx
                        (app.gameplay.model/getUnits)
                        (tool.units/delete tempUnit)
                        (tool.units/add unit))
              gameplayCtx (-> gameplayCtx
                              (app.gameplay.model/setUnits units))]
          (recur gameplayCtx))))))

(app.gameplay.phase.unitMenuImpl/impl)