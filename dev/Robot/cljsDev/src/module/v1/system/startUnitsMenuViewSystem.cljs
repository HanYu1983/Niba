(ns module.v1.system.startUnitsMenuViewSystem
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [module.v1.system.spec :as spec]
            [module.v1.common :as common]
            [module.v1.data :as data])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [tool.fsm]))


(defn handleStartUnitsMenuView [gameplayCtx inputCh outputCh [cmd args]]
  (common/assertSpec ::spec/startUnitsMenuView gameplayCtx)
  (a/go
    (cond
      (= "KEY_DOWN" cmd)
      (let [action (common/actions args)]
        (cond
          (action #{:up :down})
          (let [state (-> gameplayCtx :fsm tool.fsm/load)
                {:keys [units]} state
                cnt (count (into [] units))
                state (update state :cursor (comp #(max 0 %)
                                                  #(min (dec cnt) %)
                                                  (action {:up dec :down inc})))
                gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
            gameplayCtx)

          (action #{:left :right})
          (let [state (-> gameplayCtx :fsm tool.fsm/load)
                {:keys [units selectedUnits cursor]} state
                cnt (count (into [] units))]
            (if (zero? cnt)
              gameplayCtx
              (let [selected (common/assertSpec
                              (s/nilable (s/tuple keyword? keyword?))
                              (-> units
                                  (#(into [] %))
                                  (nth cursor)))
                    selectedUnits (if selected
                                    (let [[key robotKey] selected
                                          power (data/getUnitPower {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} (data/createRobot gameplayCtx {:key key :robotState {:robotKey robotKey}}))
                                          selectedUnits (if (> power 0)
                                                          (if (contains? selectedUnits key)
                                                            (disj selectedUnits key)
                                                            (conj selectedUnits key))
                                                          (let [_ (a/<! (common/showMessage nil {:message (str "power is not enougth:" power)} inputCh outputCh))]
                                                            selectedUnits))]
                                      selectedUnits)
                                    selectedUnits)
                    state (assoc state :selectedUnits selectedUnits)
                    gameplayCtx (update gameplayCtx :fsm #(tool.fsm/save % state))]
                gameplayCtx)))

          :else
          gameplayCtx))

      :else
      gameplayCtx)))