(ns game.define.require
  (:require [clojure.spec.alpha :as s]
            [game.define.basic]
            [game.define.card]
            [game.define.basyou]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::description string?)

(s/def ::type-select-card (s/tuple #{:select-card}
                                    set?
                                   (s/coll-of (s/tuple :game.define.card/id float?))))
(s/def ::type-select-basyou (s/tuple #{:select-basyou}
                                      set?
                                     (s/coll-of (s/tuple :game.define.basyou/spec float?))))
(s/def ::type-select-battle-point (s/tuple #{:select-battle-point}
                                           set?
                                           (s/coll-of (s/tuple :game.define.basic/battle-point float?))))
(s/def ::type (s/or :type-select-card ::type-select-card
                    :type-select-basyou ::type-select-basyou
                    :type-select-battle-point ::type-select-battle-point))
(s/def ::action any?)
(s/def ::spec (s/keys :req-un [::id ::description ::type ::action]))

(defn tests []
  (let [require1 (s/assert ::spec {:id :shoot
                                   :description "shoot"
                                   :type [:select-card #{5} [[0 0.0]]]
                                   :action '(fn [ctx]
                                              (let [mid-value ctx]
                                                `(fn [~'ctx]
                                                   (let [~'result (+ ~mid-value ~'ctx)]
                                                     ~'result))))})
        action (eval (:action require1))
        action-ret (eval (action 100))
        _ (when (not (= 300 (action-ret 200)))
            (throw (Exception. "must 300")))]))
