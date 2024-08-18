(ns game.model.setgroup
  (:require [clojure.spec.alpha :as s]
            [tool.component.item-group :refer [get-item-group-from-root set-item-group-parent delete-item-group-parent]]
            [game.model-spec.core]))

(defn set-setgroup-character [ctx to-card-id card-id]
  (s/assert :game.model-spec.core/has-set-group ctx)
  (if (nil? to-card-id)
    (-> ctx (delete-item-group-parent card-id))
    (-> ctx (set-item-group-parent card-id to-card-id))))

(defn set-setgroup-operation-unit [ctx to-card-id card-id]
  (s/assert :game.model-spec.core/has-set-group ctx)
  (if (nil? to-card-id)
    (-> ctx (delete-item-group-parent card-id))
    (-> ctx (set-item-group-parent card-id to-card-id))))

(defn get-setgroup [ctx card-id]
  (s/assert :game.model-spec.core/has-set-group ctx)
  (-> ctx (get-item-group-from-root card-id)))