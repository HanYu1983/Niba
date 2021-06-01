(ns app2.spec.app
  (:require [clojure.spec.alpha :as s]
            [app2.spec.gameplay :as spec-gameplay]))

(s/def ::app (s/keys :opt-un [::spec-gameplay/gameplay ::lobby]))

(def path-cards [:gameplay :desktop :cards])
(def path-phase-step [:gameplay :phase-step])
(def path-tags [:gameplay :tags])