(ns other.testquadtree
  (:require [other.quadtree :as aq]))

(def n 0)

(let [getRectByUnitLog (fn [{[x y] :pos}]
                      (set! n (inc n))
                      [x y (+ 0.5 x) (+ 0.5 y)])
      getRectByUnit (fn [{[x y] :pos}]
                      [x y (+ 0.5 x) (+ 0.5 y)])
      units (->> (repeatedly (fn [] {:key (gensym) :pos [(rand 20) (rand 20)]}))
                 (take 1000))
      tree (->> units
                (reduce (fn [ctx unit]
                          (aq/add ctx getRectByUnit unit))
                        (aq/make-qdtree [0 0 20 20] 3))
                (aq/balance))
      searchSize [7 7 13 13]
      searchObj (aq/search tree getRectByUnitLog searchSize)
      tree2 (->> units
                 (reduce (fn [ctx unit]
                           (aq/delete ctx getRectByUnit unit))
                         tree)
                 (aq/balance))]
  (println n "times")
  (println (last tree2))
  (println (count (aq/values tree)))

  (let [sketch (fn [p]
                 (set! (.-setup p)
                       (fn []
                         (.createCanvas p 600 600)))

                 (set! (.-draw p)
                       (let [cellSize 20
                             drawTree (fn rec [[[x1 y1 x2 y2] objs r1 r2 r3 r4 info :as tree]]
                                        (when tree
                                          (.stroke p 0)
                                          (.strokeWeight p 1)
                                          (.fill p 255 255 255 0)
                                          (.rect p
                                                 (* x1 cellSize)
                                                 (* y1 cellSize)
                                                 (* (- x2 x1) cellSize)
                                                 (* (- y2 y1) cellSize))

                                          (.stroke p 255 0 0)
                                          (.strokeWeight p 3)
                                          (doall (for [{[x y] :pos} objs]
                                                   (.point p
                                                           (* cellSize x)
                                                           (* cellSize y))))

                                          (.fill p 0 255 0 0.7)
                                          (let [[x1 y1 x2 y2] searchSize]
                                            (.rect p
                                                   (* cellSize x1)
                                                   (* cellSize y1)
                                                   (* cellSize (- x2 x1))
                                                   (* cellSize (- y2 y1))))

                                          (.stroke p 255 0 0)
                                          (.strokeWeight p 10)
                                          (doall (for [{[x y] :pos} searchObj]
                                                   (.point p
                                                           (* cellSize x)
                                                           (* cellSize y))))

                                          (rec r1)
                                          (rec r2)
                                          (rec r3)
                                          (rec r4)

                                          (.strokeWeight p 0)
                                          (.fill p 0)
                                          (.text p (str (:totalCount info)) (* (/ (+ x1 x2) 2) cellSize) (* (/ (+ y1 y2) 2) cellSize))))]
                         (fn []
                           (drawTree tree)))))]
    
    (js/p5. sketch "container")))