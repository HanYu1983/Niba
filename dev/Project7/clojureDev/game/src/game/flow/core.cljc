(ns game.flow.core
  (:require [clojure.spec.alpha :as s]
            [game.define.selection]
            [game.model-spec.core]))

(s/def ::flow (s/merge :game.flow.current-pay-component/current-pay-component
                       :tool.component.flags-component/flags-component
                       :game.flow.has-cuts-component/has-cuts-component))
(defn create-flow []
  (->> {:has-cuts #{}
        :flags #{}
        :current-pay-selection {}
        :current-pay-effect nil
        :current-pay-logic-id nil}
       (s/assert ::flow)))