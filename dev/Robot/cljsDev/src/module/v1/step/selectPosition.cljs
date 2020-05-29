(ns module.v1.step.selectPosition
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [module.v1.type :as type])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.cursorViewSystem :as cursorViewSystem])
  (:require [module.v1.system.moveRangeViewSystem :as moveRangeViewSystem]))

(core/defstate selectPosition _
  {:nameCtx gameplayCtx
   :initState nil
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[cmd args :as evt] (a/<! inputCh)
          gameplayCtx (-> gameplayCtx
                          (data/handleTest evt)
                          (mapViewSystem/handleMapView evt)
                          (cursorViewSystem/handleCursorView evt)
                          (moveRangeViewSystem/handleMoveRangeView evt))]
      (cond
        (= "KEY_DOWN" cmd)
        (let [action (common/actions args)]
          (cond
            (= :cancel action)
            [gameplayCtx false]

            (= :enter action)
            [gameplayCtx true]

            :else
            (recur gameplayCtx)))

        :else
        (recur gameplayCtx)))))