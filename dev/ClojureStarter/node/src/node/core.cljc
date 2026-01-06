(ns node.core
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.spec.gen.alpha :as gen]
            [node.spec.app]
            [node.spec.map]))

(s/fdef doA
  :args (s/cat :n1 number? :n2 number?)
  :ret number?)

(defn doA [n1 n2]
  (+ n1 n2))

(defn -main [_args]
  (s/check-asserts true)
  (stest/instrument)
  #_(println (stest/check 'node.spec.map/generate-map))

  (doseq [fn [`node.spec.map/generate-map]]
    (println "==============" fn "==============")
    #_(println (s/exercise-fn fn 2))
    (->> (stest/check fn)
         (filter #(not (nil? (:failure %))))
         (map (comp #(.-data %) :failure))
         (println))

    #_(println "==============")
    #_(println (-> (stest/check fn) first :failure .-data))
  )
  

  #_(println (stest/summarize-results (stest/check `node.spec.map/generate-map)))

  #_(println (node.spec.map/generate-map {:cells {}} 10 10))
  #_(println (node.spec.map/set-map-item {:cells {}} 0 0 1))

  #_(println (s/exercise-fn 'node.spec.map/set-map-item 1))

  #_(println (stest/check `create-card-table))
  #_(println (gen/sample (s/gen ::robot) 10))
  #_(println (s/exercise-fn `doA))
  (System/exit 0))