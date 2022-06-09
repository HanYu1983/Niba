(ns tool.sat
  (:require [clojure.spec.alpha :as s]
            ["sat" :as sat]))

(s/def ::vec2 (s/tuple number? number?))

(def response (sat/Response.))

(defn sat-vector [[x y :as arg]]
  (s/assert ::vec2 arg)
  (sat/Vector. x y))

(defn polygon [pos points]
  (s/assert ::vec2 pos)
  (s/assert (s/* ::vec2) points)
  (sat/Polygon. (sat-vector pos) (to-array (map sat-vector points))))

(defn circle [pos r]
  (sat/Circle. (sat-vector pos) r))

(defn testObjectObject [o1 o2]
  (cond
    (instance? sat/Polygon o1)
    (cond
      (instance? sat/Polygon o2)
      (let [collided (sat/testPolygonPolygon o1 o2 response)]
        [collided response])

      (instance? sat/Circle o2)
      (let [collided (sat/testPolygonCircle o1 o2 response)]
        [collided response])

      :else
      (throw (js/Error. "not support")))

    (instance? sat/Circle o1)
    (cond
      (instance? sat/Polygon o2)
      (let [collided (sat/testCirclePolygon o1 o2 response)]
        [collided response])

      (instance? sat/Circle o2)
      (let [collided (sat/testCircleCircle o1 o2 response)]
        [collided response])

      :else
      (throw (js/Error. "not support")))

    :else
    (throw (js/Error. "not support"))))
  

(defn test1 []
  (let [_ (println (testObjectObject (circle [0 0] 20)
                                     (circle [10 10] 20)))

        _ (println (testObjectObject (polygon [0 0] [[0 0] [0 20] [20 0]])
                                     (circle [10 10] 20)))]))

(test1)