(ns module.v1.type
  (:require [clojure.spec.alpha :as s])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [app.lobby.model]))

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        (println args)
        false)))

(defn assertSpec [sp args]
  (when true
    (when (not (clojure.spec.alpha/valid? sp args))
      (println (clojure.spec.alpha/explain-str sp args))
      (println args)
      (throw (js/Error. (str "error"))))))

(s/def ::key keyword?)
(s/def ::position (s/tuple int? int?))
(s/def ::hp number?)
(s/def ::en number?)
(s/def ::player (s/keys :req-un [::faction ::playerState]))
(s/def ::players (s/map-of keyword? ::player))

(defmulti tagEntry first)
; 是否飛行
(defmethod tagEntry :sky [_] (s/tuple keyword? boolean?))
; 上一回合的移動的速率(兩點間的距離)
(defmethod tagEntry :velocity [_] (s/tuple keyword? number?))
; 是否行動完畢
(defmethod tagEntry :done [_] (s/tuple keyword? boolean?))
; 是否移動過
(defmethod tagEntry :moveCount [_] (s/tuple keyword? int?))
(defmethod tagEntry :moveRangePlus [_] (s/tuple keyword? boolean?))
(defmethod tagEntry :weaponRangePlus [_] (s/tuple keyword? boolean?))

(s/def ::tagEntry (s/multi-spec tagEntry ::tagEntry))
(s/def ::tags (s/and (s/map-of keyword? any?)
                     (s/coll-of ::tagEntry)))

(s/def ::bulletCount int?)
(s/def ::weaponLevel int?)
(s/def ::weaponKey ::key)
(s/def ::suitability (s/tuple number? number? number? number?))
(s/def ::type #{"single" "line"})
(s/def ::range (s/tuple int? int?))
(s/def ::weapon (s/keys :req-un [::key ::weaponKey ::weaponLevel ::tags ::bulletCount]
                        :opt-un [::range ::type ::suitability]))

(s/def ::playerKey ::key)
(s/def ::robotKey ::key)
(s/def ::pilotKey ::key)
(s/def ::componentKey ::key)

(s/def ::component (s/keys :req-un [::key ::componentKey ::tags]))

(s/def ::weaponEntry (s/tuple keyword? (s/* ::weapon)))
(s/def ::componentEntry (s/tuple keyword? (s/* ::component)))
(s/def ::weapons (s/map-of keyword? (s/* ::weapon)))
(s/def ::components (s/map-of keyword? (s/* ::component)))

(s/def ::robotState (s/keys :req-un [::robotKey ::pilotKey ::weapons ::components ::tags ::hp ::en]))
(s/def ::robot (s/keys :req-un [::key ::position ::playerKey ::robotState]))

(s/def ::itemKey keyword?)
(s/def ::itemState (s/keys :req-un [::itemKey]))
(s/def ::item (s/keys :req-un [::key ::position ::itemState]))

(s/def ::unit (s/or :robot ::robot
                    :item ::item))

(s/def ::units tool.units/modelType)

(s/def ::gameplayCtx (s/keys :req-un [::fsm ::units]))

(s/def ::returnCtx (s/or :recur ::gameplayCtx
                         :return (s/tuple ::gameplayCtx (constantly true))))

; for macro
(def gameplayCtx ::gameplayCtx)
(def returnCtx ::returnCtx)
(def unit ::unit)