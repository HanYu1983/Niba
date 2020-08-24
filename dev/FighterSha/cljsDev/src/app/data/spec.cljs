(ns app.data.spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::life int?)
(s/def ::money int?)
(s/def ::character-id string?)
(s/def ::character-card (s/keys :req-un [::character-id ::life ::money]))
(s/def ::card-state (s/or :attack-card #{:attack-card}
                          :evade-card #{:evade-card}
                          :steal-card #{:steal-card}
                          :steal-money-card #{:steal-money-card}
                          :character-card ::character-card))