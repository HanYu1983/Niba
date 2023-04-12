(ns game.define.basic
  (:require [clojure.spec.alpha :as s]
            
            [tool.card.table]))

(s/def ::table :tool.card.table/table)
(s/def ::battle-point (s/tuple #{"*" 1 2 3 4 5 6 7 8 9 0} #{"*" 1 2 3 4 5 6 7 8 9 0} #{"*" 1 2 3 4 5 6 7 8 9 0}))


