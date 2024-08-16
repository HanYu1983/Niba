(ns game.model.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]
            [game.model-spec.core]))

(defn get-selection [ctx key]
  (s/assert :game.model-spec.core/has-selection ctx)
  (get-in ctx [::selection key]))

(defn set-selection [ctx key value]
  (s/assert :game.model-spec.core/has-selection ctx)
  (s/assert :game.define.selection/spec value)
  (assoc-in ctx [::selection key] value))