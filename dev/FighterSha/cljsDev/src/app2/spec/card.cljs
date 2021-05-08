(ns app2.spec.card
  (:require [clojure.spec.alpha :as s]))

(s/def ::card-stack-id (s/tuple any? any?))
(s/def ::id (s/tuple ::card-stack-id any?))
(s/def ::card (s/tuple ::id (s/keys :req-un [::face ::proto-id])))
(s/def ::face #{:up :down})