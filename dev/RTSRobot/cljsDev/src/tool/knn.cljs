(ns tool.knn
  (:require [clojure.spec.alpha :as s])
  (:require ["ml-knn" :as ml-knn]))

(s/def ::k int?)
(s/def ::distance fn?)
(s/def ::options (s/keys :opt-un [::k ::distance]))

(defn train [dataset predictions options]
  {:pre [(s/valid? ::options options)]}
  (ml-knn. (clj->js dataset) (clj->js predictions) (clj->js options)))

(defn predict [knn dataset]
  (js->clj (.predict knn (clj->js dataset))))


(defn test-it []
  (let [dataset [[0, 0, 0]
                 [0, 1, 1]
                 [1, 1, 0]
                 [2, 2, 2]
                 [1, 2, 2]
                 [2, 1, 2]]
        predictions [:doA, :doA, :doA, :doB, :doB, :doB]
        knn (train dataset predictions {})
        dataset [[0, 0, 0], [2, 2, 2]]
        ans (predict knn dataset)
        _ (print ans)]))

(defn test-it2 []
  (let [knn (let [trainSet `([[1 1] :attack]
                             [[0.5 0.5] :attack]
                             [[0 0] :findSupply]
                             [[1 0] :findSupply]
                             [[0 1] :findSupply])]
              (tool.knn/train (mapv first trainSet)
                              (mapv second trainSet)
                              {:k 1}))
        ans (predict knn [[0 0]
                          [1 1]
                          [0.5 0.5]
                          [0.5 0.2]
                          [0.5 0]
                          [1 0]
                          [0 1]])
        _ (println ans)]))