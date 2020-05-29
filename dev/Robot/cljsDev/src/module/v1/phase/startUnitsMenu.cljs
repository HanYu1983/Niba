(ns module.v1.phase.startUnitsMenu
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require-macros [module.v1.core :as core]))

(core/defstate startUnitsMenu  {:keys [units]}
  {:nameCtx gameplayCtx
   :initState
   {:units units
    :cursor 0
    :selectedUnits #{}}
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[cmd args :as evt] (a/<! inputCh)
          gameplayCtx (-> gameplayCtx
                          (data/handleTest evt)
                          (data/handleStartUnitsMenuView evt))]
      (common/explainValid? ::type/startUnitsMenuView gameplayCtx)
      (cond
        (= "KEY_DOWN" cmd)
        (let [action (common/actions args)]
          (cond
            (action #{:enter})
            [gameplayCtx (-> gameplayCtx :fsm tool.fsm/load :selectedUnits)]

            :else
            (recur gameplayCtx)))

        :else
        (recur gameplayCtx)))))