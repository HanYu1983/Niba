(ns app3.core
  (:require [clojure.spec.alpha :as s])
  (:require [app3.gameplay.core]))

(s/check-asserts true)
(app3.gameplay.core/main)