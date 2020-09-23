(ns tool.sat
  (:require ["sat" :as sat]))

(def response (sat/Response.))

(defn testCircleCircle [x y r x2 y2 r2]
  (let [c1 (sat/Circle. (sat/Vector. x y) r)
        c2 (sat/Circle. (sat/Vector. x2 y2) r2)
        collided (sat/testCircleCircle c1 c2 response)
        _ (js/console.log collided response)]
    [collided response]))

(defn test1 []
  (let [_ (testCircleCircle 0 0 20 30 0 20)]))