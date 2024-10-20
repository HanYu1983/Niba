(ns module.v1.step.menu
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.menuCursorViewSystem :as menuCursorViewSystem])
  (:require [module.v1.common :as common])
  (:require [module.v1.system.core :as systemCore])
  (:require-macros [module.v1.system.core :as systemCore]))

(defn handleCore [gameplayCtx inputCh outputCh [cmd args]]
  (a/go
    (let [state (-> gameplayCtx :fsm tool.fsm/load)]
      (cond
        (= "KEY_DOWN" cmd)
        (let [action (common/actions args)]
          (cond
            (= :enter action)
            (let [select (tool.menuCursor/getSelect (:menuCursor state))]
              [gameplayCtx select])
            
            (= :cancel action)
            [gameplayCtx "cancel"]

            :else
            gameplayCtx))

        :else
        gameplayCtx))))

(core/defstate menu {:keys [menu data]}
  {:nameCtx gameplayCtx
   :initState {:menuCursor (tool.menuCursor/model menu)
               :data data}
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [evt (a/<! inputCh)
          returnCtx (-> gameplayCtx
                        (data/handleTest evt)
                        (mapViewSystem/handleMapView evt)
                        (menuCursorViewSystem/handleMenuCursor evt)
                        (#(systemCore/asyncMapReturn handleCore % inputCh outputCh evt))
                        (a/<!))]
      (systemCore/return returnCtx))))