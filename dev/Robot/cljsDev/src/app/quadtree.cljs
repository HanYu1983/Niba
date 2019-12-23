(ns app.quadtree)

(def root {})

(defn path [gf depth p]
  (reduce (fn [acc i]
            (conj acc (gf acc i p)))
          []
          (range depth)))

(defn quadPartitionPoint [[cx cy] path]
  (-> (reduce (fn [[cx cy cw ch] i]
                (condp = i
                  [0 0] [cx cy (/ cw 2) (/ ch 2)]
                  [1 0] [(+ cx (/ cw 2)) cy (/ cw 2) (/ ch 2)]
                  [0 1] [cx (+ cy (/ ch 2)) (/ cw 2) (/ ch 2)]
                  [1 1] [(+ cx (/ cw 2)) (+ cy (/ ch 2)) (/ cw 2) (/ ch 2)]
                  (throw (js/Error. "path must 0 ~ 4"))))
              [0 0 (* 2 cx) (* 2 cy)]
              path)
      ((fn [[x y w h]]
         [(+ x (/ w 2)) (+ y (/ h 2))]))))

(def quadPartitionPointMem (memoize quadPartitionPoint))

(println (quadPartitionPointMem [20 20] [[0 0]]))


(println (reduce (fn [acc p]
                   (let [pa (path (fn [acc i [x y]]
                                         (if (= 0 i)
                                           [0 0]
                                           (let [[cx cy] (quadPartitionPointMem [20 20] acc)]
                                             (if (< x cx)
                                               (if (< y cy)
                                                 [0 0]
                                                 [0 1])
                                               (if (< y cy)
                                                 [1 0]
                                                 [1 1])))))
                                       3
                                       p)]
                     (update-in acc pa (partial cons p))))
                 {}
                 [[0 0] [0 1] [15 17] [3 5] [2 12]]))