(ns game.component.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]))

(s/def ::selection (s/map-of any? (s/coll-of any?)))
(s/def ::spec (s/keys :req-un [::selection]))

(defn get-selection [ctx key]
  (s/assert ::spec ctx)
  (get-in ctx [::selection key]))

(defn set-selection [ctx key value]
  (s/assert ::spec ctx)
  (s/assert :fame.define.selection/spec value)
  (assoc-in ctx [::selection key] value))