(ns app.data.spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::attack-card (s/keys :req-un [::is-attack-card?]))
(s/def ::evade-card (s/keys :req-un [::is-evade-card?]))
(s/def ::steal-card (s/keys :req-un [::is-steal-card?]))
(s/def ::steal-money-card (s/keys :req-un [::is-steal-money-card?]))
(s/def ::life int?)
(s/def ::money int?)
(s/def ::character-card (s/keys :req-un [::is-character-card? ::life ::money]))
(s/def ::card (s/or :attack-card ::attack-card
                    :evade-card ::evade-card
                    :steal-card ::steal-card
                    :steal-money-card ::steal-money-card
                    :character-card ::character-card))
(s/def ::card-proto-id keyword?)
(s/def ::card-data (s/map-of ::card-proto-id ::card))