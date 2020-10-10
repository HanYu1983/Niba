(ns app4.core
  (:require [clojure.spec.alpha :as s])
  (:require [tool.stock.drawer]
            [tool.stock.tool]
            [tool.stock.formula]))

(s/check-asserts true)
(tool.stock.tool/test-it)
(println (seq? nil))
(println (cons 0 nil))

(println (take 5 nil))
