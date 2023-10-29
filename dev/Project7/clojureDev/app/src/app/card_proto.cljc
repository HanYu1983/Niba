(ns app.card-proto
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]))



(s/def ::texts any?)
(s/def ::card-type any?)
(s/def ::card-proto (s/keys :req-un [::id ::texts ::card-type]
                            :opt-un [::description]))


(def ^:private card-id "gundam")
(def card-proto-default {:id "gundam"
                         :texts2 [{:id (str card-id "-text-1")
                                   :type [:abi1 3]}
                                  {:id (str card-id "-text-2")
                                   :type [:abi1 4]}
                                  {:id (str card-id "-text-3")
                                   :type [:use :battle-phase]
                                   :text {}}]
                         :texts {"gundam-text-1" {:type [:abi1 3]
                                                  :events ['(fn [ctx runtime evt])]
                                                  :global-effects []
                                                  :condition {"1" {:tips '()
                                                                   :count 1
                                                                   :options {}
                                                                   :action '(fn [ctx runtime])}
                                                              "in-battle-phase" {:action '(fn [ctx runtime]
                                                                                            (assert-in-battle-phase ctx))}}
                                                  :logic '(And (Leaf "1")
                                                               (Leaf "in-battle-phase"))
                                                  :action '(fn [ctx runtime])}
                                 "gundam-text-2" {:type [:abi1 4]}}
                         :card-type :G
                         :gsign [:blue :UC]
                         :battle-point [2 1 2]
                         :char "gundam xx ee"
                         :cost [:normal [:blue :blue nil nil nil]]
                         :pack :gundam})


(def card {:id ""
           :card-proto-id ""
           :status {}})