(ns game.define.runtime
  (:require [clojure.spec.alpha :as s]))

(s/def ::id any?)
(s/def ::err any?)
(s/def ::card-id (s/tuple ::err ::id))
(s/def ::player-id (s/tuple ::err ::id))
(s/def ::spec (s/keys :opt-un [::card-id ::player-id]))