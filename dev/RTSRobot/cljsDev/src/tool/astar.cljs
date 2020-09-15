(ns tool.astar
  (:require ["a-star" :as astar]
            [clojure.spec.alpha :as s]))

(s/def ::status #{"success" "noPath" "timeout"})
(s/def ::path coll?)
(s/def ::cost number?)
(s/def ::result (s/keys :req-un [::status ::path ::cost]))

(defn search [{:keys [start isEnd neighbor distance heuristic]}]
  (s/assert any? start)
  (s/assert fn? isEnd)
  (s/assert fn? neighbor)
  (s/assert fn? distance)
  (s/assert fn? heuristic)
  (s/assert
   ::result
   (let [results (astar (clj->js {:start start
                                  :isEnd isEnd
                                  :neighbor (fn [x] (to-array (neighbor x)))
                                  :distance distance
                                  :heuristic heuristic}))]
     (js->clj results :keywordize-keys true))))

(defn test1 []
  (let [results (search {:start [0 0]
                         :isEnd (fn [n] (= n [5 0]))
                         :neighbor (fn [[x _]] [[(dec x) 0] [(inc x) 0]])
                         :distance (fn [a b] 1)
                         :heuristic (fn [x] 1)})
        _ (println results)]))