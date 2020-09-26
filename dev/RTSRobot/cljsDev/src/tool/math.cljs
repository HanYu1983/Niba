(ns tool.math
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.core.matrix.operators :as mo]
            ["sat" :as sat]))

(s/def ::vec2 (s/tuple number? number?))
(s/def ::vec3 (s/tuple number? number? number?))

(defn sat-vector-map [v map-f]
  (s/assert ::vec2 v)
  (let [sat-v (sat/Vector. (get v 0) (get v 1))
        _ (map-f sat-v)]
    [(.-x sat-v) (.-y sat-v)]))

(defn circle-to-polygon [radius start end cnt]
  (s/assert number? radius)
  (s/assert number? start)
  (s/assert number? end)
  (s/assert int? cnt)
  (s/assert
   (s/* ::vec2)
   (let [first-v (sat-vector-map [0 radius] #(.rotate % start))
         radian (/ (- start end) cnt)
         vs (take (inc cnt) (iterate (fn [v]
                                       (sat-vector-map v #(.rotate % radian)))
                                     first-v))]
     vs)))

(defn world-camera-factor [camera]
  (s/assert ::vec3 camera)
  (/ 1 (get camera 2)))

(defn camera-world-factor [camera]
  (s/assert ::vec3 camera)
  (get camera 2))

(defn get-camera-point [viewport camera world-point]
  (s/assert ::vec2 viewport)
  (s/assert ::vec3 camera)
  (s/assert ::vec2 world-point)
  (s/assert
   ::vec2
   (let [p (m/sub world-point (m/subvector camera 0 2))
         dist-factor (world-camera-factor camera)
         p (m/mmul p dist-factor)
         p (m/add p (m/mmul viewport (/ 1 2)))]
     p)))

(defn get-world-point [viewport camera camera-point]
  (s/assert ::vec2 viewport)
  (s/assert ::vec3 camera)
  (s/assert ::vec2 camera-point)
  (s/assert
   ::vec2
   (let [p (m/sub camera-point (m/mmul viewport (/ 1 2)))
         dist-factor (camera-world-factor camera)
         p (m/mmul p dist-factor)
         p (m/add p (m/subvector camera 0 2))]
     p)))

(defn test1 []
  (let [_ (println (get-camera-point [600 400] [300 200 1] [100 100]))
        _ (println (get-world-point [600 400] [300 200 1] [100 100]))]))
