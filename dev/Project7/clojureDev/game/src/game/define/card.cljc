(ns game.define.card
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [game.tool.card.table]))
(s/def ::value (s/keys :req-un [::proto]))
(s/def ::spec (s/tuple any? ::value))