(ns game.define.table-item
  (:require [clojure.spec.alpha :as s]
            [game.define.table-item-card]
            [game.define.table-item-chip]
            [game.define.table-item-coin]))
(s/def ::value (s/or :card :game.define.table-item-card/value
                     :chip :game.define.table-item-chip/value
                     :coin :game.define.table-item-coin/value))
(s/def ::spec (s/tuple any? ::value))