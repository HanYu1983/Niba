(ns app2.spec.desktop
  (:require [clojure.spec.alpha :as s]
            [app2.spec.card :as card]))

(s/def ::cards (s/coll-of ::card/card))
(s/def ::desktop (s/keys :req-un [::cards]))