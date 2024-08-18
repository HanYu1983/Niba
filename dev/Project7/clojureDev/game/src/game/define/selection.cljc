(ns game.define.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.tip]))

(s/def ::spec (s/coll-of any?))

(defn tests [] )

