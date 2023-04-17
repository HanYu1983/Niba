(ns game.entity.flow-impl.ver1.flow-impl
  (:require [clojure.spec.alpha :as s]
            [game.entity.protocol.flow]
            [game.entity.flow-impl.ver1.flow-memory]))

(s/def ::flow-memory :game.entity.flow-impl.ver1.flow-memory/spec)
(s/def ::spec (s/keys :req-un [::flow-memory]))