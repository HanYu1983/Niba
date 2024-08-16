(ns game.flow.current-pay-component
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]
            [game.define.effect]
            [game.model-spec.core]
            [game.component.selection]
            [game.component.card-table]))

(s/def ::current-pay-effect (s/nilable :game.define.effect/value))
(s/def ::current-pay-logic-id (s/nilable any?))
(s/def ::current-pay-selection (s/map-of any? :game.define.selection/spec))
(s/def ::current-pay-component (s/keys :req-un [::current-pay-selection ::current-pay-effect ::current-pay-logic-id]))

(defn set-current-pay-effect [ctx text]
  (s/assert ::current-pay-component ctx)
  (s/assert ::current-pay-effect text)
  (assoc ctx :current-pay-effect text))
(defn get-current-pay-effect [ctx]
  (s/assert ::current-pay-component ctx)
  (-> ctx :current-pay-effect))
(defn has-current-pay-effect [ctx]
  (s/assert ::current-pay-component ctx)
  (get-current-pay-effect ctx))
(defn set-current-pay-logic-id [ctx logic]
  (s/assert ::current-pay-component ctx)
  (s/assert ::current-pay-logic-id logic)
  (assoc ctx :current-pay-logic-id logic))
(defn get-current-pay-logic-id [ctx]
  (s/assert ::current-pay-component ctx)
  (-> ctx :current-pay-logic-id))
(defn set-current-pay-selection [ctx k v]
  (s/assert ::current-pay-component ctx)
  (update ctx :current-pay-selection assoc k v))
(defn get-current-pay-selection [ctx]
  (s/assert ::current-pay-component ctx)
  (-> ctx :current-pay-selection))
(defn clear-current-pay-selection [ctx]
  (s/assert ::current-pay-component ctx)
  (assoc ctx :current-pay-selection {}))