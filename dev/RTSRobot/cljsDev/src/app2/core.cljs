(ns app2.core
  (:require [tool.rbush]
            [tool.astar]
            [tool.p5collide]
            [clojure.spec.alpha :as s]))

(s/check-asserts true)
(tool.rbush/test1)
(tool.astar/test1)
(tool.p5collide/test1)