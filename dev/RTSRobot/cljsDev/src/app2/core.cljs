(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [clojure.walk]
            [clojure.zip])
  (:require [app2.gameplay.core]
            [tool.goal]
            [tool.sat]))

(s/check-asserts true)
(app2.gameplay.core/main)