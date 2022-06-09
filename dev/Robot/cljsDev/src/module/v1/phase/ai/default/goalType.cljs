(ns module.v1.phase.ai.default.goalType
  (:require [clojure.spec.alpha :as s]))

(defmulti goalType first)
(defmethod goalType :moveTo [_]
  (s/tuple keyword? (s/tuple int? int?)))

(defmethod goalType :findAndAttack [_]
  (s/tuple keyword?))

(defmethod goalType :think [_]
  (s/tuple keyword?))


(s/def ::goal (s/multi-spec goalType ::goal))