(ns app2.core
  (:require [clojure.spec.alpha :as s])
  (:require [app2.gameplay.core]))

(s/check-asserts true)
(app2.gameplay.core/main)