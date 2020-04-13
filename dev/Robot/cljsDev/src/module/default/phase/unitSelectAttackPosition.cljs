(ns module.default.phase.unitSelectAttackPosition
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require [module.default.phase.common])
  (:require [module.default.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.step.selectPosition])
  (:require [app.gameplay.step.menu])
  (:require [module.default.tmp]))

(m/defbasic unitSelectAttackPosition [gameplayCtx {unit :unit paths :paths}]
  [[gameplayCtx result] (a/<! (app.gameplay.step.selectPosition/selectPosition gameplayCtx {} inputCh outputCh))]
  
  nil
  (m/basicNotify
   {:tempUnit unit})

  (false? result)
  (m/returnPop false)

  (true? result)
  (let [[gameplayCtx select] (a/<! (app.gameplay.step.menu/menu gameplayCtx {:menu [["ok"] ["cancel"]] :data {}} inputCh outputCh))]
    (cond
      (some #(= select %) [:cancel "cancel"])
      (m/returnPop false)

      :else
      (m/returnPop true))))