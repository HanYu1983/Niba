(ns other.testquadtree
  (:require [app.quadtree :as aq]))

(let [getRectByUnit (fn [{[x y] :pos}]
                      [x y (+ 0.5 x) (+ 0.5 y)])
      units (->> (repeatedly (fn [] {:key (gensym) :pos [(rand-int 20) (rand-int 20)]}))
                  (take 10000))
      ;units [{:key 0 :pos [10 10]}]
      tree (->> units
                (reduce (fn [ctx unit]
                          (aq/add ctx getRectByUnit unit))
                        (aq/make-qdtree [0 0 20 20] 3))
                (aq/balance))
      tree2 (->> units
                 (reduce (fn [ctx unit]
                           (aq/delete ctx getRectByUnit unit))
                         tree)
                 (aq/balance))]

  (println (last tree))
  (println (count (aq/search tree getRectByUnit [5 5 7 7])))

  (println (last tree2))
  (println (count (aq/search tree2 getRectByUnit [5 5 7 7])))
  
  
  )
