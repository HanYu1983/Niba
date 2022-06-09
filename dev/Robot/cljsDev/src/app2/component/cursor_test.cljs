(ns app2.component.cursor-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.core.async :as a]
            [app2.component.cursor :refer [handle-cursor-component]]))

(deftest test-cursor-component-move-cursor []
  (testing "test-cursor-component-move-cursor"
    (async done
           (a/go (let [gameplay {:cursor [10 10]
                                 :mapsize [20 20]
                                 :camera [0 0]}
                       [gameplay err] (a/<! (handle-cursor-component gameplay [:on-click "w"]))
                       _ (is (nil? err))
                       _ (is (= [10 9] (:cursor gameplay)))

                       [gameplay err] (a/<! (handle-cursor-component gameplay [:on-click "s"]))
                       _ (is (nil? err))
                       _ (is (= [10 10] (:cursor gameplay)))

                       [gameplay err] (a/<! (handle-cursor-component gameplay [:on-click "a"]))
                       _ (is (nil? err))
                       _ (is (= [9 10] (:cursor gameplay)))

                       [gameplay err] (a/<! (handle-cursor-component gameplay [:on-click "d"]))
                       _ (is (nil? err))
                       _ (is (= [10 10] (:cursor gameplay)))]
                   (done))))))