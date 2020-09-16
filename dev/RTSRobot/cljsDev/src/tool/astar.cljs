(ns tool.astar
  (:require ["a-star" :as astar]
            [tailrecursion.priority-map]
            [clojure.spec.alpha :as s]))

(defn build-path [pathTree end]
  (let [path (loop [path []
                    curr end]
               (if (nil? (get pathTree curr))
                 (cons curr path)
                 (recur (cons curr path) (:previous (get pathTree curr)))))]
    (drop-while nil? path)))

; 從以下網址修改的
; https://github.com/arttuka/astar
(defn shortest-path-tree [graph h goal start]
  (loop [visited {}
         queue (tailrecursion.priority-map/priority-map-keyfn first start [0 0 nil])]
    (if (seq queue)
      (let [[current [total-score current-score previous]] (peek queue)
            info {:previous previous
                  :current-score current-score
                  :total-score total-score}
            [isFind isInterrupt] (goal current info)
            visited (assoc visited current (merge info {:goal isFind}))]
        (if (and isFind isInterrupt)
          visited
          (recur visited (reduce (fn [queue [node cost]]
                                   (let [score (+ current-score cost)]
                                     (if (and (not (contains? visited node))
                                              (or (not (contains? queue node))
                                                  (< score (get-in queue [node 1]))))
                                       (assoc queue node [(+ score (h node)) score current])
                                       queue)))
                                 (pop queue)
                                 (graph current info)))))
      visited)))

(defn make-reducer [f ctx]
  (let [atomCtx (atom ctx)]
    (fn [& args]
      (reset! atomCtx (f args @atomCtx)))))

(defn test1 []
  (let [tree (shortest-path-tree (fn [[x _]] [[[(dec x) 0] 1] [[(inc x) 0] 1]])
                                 (fn [x] 1)
                                 (fn [n] (if (= n [5 0])
                                           [true true]
                                           [false false]))
                                 [0 0])
        _ (println tree)
        path (build-path tree [5 0])
        _ (println path)]))


(s/def ::status #{"success" "noPath" "timeout"})
(s/def ::path coll?)
(s/def ::cost number?)
(s/def ::result (s/keys :req-un [::status ::path ::cost]))

(defn- search [{:keys [start isEnd neighbor distance heuristic]}]
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

(defn- test2 []
  (let [results (search {:start [0 0]
                         :isEnd (fn [n] (= n [5 0]))
                         :neighbor (fn [[x _]] [[(dec x) 0] [(inc x) 0]])
                         :distance (fn [a b] 1)
                         :heuristic (fn [x] 1)})
        _ (println results)]))