(ns module.default.type.gameplayCtx
  (:require [clojure.spec.alpha :as s]))

(s/def ::map (s/coll-of vector?))
(s/def ::temp (s/keys :req-un [::cursor ::camera ::moveRange ::attackRange ::mapAttackRange]))
(s/def ::player (s/keys :req-un [::faction]))
(s/def ::players (s/map-of keyword? ::player))
(s/def ::gameplayCtx (s/keys :req-un [::map ::temp ::players ::units ::fsm]))

(def instance ::gameplayCtx)