(ns app2.spec.cmd
  (:require [clojure.spec.alpha :as s]))

(s/def ::cost-color (s/tuple #{:color} any?))
(s/def ::cost-tap (s/tuple #{:tap} any?))
(s/def ::cost (s/or :color ::cost-color
                    :tap ::cost-tap))
(s/def ::costs (s/* ::cost))
(s/def ::cmd-play-card (s/keys :req-un [::costs ::card-id ::player-id]))
(s/def ::cmd-next-step #{:cmd-next-step})