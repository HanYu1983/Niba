(ns module.v1.step.selectPosition
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [module.v1.data])
  (:require [module.v1.common]))

(core/defstate selectPosition _
  {:nameCtx gameplayCtx
   :initCtx nil
   :updateCtx
   (do
     (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
     gameplayCtx)
   :nameFsm _
   :nameState state
   :initState {:menuCursor (tool.menuCursor/model menu)}}
  (let [[cmd args :as evt] (a/<! inputCh)
        gameplayCtx (-> gameplayCtx
                        (data/handleMapView evt))]
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
      (recur gameplayCtx))))