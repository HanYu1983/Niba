(ns app2.core
  (:require [tool.rbush]
            [tool.astar]
            [tool.sat]
            [clojure.spec.alpha :as s]))

(s/check-asserts true)
(tool.rbush/test1)
(tool.astar/test1)
(tool.sat/test1)