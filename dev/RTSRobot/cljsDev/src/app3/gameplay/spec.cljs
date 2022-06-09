(ns app3.gameplay.spec
  (:require [clojure.spec.alpha :as s])
  (:require [tool.planck]))

(s/def ::entity (s/keys :req-un [::id]
                        :opt-un [::tool.planck/body-def]))