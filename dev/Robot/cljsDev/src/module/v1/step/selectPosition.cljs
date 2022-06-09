(ns module.v1.step.selectPosition
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [module.v1.type :as type])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.cursorViewSystem :as cursorViewSystem])
  (:require [module.v1.system.moveRangeViewSystem :as moveRangeViewSystem])
  (:require [module.v1.system.core :as systemCore])
  (:require-macros [module.v1.system.core :as systemCore]))


(defn handleCore [gameplayCtx inputCh outputCh [cmd args]]
  (a/go
    (cond
      (= "KEY_DOWN" cmd)
      (let [action (common/actions args)]
        (cond
          (= :cancel action)
          [gameplayCtx false]

          (= :enter action)
          [gameplayCtx true]

          :else
          gameplayCtx))

      :else
      gameplayCtx)))

(core/defstate selectPosition {:keys [updateMoveRange?]}
  {:nameCtx gameplayCtx
   :initState nil
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [evt (a/<! inputCh)
          returnCtx (-> gameplayCtx
                        (data/handleTest evt)
                        (mapViewSystem/handleMapView evt)
                        (cursorViewSystem/handleCursorView evt)
                        (moveRangeViewSystem/handleMoveRangeView updateMoveRange? evt)
                        (#(systemCore/asyncMapReturn handleCore % inputCh outputCh evt))
                        (a/<!))]
      (systemCore/return returnCtx))))