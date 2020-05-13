(ns module.v1.step.menu
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.common :as common]))

(core/defstate menu {:keys [menu data]}
  {:nameCtx gameplayCtx
   :initState {:menuCursor (tool.menuCursor/model menu)
               :data data}
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[cmd args :as evt] (a/<! inputCh)
          gameplayCtx (-> gameplayCtx
                          (data/handleMapView evt)
                          (data/handleMenuCursor evt))
          state (-> gameplayCtx :fsm tool.fsm/load)]
      (cond
        (= "KEY_DOWN" cmd)
        (let [action (common/actions args)]
          (cond
            (= :enter action)
            (let [select (tool.menuCursor/getSelect (:menuCursor state))]
              [gameplayCtx select])

            :else
            (recur gameplayCtx)))

        :else
        (recur gameplayCtx)))))