(ns app.core
  (:require [clojure.spec.alpha :as s])
  (:require [app.gameplay.core]))


(s/check-asserts true)

(app.gameplay.core/main)