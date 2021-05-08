(ns app2.spec.card
  (:require [clojure.spec.alpha :as s]))

(s/def ::card-stack-id (s/tuple #{:common :a :b} #{:home :gravyard}))
(s/def ::id any?)
(s/def ::card (s/tuple ::id (s/keys :req-un [::face ::proto-id ::card-stack-id])))
(s/def ::face #{:up :down})