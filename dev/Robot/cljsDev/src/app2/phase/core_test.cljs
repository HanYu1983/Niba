(ns app2.phase.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.gameplay-spec]
            [app2.phase.player-turn :refer [player-turn]]))

(deftest test-player-turn []
  (testing "test playert run"
    (async done
           (let [atom-gameplay (atom nil)
                 inputCh (a/chan)
                 _ (player-turn {:cursor [0 0]
                                 :mapsize [10 10]}
                                inputCh)
                 _ (a/go
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh (fn [gameplay]
                                     (reset! atom-gameplay gameplay)
                                     gameplay))
                     (a/<! (a/timeout 0))
                     (is (= [0 1] (:cursor @atom-gameplay)))
                     (a/close! inputCh)
                     (done))]))))