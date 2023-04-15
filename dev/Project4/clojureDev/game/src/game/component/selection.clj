(ns game.component.selection
  (:require [clojure.spec.alpha :as s]))

(s/def ::selection (s/map-of any? any?))
(s/def ::spec (s/keys :req-un [::selection]))

(defn get-selection [ctx key]
  (s/assert ::spec ctx))

(defn assert-selection [ctx key config]
  (s/assert ::spec ctx))

(defn set-selection [ctx key value]
  (s/assert ::spec ctx)
  ctx)