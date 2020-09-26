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

(def check-collide? {:player-bullet #{:enemy}
                     :enemy #{:player-bullet}})

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
                    check? (get-in check-collide? [(:collision-group collision1) (:collision-group collision2)])
                    ;_ (println check? (:collision-group collision1) (:collision-group collision2))
                    _ (when check?
                        (let [shape2 (shape-to-sat (:shape collision2) (:position entity2))
                              [collide?] (tool.sat/testObjectObject shape1 shape2)
                              ;_ (println "collide?" collide?)
                              _ (when collide?
                                  (a/go (.next (-> gameplay :js :outputSubject) [:collide [(:id entity) (:id entity2)]])))]))]))]
      entity)

    :else
    entity))


(defn collide-react [gameplay entity from-entity]
  (s/assert (s/keys :req-un [::collision-state]) entity)
  (s/assert (s/keys :req-un [::collision-state]) from-entity)
  (s/assert
   ::app2.gameplay.spec/gameplay
   (let [[group1 group2] (map #(-> % :collision-state :collision-group) [entity from-entity])
         gameplay (cond
                    (= :player-bullet group1)
                    (update-in gameplay [:state :entities] #(dissoc % (:id entity)))

                    (:hp entity)
                    (let [hp (:hp entity)
                          hp (dec hp)
                          gameplay (if (<= hp 0)
                                     (update-in gameplay [:state :entities] #(dissoc % (:id entity)))
                                     (update-in gameplay [:state :entities (:id entity)] (constantly (assoc entity :hp hp))))]
                      gameplay)

                    :else
                    gameplay)]
     gameplay)))

(defn collide-reaction-control [gameplay [cmd args]]
  (cond
    (= :collide cmd)
    (let [[id1 id2] args
          [entity1 entity2] (s/assert
                             (s/coll-of (s/nilable ::app2.gameplay.spec/entity))
                             (map #(get-in gameplay [:state :entities %]) [id1 id2]))
          gameplay (if (and entity1 entity2)
                     (let [gameplay (collide-react gameplay entity1 entity2)
                           gameplay (collide-react gameplay entity2 entity1)]
                       gameplay)
                     gameplay)]
      gameplay)

    :else
    gameplay))