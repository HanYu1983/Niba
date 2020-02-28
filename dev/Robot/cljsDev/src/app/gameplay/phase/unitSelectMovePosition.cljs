(ns app.gameplay.phase.unitSelectMovePosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.model])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [app.gameplay.phase.common])
  (:require [app.gameplay.step.selectPosition]))

(declare unitMenu)

(m/defbasic unitSelectMovePosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]

  nil

  (m/basicNotify
   {:tempMoveRange (let [[mw mh] app.gameplay.model/mapViewSize
                         shortestPathTree (app.module/gameplayGetUnitMovePathTree app.module/*module gameplayCtx unit)
                         moveRange (map first shortestPathTree)]
                     moveRange)}
   (app.gameplay.model/setMoveRange gameplayCtx (-> gameplayCtx
                                                    (app.gameplay.model/getFsm)
                                                    (tool.fsm/load)
                                                    (:tempMoveRange))))

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [cursor (app.gameplay.model/getCursor gameplayCtx)
        camera (app.gameplay.model/getCamera gameplayCtx)
        path (tool.map/buildPath paths cursor)]
    (if (> (count path) 1)
      (let [unitAtCursor (-> (app.gameplay.model/getUnits gameplayCtx)
                             (tool.units/getByPosition cursor))]
        (if unitAtCursor
          (recur gameplayCtx)
          (do (a/<! (app.gameplay.phase.common/unitMoveAnim gameplayCtx {:unit (app.gameplay.model/mapUnitToLocal gameplayCtx nil unit) :path (map (partial app.gameplay.model/world2local camera) path)} inputCh outputCh))
              (let [tempUnit (app.module/gameplayOnUnitMove app.module/*module gameplayCtx unit cursor)
                    state (merge state {:tempUnit tempUnit})
                    gameplayCtx (-> gameplayCtx
                                    (app.gameplay.model/updateUnit unit (constantly tempUnit))
                                    (app.gameplay.model/setFsm (tool.fsm/save fsm state)))
                    [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
                (if isEnd
                  (m/returnPop true)
                  (let [tempUnit (:tempUnit state)
                        gameplayCtx (app.gameplay.model/updateUnit gameplayCtx tempUnit (constantly unit))]
                    (recur gameplayCtx)))))))
      (recur gameplayCtx))))

(app.gameplay.phase.unitMenuImpl/impl)