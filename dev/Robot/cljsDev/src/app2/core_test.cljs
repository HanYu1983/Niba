(ns app2.core-test
  (:require [cljs.test :refer-macros [deftest is testing use-fixtures async]]
            [clojure.core.async :as a]
            [clojure.spec.alpha :as s])
  (:require-macros [app2.macros :refer [defasync defasync2]]))

(use-fixtures :each
  {:before
   #(async done
           (println "before")
           (done))
   :after
   #(async done
           (println "after")
           (done))})


(defasync player-turn [gameplayCtx any?, inputCh any?] [gameplayCtx err] any?
  (loop [gameplayCtx gameplayCtx]
    (let [f (a/<! inputCh)]
      (cond
        (nil? f)
        [gameplayCtx nil]

        (fn? f)
        (do (f gameplayCtx)
            (recur gameplayCtx))

        :else
        (recur gameplayCtx)))))


(deftest test-player-turn []
  (testing "test playert run"
    (async done
           (let [atom-gameplayCtx (atom nil)
                 inputCh (a/chan)
                 _ (a/go
                     (a/<! (player-turn nil inputCh)))
                 _ (a/go
                     (a/>! inputCh (fn [gameplayCtx]
                                     (reset! atom-gameplayCtx gameplayCtx)))
                     (is (nil? @atom-gameplayCtx))
                     (a/close! inputCh))]
             (done)))))


(deftest test-async-awesome
  (testing "the API is awesome"
    (let []
      (async done
             (a/go
               (done))))))

(defmethod cljs.test/report [:cljs.test/default :end-run-tests] [m]
  (if (cljs.test/successful? m)
    (println "Success!")
    (println "FAIL")))