(ns app2.gameplay.spec
  (:require [clojure.spec.alpha :as s])
  (:require [tool.math]
            [tool.goal]
            [tool.rbush]
            [app2.weapon.spec]))

(s/def ::hp number?)
(s/def ::tags set?)
(s/def ::position ::tool.math/vec2)
(s/def ::last-position ::tool.math/vec2)
(s/def ::velocity ::tool.math/vec2)
(s/def ::timer number?)
(s/def ::expire-time number?)
(s/def ::shape (s/or :rect (s/tuple #{:rect} ::tool.math/vec2 ::tool.math/vec2)
                     :arc (s/tuple #{:arc} number? number? number?)
                     :circle (s/tuple #{:circle} number?)
                     :polygon (s/tuple #{:polygon} (s/coll-of ::tool.math/vec2))))

(s/def ::collision-group any?)
(s/def ::collision-state (s/keys :req-un [::shape ::collision-group]))
(s/def ::memory (s/map-of any? any?))
(s/def ::brain (s/keys :opt-un [::tool.goal/goal ::memory]))
(s/def ::weapon (s/merge ::app2.weapon.spec/weapon (s/keys :req-un [])))
(s/def ::weapons (s/coll-of ::app2.weapon.spec/weapon))
(s/def ::weapon-state (s/keys :req-un [::weapons]))
(s/def ::entity (s/keys :req-un [::id]
                        :opt-un [::hp
                                 ::tags
                                 ::position
                                 ::last-position
                                 ::velocity
                                 ::brain
                                 ::robot-state
                                 ::collision-state
                                 ::timer
                                 ::expire-time
                                 ::weapon-state]))
(s/def ::entities (s/map-of string? ::entity))


(s/def ::viewport ::tool.math/vec2)
(s/def ::camera ::tool.math/vec3)
(s/def ::state (s/keys :req-un [::entities ::viewport ::camera]))

(s/def ::js (s/keys :req-un [::tool.rbush/rbush]))
(s/def ::gameplay (s/keys :req-un [::state ::js]))

(s/def ::bullet-type #{:sword :bullet})
(s/def ::weapon-proto (s/keys :req-un [::bullet-count ::bullet-type]))
(def weapon-proto-pool (s/assert
                        (s/map-of any? ::weapon-proto)
                        {:sword {:bullet-count 99999
                                 :bullet-type :sword}
                         :gun {:bullet-count 6
                               :bullet-type :bullet}}))