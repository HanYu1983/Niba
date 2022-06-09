(ns app.spec
  (:require [clojure.spec.alpha :as s]))
; tank
(s/def ::tank (s/keys :req-un [::id ::body]))

; tank-manager
(s/def :tank-manager/tanks (s/map-of string? ::tank))
(s/def ::tank-manager (s/keys :req-un [:tank-manager/tanks]))
(defn find-nearby-tank [tank-manager]
  {:pre [(s/assert ::tank-manager tank-manager)]}
  {})