(ns game.flow.has-cuts-component
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]
            [game.model-spec.core]
            [game.component.selection]
            [game.component.card-table]))
(s/def ::has-cuts (s/coll-of :game.define.player/id :kind set?))
(s/def ::has-cuts-component (s/keys :req-un [::has-cuts]))
(defn get-has-cut [ctx id]
  (s/assert ::has-cuts-component ctx)
  (s/assert :game.define.player/id id)
  (-> ctx :has-cuts id nil? not))
(defn set-has-cut [ctx id]
  (s/assert ::has-cuts-component ctx)
  (s/assert :game.define.player/id id)
  (update ctx :has-cuts into [id]))
(defn clear-has-cut [ctx]
  (s/assert ::has-cuts-component ctx)
  (assoc ctx :has-cuts #{}))