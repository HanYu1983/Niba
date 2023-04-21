(ns game.define.player
  (:require [clojure.spec.alpha :as s]
            [tool.card.table]))

(s/def ::id #{:A :B})
(s/def ::spec (s/keys :req-un [::id]))