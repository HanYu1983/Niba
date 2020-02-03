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
    (if (and (seq queue) (> (count queue) 0))
      (let [[current [totalScore current-score previous]] (peek queue)
            info {:prev previous
                  :cost current-score
                  :totalCost totalScore}
            [isFind isInterrupt] (goal info current)
            visited (assoc visited current (assoc info :tail isFind))]
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