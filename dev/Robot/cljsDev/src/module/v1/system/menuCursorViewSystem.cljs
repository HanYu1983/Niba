(ns module.v1.system.menuCursorViewSystem
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.common :as common])
  (:require [tool.fsm])
  (:require [tool.menuCursor]))


(defn handleMenuCursor [gameplayCtx [cmd args]]
  {:pre [(common/explainValid? ::spec/menuCursorView gameplayCtx)]}
  (common/assertSpec ::spec/menuCursorView gameplayCtx)
  (cond
    (= "KEY_DOWN" cmd)
    (let [action (common/actions args)]
      (cond
        (some #(= % action) [:up :down])
        (let [{:keys [fsm]} gameplayCtx
              state (tool.fsm/load fsm)
              state (update state :menuCursor (fn [ctx]
                                                (tool.menuCursor/mapCursor1 ctx (action {:up dec :down inc}))))
              fsm (tool.fsm/save fsm state)
              gameplayCtx (assoc gameplayCtx :fsm fsm)]
          gameplayCtx)

        (some #(= % action) [:left :right])
        (let [{:keys [fsm]} gameplayCtx
              state (tool.fsm/load fsm)
              state (update state :menuCursor (fn [ctx]
                                                (tool.menuCursor/mapCursor2 ctx nil (action {:left dec :right inc}))))
              fsm (tool.fsm/save fsm state)
              gameplayCtx (assoc gameplayCtx :fsm fsm)]
          gameplayCtx)

        :else
        gameplayCtx))
    :else
    gameplayCtx))