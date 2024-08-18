(ns game.define.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.tip]))

(s/def ::spec :game.define.tip/tip-type)

(defn tests [] )

