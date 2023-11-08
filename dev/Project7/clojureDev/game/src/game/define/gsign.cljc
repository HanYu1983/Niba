(ns game.define.gsign
  (:require [clojure.spec.alpha :as s]))


; "緑" | "茶" | "青" | "白" | "紫" | "黒" | "赤" | "デュアル";
(s/def ::color #{:green :brown :blue :white :purple :black :red})
(s/def ::property #{:uc :08})
(s/def ::spec (s/tuple ::color ::property))

(defn can-pay-roll-cost
  "紫國力用1個紫或2個非紫的支付
   其它國力用1個相應國力支付"
  [color pay-colors]
  (when (not (vector? pay-colors))
    (throw (ex-info "pay-colors must vec" {})))
  (cond
    (= color :purple)
    (or (->> pay-colors (= [:purple]))
        (->> pay-colors (filter #(not (= :purple %))) count (= 2)))
    :else
    (->> pay-colors (= [color]))))

(defn tests []
  (doall (for [[color pay-colors] [[:purple [:purple]]
                                   [:purple [:blue :white]]
                                   [:blue [:blue]]
                                   [:white [:white]]
                                   [:black [:black]]
                                   [:red [:red]]]]
           (when (not (can-pay-roll-cost color pay-colors))
             (throw (ex-info (str color " can not use " pay-colors " to pay") {})))))
  (doall (for [[color pay-colors] [[:purple [:blue]]
                                   [:purple [:blue :purple]]
                                   [:blue [:white]]
                                   [:white [:black]]
                                   [:black [:red]]
                                   [:red [:black]]
                                   [:red [:red :red]]]]
           (when (can-pay-roll-cost color pay-colors)
             (throw (ex-info (str color " must can not use " pay-colors " to pay") {}))))))