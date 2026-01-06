(ns node.spec.lobby
  (:require [clojure.spec.alpha :as s]))

(s/def ::lobby (s/keys :req-un []))