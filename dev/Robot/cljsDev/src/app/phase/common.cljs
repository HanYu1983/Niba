(ns app.phase.common
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [app.map])
  (:require [app.data])
  (:require [app.gameplay])
  (:require [app.fsm])
  (:require [app.unitState])
  (:require [app.units])
  (:require-macros [app.macros :as m]))


(m/defwait playerTurnStart [ctx args])
(m/defwait enemyTurnStart [ctx args])
(m/defwait updateMap [ctx args])
(m/defwait updateUnits [ctx args])
(m/defwait updateCursor [ctx args])
(m/defwait updateMoveRange [ctx args])
(m/defwait updateAttackRange [ctx args])

(m/defwait updatePlayTurn [ctx args])
(m/defwait updateUnitMenu [ctx args])
(m/defwait updateSystemMenu [ctx args])
(m/defwait updateUnitSelectMovePosition [ctx args])
(m/defwait updateUnitSelectSingleTarget [ctx args])
(m/defwait updateUnitBattleMenu [ctx args])
(m/defwait unitMoveAnim [ctx args])

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