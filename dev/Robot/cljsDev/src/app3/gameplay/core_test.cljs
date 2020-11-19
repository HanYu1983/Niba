(ns app3.gameplay.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [app3.gameplay.core]))


(def atom-ctx (atom nil))

(deftest test-1 []
  (async done
         (let [_ (app3.gameplay.core/gameplay-loop {} (fn [err ctx]
                                                        (println err ctx)))])))