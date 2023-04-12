(ns game.define.require
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::description string?)
(s/def ::type any?)
(s/def ::action any?)
(s/def ::spec (s/keys :req-un [::id ::description ::type ::action]))

(defn tests []
  (let [require1 (s/assert ::spec {:id :shoot
                                   :description "shoot"
                                   :type [:select :card 5 [:0 :1]]
                                   :action '(fn [ctx]
                                              (let [mid-value ctx]
                                                `(fn [~'ctx]
                                                   (let [~'result (+ ~mid-value ~'ctx)]
                                                     ~'result))))})
        action (eval (:action require1))
        action-ret (eval (action 100))
        _ (when (not (= 300 (action-ret 200)))
            (throw (Exception. "must 300")))]))
