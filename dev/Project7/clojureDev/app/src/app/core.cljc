(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.core.async :as a]))

(defn ranged-rand
  "Returns random int in range start <= rand < end"
  [start end]
  (+ start (long (rand (- end start)))))

(s/fdef ranged-rand
  :args (s/and (s/cat :start int? :end int?)
               #(< (:start %) (:end %)))
  :ret int?
  :fn (s/and #(>= (:ret %) (-> % :args :start))
             #(< (:ret %) (-> % :args :end))))

(defn test-spec []
  (ranged-rand 0 20)
  (println (s/exercise (-> `ranged-rand s/get-spec :args)))
  (println (s/exercise-fn `ranged-rand))
  #_(do (stest/instrument `ranged-rand)
        (ranged-rand 8 5))
  #_(do
      (println (stest/check `ranged-rand))
      (println (stest/check `ranged-rand))
      (println "end")))

(defn async-do []
  (a/go
    "OK"))

(defn test-async []
  (let [ch (a/merge [(a/go
                       (println "test-async-start")
                       (println (a/<! (async-do)))
                       (println "test-async-end")
                       "a")
                     (a/go
                       (Thread/sleep 3000)
                       (println "after 3s")
                       "b")])
        _ (println (a/<!! ch))
        _ (println "=====")
        _ (println (a/<!! ch))
        _ (println "=====")
        _ (println (a/<!! ch))]))

(defn -main [args]
  (test-async)
  (println "end"))