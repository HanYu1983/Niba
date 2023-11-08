(ns game.define.effect
  (:require [clojure.spec.alpha :as s]
            [game.tool.logic-tree]
            [game.define.card-text]
            [game.define.gsign]
            [game.common.dynamic]))

(s/def ::text :game.define.card-text/spec)
(s/def ::value (s/keys :req-un [::reason ::is-immediate ::clear-cutin-status ::text]))
(s/def ::spec (s/tuple any? ::value))