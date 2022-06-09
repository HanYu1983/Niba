(ns app2.spec.cmd
  (:require [clojure.spec.alpha :as s]))

(s/def ::cost-color (s/tuple #{:color} any?))
(s/def ::cost-tap (s/tuple #{:tap} any?))
(s/def ::cost (s/or :color ::cost-color
                    :tap ::cost-tap))
(s/def ::costs (s/* ::cost))
(s/def ::card-id any?)
(s/def ::cmd-play-card (s/tuple #{:cmd-play-card} ::card-id ::costs))
(s/def ::cmd-next-step #{:cmd-next-step})
(s/def ::cmd (s/or :cmd-play-card ::cmd-play-card
                   :cmd-next-step ::cmd-next-step))