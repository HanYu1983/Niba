(ns app2.ui-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [app2.ui :as ui]))


#_(deftest test-ui
    (let [view (s/assert ::ui/ui ui/ui)]))

