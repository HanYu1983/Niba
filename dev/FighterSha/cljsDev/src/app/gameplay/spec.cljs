(ns app.gameplay.spec
  (:require [clojure.spec.alpha :as s])
  (:require [app.data.spec]))

(s/def ::player-id keyword?)
(s/def ::card-stack-id keyword?)
(s/def ::card-face #{:down :up})
(s/def ::card (s/keys :req-un [::card-id ::app.data.spec/card-state ::card-face]
                      :req-opt [::player-id]))

(s/def ::player (s/keys :req-un [::player-id]))
(s/def ::players (s/map-of ::player-id ::player))

(s/def ::card-stack (s/coll-of ::card))
(s/def ::card-stack-id (s/or :basic #{:home :gravyard}
                             :comp (fn [v]
                                     (or (re-matches #"[\w\d]+-equip" (clj->js v))
                                         (re-matches #"[\w\d]+-hand" (clj->js v))))))
(s/def ::card-stacks (s/map-of ::card-stack-id ::card-stack))

(s/def ::gameplay (s/keys :req-un [::card-stacks ::players]))

(defn card-stack-id-hand [player]
  (s/assert ::player player)
  (s/assert
   ::card-stack-id
   (keyword (str (clj->js (:player-id player)) "-hand"))))

(defn card-stack-id-equip [player]
  (s/assert ::player player)
  (s/assert
   ::card-stack-id
   (keyword (str (clj->js (:player-id player)) "-equip"))))