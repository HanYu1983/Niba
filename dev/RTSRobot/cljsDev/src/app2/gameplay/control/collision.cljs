(ns app2.gameplay.control.collision
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.core.async :as a]
            [clojure.core.match :refer [match]])
  (:require [tool.sat]
            [tool.math]
            [tool.rbush]
            [app2.gameplay.spec]))


(defn shape-to-sat [shape pos]
  (s/assert ::app2.gameplay.spec/shape shape)
  (s/assert ::tool.math/vec2 pos)
  (let [obj (match (s/conform ::app2.gameplay.spec/shape shape)
              [_ [:circle radius]]
              (tool.sat/circle pos radius)

              [_ [:arc radius start end]]
              (tool.sat/polygon pos (cons [0 0] (tool.math/circle-to-polygon radius start end 3)))

              [_ [:polygon verties]]
              (tool.sat/polygon pos verties)

              :else
              (throw (js/Error. "not support")))]
    obj))

(defn collision-control [entity gameplay [cmd args :as evt]]
  (cond
    (and (= :tick cmd)
         (:collision-state entity)
         (:position entity))
    (let [search-box (->> [[-100 -100] [100 100]]
                          (map #(m/add % (:position entity)))
                          flatten
                          (into []))
          others-id (->> (tool.rbush/search (-> gameplay :js :rbush) search-box)
                         (filter (fn [entity2]
                                   (and (not= (:id entity) (:id entity2))
                                        (:collision-state entity2)
                                        (:position entity2))))
                         (map :id))
          collision1 (:collision-state entity)
          shape1 (shape-to-sat (:shape collision1) (:position entity))
          _ (doseq [id others-id]
              (let [entity2 (get-in gameplay [:state :entities id])
                    collision2 (:collision-state entity2)
                    shape2 (shape-to-sat (:shape collision2) (:position entity2))
                    [collide?] (tool.sat/testObjectObject shape1 shape2)
                    _ (when collide?
                        (a/go (.next (-> gameplay :js :outputSubject) [:collide [(:id entity) (:id entity2)]])))]))]
      entity)

    :else
    entity))