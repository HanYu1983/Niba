(ns app.card-proto
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]))



(s/def ::texts any?)
(s/def ::card-type any?)
(s/def ::card-proto (s/keys :req-un [::id ::texts ::card-type]
                            :opt-un [::description]))


(def ^:private card-id "gundam")
(def card-proto-default {:id card-id
                         :texts [{:id (str card-id "-text-1")
                                  :type [:abi1 3]}
                                 {:id (str card-id "-text-2")
                                  :type [:abi1 4]}
                                 {:id (str card-id "-text-3")
                                  :type [:use :battle-phase]
                                  :text {}}]
                         :textss {(str card-id "-text-1") {:type [:abi1 3]}
                                  (str card-id "-text-2") {}}
                         :card-type :G})


(def card {:id ""
           :card-proto-id ""
           :status {}})