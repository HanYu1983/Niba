(ns module.v1.phase.unitSelectAttackPosition
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.units])
  (:require [module.v1.data :as data])
  (:require [module.v1.common :as common])
  (:require [module.v1.type :as type])
  (:require [module.v1.step.selectPosition :refer [selectPosition]])
  (:require [module.v1.step.menu :refer [menu]]))

(core/defstate unitSelectAttackPosition  {unit :unit paths :paths}
  {:nameCtx gameplayCtx
   :initState nil
   :initCtx nil}
  (type/explainValid? (s/tuple ::type/unit) [unit])
  (loop [gameplayCtx gameplayCtx]
    (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
    (let [[gameplayCtx result] (a/<! (selectPosition gameplayCtx {} inputCh outputCh))]
      (cond
        (false? result)
        [gameplayCtx false]

        (true? result)
        (let [[gameplayCtx select] (a/<! (menu gameplayCtx {:menu [["ok"] ["cancel"]] :data {}} inputCh outputCh))]
          (cond
            (#{:cancel "cancel"} select)
            [gameplayCtx false]

            :else
            [gameplayCtx true?]))))))