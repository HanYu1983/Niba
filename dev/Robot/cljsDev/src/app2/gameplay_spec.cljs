(ns app2.gameplay-spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::vec2 (s/tuple int? int?))
(s/def ::cursor ::vec2)
(s/def ::mapsize ::vec2)
(s/def ::camera ::vec2)

(s/def ::key string?)
(s/def ::unit (s/keys :req-un [::key]))
(s/def ::units (s/map-of string? ::unit))

(s/def ::cursor-component (s/keys :req-un [::cursor ::mapsize]
                                  :opt-un [::camera ::units]))
