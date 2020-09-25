(ns app2.gameplay.model
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rx]
            [cljs.reader])
  (:require [tool.rbush]
            [tool.math]
            [tool.goal]))

(s/def ::position ::tool.math/vec2)
(s/def ::last-position ::tool.math/vec2)
(s/def ::velocity ::tool.math/vec2)
(s/def ::radius number?)
(s/def ::timer number?)
(s/def ::expire-time number?)
(s/def ::collision-state (s/keys :req-un []))
(s/def ::memory (s/map-of any? any?))
(s/def ::brain (s/keys :req-opt [::tool.goal/goal ::memory]))
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt [::position
                                  ::last-position
                                  ::velocity
                                  ::radius
                                  ::brain
                                  ::robot-state
                                  ::collision-state
                                  ::timer
                                  ::expire-time]))
(s/def ::entities (s/map-of string? ::entity))


(s/def ::viewport ::tool.math/vec2)
(s/def ::camera ::tool.math/vec3)
(s/def ::state (s/keys :req-un [::entities ::viewport ::camera]))

(s/def ::js (s/keys :req-un [::tool.rbush/rbush]))
(s/def ::gameplay (s/keys :req-un [::state ::js]))


(def gameplay (s/assert
               ::gameplay
               {:state {:entities {"player" {:id "player"
                                             :position [0 0]
                                             :radius 10
                                             :player-state {}
                                             :robot-state {:heading [1 0]}}
                                   "ai" {:id "ai"
                                         :position [0 0]
                                         :last-position [0 0]
                                         :radius 5
                                         :robot-state {:heading [1 0]}
                                         :brain {:goal [:stack
                                                        [:think]]
                                                 :memory {}}}}
                        :viewport [800 640]
                        :camera [0 0 0.2]}
                :js {:outputSubject (rx/Subject.)
                     :rbush (tool.rbush/create {:compareMinX (fn [a b]
                                                               (- (- (get-in a [:position 0]) (:radius a))
                                                                  (- (get-in b [:position 0]) (:radius b))))
                                                :compareMinY (fn [a b]
                                                               (- (- (get-in a [:position 1]) (:radius a))
                                                                  (- (get-in b [:position 1]) (:radius b))))
                                                :toBBox (fn [item]
                                                          [(- (get-in item [:position 0]) (:radius item))
                                                           (- (get-in item [:position 1]) (:radius item))
                                                           (+ (get-in item [:position 0]) (:radius item))
                                                           (+ (get-in item [:position 1]) (:radius item))])})}}))