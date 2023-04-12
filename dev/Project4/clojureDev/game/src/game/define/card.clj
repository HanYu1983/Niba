(ns game.define.card
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::spec (s/keys :req-un [::id]))