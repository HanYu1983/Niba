(ns app2.tool.gameplay-spec
  (:require [clojure.spec.alpha :as s]
            [tool.menuCursor]))

(s/def ::vec2 (s/tuple int? int?))
(s/def ::cursor ::vec2)
(s/def ::mapsize ::vec2)
(s/def ::camera ::vec2)

(s/def ::key string?)
(s/def ::unit (s/keys :req-un [::key]))
(s/def ::units (s/map-of string? ::unit))

(s/def ::cursor-component (s/keys :req-un [::cursor ::mapsize]
                                  :opt-un [::camera ::units]))

(s/def ::menu-cursor ::tool.menuCursor/model)
(s/def ::menu-cursor-data (s/keys :opt-un [::unit ::weapon-idx ::transform-idx]))
(s/def ::menu-component (s/keys :req-un [::menu-cursor ::menu-cursor-data]))

(s/def ::unit-menu-component ::menu-component)
(s/def ::system-menu-component ::menu-component)