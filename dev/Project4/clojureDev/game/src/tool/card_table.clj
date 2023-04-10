(ns tool.card-table
  (:require [clojure.spec.alpha :as s]))


(s/def ::card-stacks map?)
(s/def ::cards map?)
(s/def ::table (s/keys :req-un [::card-stacks ::cards]))

(def table {:card-stacks {}
            :cards {}})
