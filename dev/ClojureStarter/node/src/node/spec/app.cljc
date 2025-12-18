(ns node.spec.app
  (:require [clojure.spec.alpha :as s]))

(s/def :robot/id any?)
(s/def :robot/name string?)
(s/def ::robot (s/keys :req-un [:robot/id :robot/name]))

(s/def ::map-item-id any?)
(s/def ::map-item (s/or :robot ::robot))

(s/def :map/cells (s/coll-of (s/tuple :robot/id :robot/name)))
(s/def :map/item-position (s/map-of ::map-item-id ::map-item))
(s/def ::map (s/keys :req-un [:map/item-position :map/cells]))

(s/def ::app (s/keys :req-un [::map]))