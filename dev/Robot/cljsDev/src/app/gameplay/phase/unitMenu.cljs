(ns app.gameplay.phase.unitMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [app.gameplay.model])
  (:require [app.gameplay.unit])
  (:require-macros [app.gameplay.macros :as m])
  (:require-macros [app.gameplay.phase.unitMenuImpl])
  (:require [app.gameplay.phase.common :refer [playerTurnStart
                                               enemyTurnStart
                                               updateMap
                                               updateUnits
                                               updateCursor
                                               updateMoveRange
                                               updateAttackRange

                                               updateUnitSelectMovePosition
                                               updateUnitMenu
                                               unitMoveAnim

                                               actions]])
  (:require [app.gameplay.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [app.gameplay.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [app.gameplay.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]]))

; 使用這個方法解決和unitSelectMovePosition的互相依賴
; 記得這裡有用到的引用也要在別的地方一起加上
(app.gameplay.phase.unitMenuImpl/impl)