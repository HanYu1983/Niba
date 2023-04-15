(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.define.basic]
            [game.define.require]
            [game.tool]
            [tool.card.table]))

(s/def ::id any?)
(s/def ::description string?)
(s/def ::type #{[:automatic :residents]
                [:automatic :trigger]
                [:automatic :constant]
                :use
                :special})
(s/def ::spec (s/keys :req-un [::id
                               ::description
                               ::type]
                      :opt-un [::effects
                               ::requires
                               ::on-event
                               ::is-surrounded-by-arrows]))

(def card-text {:id :shoot
                :description "shoot"
                :type [:automatic :residents]
                :effects '(fn [ctx runtime])
                :requires '(fn [ctx runtime]
                             (let [mid-value (+ ctx (game.tool/do-something))]
                               [{:id :shoot
                                 :description "shoot"
                                 :type [:select :card 5 [:0 :1]]
                                 :action `(fn [~'ctx ~'runtime])}]))
                :on-event '(fn [ctx evt runtime])})

(defn tests-text []
  (let [text (s/assert ::spec (read-string (str {:id :shoot
                                                 :description "shoot"
                                                 :type [:automatic :residents]
                                                 :effects '(fn [ctx runtime])
                                                 :requires '(fn [ctx runtime]
                                                              (let [mid-value (+ ctx (game.tool/do-something))]
                                                                [{:id :shoot
                                                                  :description "shoot"
                                                                  :type [:select :card 5 [:0 :1]]
                                                                  :action `(fn [~'ctx ~'runtime]
                                                                             (let [~'result (+ ~mid-value ~'ctx (game.tool/do-something))]
                                                                               ~'result))}]))})))
        requires (eval (:requires text))
        action (-> (requires 100 nil) first :action eval)
        result (action 200 nil)
        _ (when (not (= 2300 result))
            (throw (Exception. "must 2300")))]))

(defn tests []
  (tests-text)
  (let [text-type (s/assert ::type [:automatic :residents])
        _ (when (not (= :residents (match text-type
                                     [:automatic sub-type] sub-type
                                     :use "use"
                                     :special "special"
                                     :else "else")))
            (throw (Exception. "match not right")))]))