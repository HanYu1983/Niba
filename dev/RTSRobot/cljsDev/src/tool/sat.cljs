(ns tool.sat
  (:require ["sat" :as sat]))

(defn testCircleCircle [x y r x2 y2 r2]
  (let [c1 (sat/Circle. (sat/Vector. x y) r)
        c2 (sat/Circle. (sat/Vector. x2 y2) r2)
        res (sat/Response.)
        collided (sat/testCircleCircle c1 c2 res)
        _ (js/console.log collided res)]
    collided))

(defn test1 []
  (let [_ (testCircleCircle 0 0 20 30 0 20)]))