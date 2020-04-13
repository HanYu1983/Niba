(ns module.default.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [module.default.phase.unitMenuImpl])
  (:require-macros [module.default.phase.unitMenu])
  (:require [module.default.phase.common])
  (:require [app.gameplay.step.selectPosition])
  (:require [module.default.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [module.default.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [module.default.tmp]))

(declare unitMenu)

(m/defbasic unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil

  (m/basicNotify
   {:tempMoveRange (let [[mw mh] module.default.data/mapViewSize
                         shortestPathTree (module.default.tmp/gameplayGetUnitMovePathTree app.module/*module gameplayCtx unit)
                         moveRange (map first shortestPathTree)]
                     moveRange)}
   (module.default.data/setMoveRange gameplayCtx (-> gameplayCtx
                                                    (module.default.data/getFsm)
                                                    (tool.fsm/load)
                                                    (:tempMoveRange))))

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (module.default.data/getCursor gameplayCtx)
        camera (module.default.data/getCamera gameplayCtx)
        path (tool.map/buildPath paths cursor)]
    (if (> (count path) 1)
      (let [unitAtCursor (-> (module.default.data/getUnits gameplayCtx)
                             (tool.units/getByPosition cursor))]
        (if unitAtCursor
          (recur gameplayCtx)
          (do (a/<! (module.default.phase.common/unitMoveAnim gameplayCtx {:unit (module.default.data/mapUnitToLocal gameplayCtx nil unit) :path (map (partial module.default.data/world2local camera) path)} inputCh outputCh))
              (let [tempUnit (module.default.tmp/gameplayOnUnitMove app.module/*module gameplayCtx unit cursor)
                    state (merge state {:tempUnit tempUnit})
                    gameplayCtx (-> gameplayCtx
                                    (module.default.data/updateUnit unit (constantly tempUnit))
                                    (module.default.data/setFsm (tool.fsm/save fsm state)))
                    [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
                (if isEnd
                  (m/returnPop true)
                  (let [tempUnit (:tempUnit state)
                        gameplayCtx (module.default.data/updateUnit gameplayCtx tempUnit (constantly unit))]
                    (recur gameplayCtx)))))))
      (recur gameplayCtx))))


(m/defwait unitSkyAnim [ctx args])
(m/defwait unitGroundAnim [ctx args])
(module.default.phase.unitMenuImpl/impl)