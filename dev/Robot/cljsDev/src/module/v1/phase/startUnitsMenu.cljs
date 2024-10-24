(ns module.v1.phase.startUnitsMenu
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.system.startUnitsMenuViewSystem :as startUnitsMenuViewSystem])
  (:require-macros [module.v1.core :as core])
  (:require [module.v1.system.core :as systemCore])
  (:require-macros [module.v1.system.core :as systemCore]))

(defn handleCore [gameplayCtx inputCh outputCh [cmd args]]
  (common/explainValid? ::spec/startUnitsMenuView gameplayCtx)
  (a/go
    (cond
      (= "KEY_DOWN" cmd)
      (let [action (common/actions args)]
        (cond
          (action #{:enter})
          [gameplayCtx (-> gameplayCtx :fsm tool.fsm/load :selectedUnits)]

          :else
          gameplayCtx))

      :else
      gameplayCtx)))

(core/defstate startUnitsMenu  {:keys [units]}
  {:nameCtx gameplayCtx
   :initState
   {:units units
    :cursor 0
    :selectedUnits #{}}
   :initCtx nil}
  (common/assertSpec (s/map-of keyword? keyword?) units)
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [evt (a/<! inputCh)
          returnCtx (-> gameplayCtx
                        (data/handleTest evt)
                        (startUnitsMenuViewSystem/handleStartUnitsMenuView inputCh outputCh evt)
                        (a/<!)
                        (#(systemCore/asyncMapReturn handleCore % inputCh outputCh evt))
                        (a/<!))]
      (systemCore/return returnCtx))))