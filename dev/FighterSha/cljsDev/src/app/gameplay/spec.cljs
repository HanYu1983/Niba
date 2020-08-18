(ns app.gameplay.spec
  (:require [clojure.spec.alpha :as s])
  (:require [app.data.spec]))

(s/def ::card-face #{:down :up})
(s/def ::card (s/keys :req-un [::card-id ::app.data.spec/card-proto-id ::card-state ::card-face ::player-id]))
(s/def ::player-id keyword?)
(s/def ::player (s/keys :req-un [::player-id]))
(s/def ::players (s/map-of keyword? ::player))
(s/def ::card-stack (s/coll-of ::card))
(s/def ::card-stacks (s/map-of keyword? ::card-stack))
(s/def ::gameplay (s/keys :req-un [::card-stacks ::players]))

(s/def ::error (s/nilable #(instance? js/Error %)))
