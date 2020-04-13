(ns module.default.phase.unitMenu
  (:require [clojure.core.async :as a])
  (:require [clojure.set])
  (:require [tool.map])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.menuCursor])
  (:require [module.default.data])
  (:require-macros [app.gameplay.macros :as m])
  (:require [module.default.phase.unitSelectMovePosition :refer [unitSelectMovePosition]])
  (:require [module.default.phase.common])
  (:require [module.default.data])
  (:require [module.default.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [module.default.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require-macros [module.default.phase.unitMenu])
  (:require [module.default.tmp]))


; 使用這個方法解決和unitSelectMovePosition的互相依賴
; 記得這裡有用到的引用也要在別的地方一起加上
; 雖然後來使用multimethod剛好避開這個問題, 但這裡的結構還是保存
(m/defwait unitSkyAnim [ctx args])
(m/defwait unitGroundAnim [ctx args])
(module.default.phase.unitMenuImpl/impl)