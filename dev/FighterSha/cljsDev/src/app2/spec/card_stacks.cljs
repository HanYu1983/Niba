(ns app2.spec.card-stacks
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            [app2.spec.card :as card]))

#_(s/def ::card-stack-name (fn [origin]
                             (re-find #"(\w)+-\w+" (str origin))))

#_(s/def ::card-stack-key (s/tuple #{:common :a :b} #{:home :gravyard :mana}))
#_(s/def ::card-stack-name (fn [origin]
                             (s/valid? ::card-stack-key ((comp cljs.reader/read-string clj->js) origin))))
#_(s/def ::card-stack (s/tuple ::card-stack-key (s/coll-of ::card/card)))
#_(s/def ::card-stacks (s/coll-of ::card-stack))