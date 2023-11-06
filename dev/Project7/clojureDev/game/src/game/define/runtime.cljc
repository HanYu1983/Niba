(ns game.define.runtime
  (:require [clojure.spec.alpha :as s]))

(s/def ::spec (s/keys :opt-un [::card-id ::player-id]))