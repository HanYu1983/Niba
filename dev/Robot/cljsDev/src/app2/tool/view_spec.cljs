(ns app2.tool.view-spec
  (:require [clojure.spec.alpha :as s]
            [tool.menuCursor]))

(s/def ::vec2 (s/tuple int? int?))
(s/def ::positions (s/coll-of ::vec2))
(s/def ::moveRange ::positions)
(s/def ::attackRange ::positions)
(s/def ::map (s/coll-of vector?))
(s/def ::camera ::vec2)
(s/def ::cursor ::vec2)
(s/def ::viewsize ::vec2)
(s/def ::mapsize ::vec2)
(s/def ::mapView (s/keys :req-un [::map ::camera ::viewsize ::mapsize]))
(s/def ::unitsView (s/keys :req-un [::units ::camera ::viewsize]))
(s/def ::moveRangeView (s/keys :req-un [::units ::moveRange]
                               :opt-un [::camera]))
(s/def ::attackRangeView (s/keys :req-un [::attackRange ::camera]))
(s/def ::checkHitRateView (s/keys :req-un [::checkHitRate ::camera]))
(s/def ::cellStateView (s/keys :req-un [::units ::cursor]))


(s/def ::cursor-component (s/keys :req-un [::cursor ::mapsize]
                                  :opt-un [::camera ::units]))
(s/def ::menu-cursor ::tool.menuCursor/model)
(s/def ::menu-cursor-data (s/keys :opt-un [::unit ::weapon-idx ::transform-idx]))
(s/def ::menu-component (s/keys :req-un [::menu-cursor ::menu-cursor-data]))
(s/def ::unit-menu-component ::menu-component)
(s/def ::system-menu-component ::menu-component)