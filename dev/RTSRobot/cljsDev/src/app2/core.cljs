(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [clojure.walk]
            [clojure.zip])
  (:require [app2.gameplay.core]
            [tool.goal]))

(s/check-asserts true)
;(tool.goal/test-it)

(app2.gameplay.core/main)