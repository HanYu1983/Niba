(ns app3.tool.gameplay-spec
  (:require [clojure.spec.alpha :as s]
            [tool.menuCursor]))


(s/def ::key keyword?)
(s/def ::vec2 (s/tuple int? int?))
(s/def ::position ::vec2)
(s/def ::hp number?)
(s/def ::en number?)
(s/def ::curage int?)
(s/def ::player (s/keys :req-un [::key ::faction]))
(s/def ::players (s/map-of keyword? ::player))

(s/def ::bulletCount int?)
(s/def ::weaponLevel int?)
(s/def ::weaponKey ::key)
(s/def ::suitability (s/tuple number? number? number? number?))
(s/def ::type #{"single" "line"})
(s/def ::range (s/tuple int? int?))
(s/def ::weaponState (s/keys :req-un [::key ::weaponKey ::tags ::bulletCount]))

(s/def ::playerKey ::key)
(s/def ::robotKey ::key)

(s/def ::pilotKey ::key)
(s/def ::pilotState (s/nilable (s/keys :req-un [::key ::pilotKey ::exp ::expMelee ::expRange ::expEvade ::expGuard ::curage])))

(s/def ::componentKey ::key)
(s/def ::componentState (s/keys :req-un [::key ::componentKey ::tags]))

(s/def ::weaponEntry (s/tuple keyword? (s/* ::weaponState)))
(s/def ::componentEntry (s/tuple keyword? (s/* ::componentState)))
(s/def ::weapons (s/map-of keyword? (s/* ::weaponState)))
(s/def ::components (s/map-of keyword? (s/* ::componentState)))

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
; 是否攻擊過與攻擊的武器
(defmethod tagEntry :attackWeapon [_] (s/tuple keyword? ::weaponState))

(s/def ::tagEntry (s/multi-spec tagEntry ::tagEntry))
(s/def ::tags (s/and (s/map-of keyword? any?)
                     (s/coll-of ::tagEntry)))

(s/def ::robotState (s/keys :req-un [::robotKey ::pilotState ::weapons ::components ::tags ::hp ::en]))
(s/def ::robot (s/keys :req-un [::key ::position ::playerKey ::robotState]))

(s/def ::itemKeyType #{:weapon :component})
(s/def ::itemKey keyword?)
(s/def ::itemAmount int?)
(s/def ::itemKeyType (s/keys :req-un [::itemKeyType ::itemKey ::itemAmount]))
(s/def ::itemKeyTypeList (s/coll-of ::itemKeyType))
(s/def ::itemRareRate number?)
(s/def ::itemState (s/keys :req-un [::itemKeyTypeList ::itemRareRate]))
(s/def ::item (s/keys :req-un [::key ::position ::itemState]))

(s/def ::unit (s/or :robot ::robot
                    :item ::item))
(s/def ::units (s/map-of ::key ::unit))

(s/def ::money int?)
(s/def ::cause #{:giveUp :pass})
(s/def ::done (s/keys :req-un [::cause]))
(s/def ::active-player-key ::key)
(s/def ::gameplayCtx (s/keys :req-un [::units ::numberOfTurn ::money ::players ::active-player-key]
                             :req-opt [::done]))