(ns app2.card-data.card1
  (:require
   [app2.common.domain :as domain :refer :all])
  (:require
   [clara.rules]
   [clara.rules.accumulators]))


(def defrule clara.rules/defrule)
(def defquery clara.rules/defquery)