(ns game.component.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.require]))

(s/def ::require-type :game.define.require/type)
(s/def ::selection (s/map-of any? (s/coll-of any?)))
(s/def ::spec (s/keys :req-un [::selection]))

(defn get-selection [ctx key]
  (s/assert ::spec ctx)
  (get-in ctx [::selection key]))

(defn assert-selection [ctx key config]
  (s/assert ::spec ctx)
  (s/assert ::require-type config)
  (when-not (get-selection ctx key)
    (throw (ex-info "selection not found" {}))))

(defn set-selection [ctx key value]
  (s/assert ::spec ctx)
  (assoc-in ctx [::selection key] value))