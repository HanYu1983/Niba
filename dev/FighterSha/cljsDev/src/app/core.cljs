(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.gameplay.core]))

(s/check-asserts true)