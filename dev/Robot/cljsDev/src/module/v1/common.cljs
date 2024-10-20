(ns module.v1.common
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.map])
  (:require [tool.units]))

(def invalid ::s/invalid)

(def assert? true)

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        false)))

(defn assertSpec
  ([sp getter args]
   (if assert?
     (if (not (clojure.spec.alpha/valid? sp (getter args)))
       (throw (js/Error. (clojure.spec.alpha/explain-str sp (getter args))))
       args)
     args))
  ([sp args]
   (if assert?
     (if (not (clojure.spec.alpha/valid? sp args))
       (throw (js/Error. (clojure.spec.alpha/explain-str sp args)))
       args)
     args)))

(def actions {87 :up
              83 :down
              65 :left
              68 :right
              13 :enter
              222 :cancel
              38 :rup
              40 :rdown
              37 :rleft
              39 :rright
              81 :L
              69 :R})

(core/defwait playerTurnStart [ctx args])
(core/defwait enemyTurnStart [ctx args])
(core/defwait unitMoveAnim [ctx args])
(core/defwait unitTargetingAnim [ctx args])
(core/defwait unitBattleAnim [ctx args])
(core/defwait unitDeadAnim [ctx args])
(core/defwait paint [ctx args])
(core/defwait showMessage [ctx args])
(core/defwait unitSkyAnim [ctx args])
(core/defwait unitGroundAnim [ctx args])
(core/defwait unitGetAwardAnim [ctx args])
(core/defwait gameplayDone [ctx args])