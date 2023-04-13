(ns game.component.spec
  (:require [clojure.spec.alpha :as s]))

(s/def ::block any?)
(s/def ::cuts (s/coll-of (s/coll-of ::block)))