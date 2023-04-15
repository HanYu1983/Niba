(ns game.define.card-proto
  (:require [clojure.spec.alpha :as s]
            [game.define.card-text]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::type #{:unit :character :command :operation :operation-unit :graphic :ace})
(s/def ::texts (s/coll-of :game.define.card-text/spec))
(s/def ::spec (s/keys :req-un [::id ::type ::texts]))

(def card-proto {:id :test
                 :type :unit
                 :texts []})

(defn tests []
  #_(s/assert ::spec (get-proto 0)))