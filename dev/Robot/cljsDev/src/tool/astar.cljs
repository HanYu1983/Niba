(ns tool.astar
  (:require [tailrecursion.priority-map]))

(defn buildPath [pathTree end]
  (let [path (loop [path []
                    curr end]
               (if (nil? (get pathTree curr))
                 (cons curr path)
                 (recur (cons curr path) (:prev (get pathTree curr)))))]
    (drop-while nil? path)))

; 從以下網址修改的
; https://github.com/arttuka/astar
(defn route [graph dist h start goal]
  (loop [visited {}
         queue (tailrecursion.priority-map/priority-map-keyfn first start [0 0 nil])]
    (if (seq queue)
      (let [[current [totalScore current-score previous]] (peek queue)
            info {:prev previous
                  :cost current-score
                  :totalCost totalScore}
            [isFind isInterrupt] (goal info current)
            visited (assoc visited current (merge info {:tail isFind
                                                        :length (if previous
                                                                  (inc (get-in visited [previous :length]))
                                                                  0)
                                                        :priority (if isFind
                                                                    (count visited)
                                                                    99999999)}))]
        (if isFind
          (if isInterrupt
            visited
            (recur visited (pop queue)))
          (recur visited (reduce (fn [queue node]
                                   (let [score (+ current-score (dist current node))]
                                     (if (and (not (contains? visited node))
                                              (or (not (contains? queue node))
                                                  (< score (get-in queue [node 1]))))
                                       (assoc queue node [(+ score (h node)) score current])
                                       queue)))
                                 (pop queue)
                                 (graph current)))))
      visited)))