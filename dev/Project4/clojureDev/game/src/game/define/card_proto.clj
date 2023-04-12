(ns game.define.card-proto
  (:require [clojure.spec.alpha :as s]
            [game.define.card-text]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::type #{:unit :character :command :operation :operation-unit :graphic :ace})
(s/def ::texts (s/coll-of :game.define.card-text/spec))
(s/def ::spec (s/keys :req-un [::id ::type ::texts]))

#_(defmulti get-proto identity)

#_(defmethod get-proto :default [_] {:id :default
                                   :type :character})

(defn tests []
  #_(s/assert ::spec (get-proto 0)))