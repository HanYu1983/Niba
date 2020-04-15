(ns module.default.phase.common
  (:require [clojure.core.async :as a])
  (:require-macros [module.default.macros :as m]))

(m/defwait playerTurnStart [ctx args])
(m/defwait enemyTurnStart [ctx args])
(m/defwait unitMoveAnim [ctx args])
(m/defwait unitBattleAnim [ctx args])
(m/defwait unitDeadAnim [ctx args])
(m/defwait paint [ctx args])
(m/defwait showMessage [ctx args])

(def actions {87 :up
              83 :down
              65 :left
              68 :right
              13 :enter
              27 :cancel
              38 :rup
              40 :rdown
              37 :rleft
              39 :rright})