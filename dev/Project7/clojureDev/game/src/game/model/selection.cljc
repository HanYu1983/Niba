(ns game.model.selection
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]
            [game.model-spec.core]))

(defn create-selections []
  (->> {:selections {}}
       (s/assert :game.model-spec.core/has-selections)))

(defn get-selection [ctx key]
  (s/assert :game.model-spec.core/has-selections ctx)
  (get-in ctx [::selection key]))

(defn set-selection [ctx key value]
  (s/assert :game.model-spec.core/has-selections ctx)
  (s/assert :game.define.selection/spec value)
  (assoc-in ctx [::selection key] value))