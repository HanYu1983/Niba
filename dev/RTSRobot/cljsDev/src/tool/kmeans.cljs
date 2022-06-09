(ns tool.kmeans
  (:require [clojure.spec.alpha :as s])
  (:require ["ml-kmeans" :as ml-kmeans]))

(s/def ::error (s/nilable number?))
(s/def ::size int?)
(s/def ::centroids (s/* (s/keys :req-un [::centroid ::error ::size])))
(s/def ::option (s/keys :opt-un [::initialization ::maxIterations ::tolerance ::withIterations ::distanceFunction ::seed]))
(s/def ::answer (s/keys :req-un [::clusters ::centroids ::converged ::iterations]))

; https://mljs.github.io/kmeans/
(defn kmeans [data num option]
  {:pre [(s/valid? ::option option)]
   :post [(s/valid? ::answer %)]}
  (let [jsobj (ml-kmeans (clj->js data) num (clj->js option))
        ret {:clusters (js->clj (.-clusters jsobj) :keywordize-keys true)
             :centroids (js->clj (.-centroids jsobj) :keywordize-keys true)
             :converged (js->clj (.-converged jsobj) :keywordize-keys true)
             :iterations (js->clj (.-iterations jsobj) :keywordize-keys true)}]
    ret))


(defn test-it []
  (let [data  [[1, 1, 1], [1, 2, 1], [-1, -1, -1], [-1, -1, -1.5]]
        centers [[1, 2, 1], [-1, -1, -1]]
        ans (kmeans data 2 {:initialization centers})
        _ (print ans)]))
