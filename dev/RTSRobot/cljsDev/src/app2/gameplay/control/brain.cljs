(ns app2.gameplay.control.brain
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.zip :as z]
            [clojure.walk :as w])
  (:require [tool.goal]
            [tool.math]
            [tool.rbush]))

(defmulti exe-goal (fn [goal]
                     (first goal)))

(defmethod exe-goal :think [[_ goal-args] entity gameplay [cmd args]]
  (update-in entity [:brain :goal] (fn [goal]
                                     (tool.goal/push-goal goal [:loop
                                                                [:search :searched-entity]
                                                                [:push [:searched-entity 0]]
                                                                [:move-to-memory]
                                                                [:loop
                                                                 [:move-to [50 0]]
                                                                 [:move-to-entity "player"]
                                                                 [:move-to [50 50]]
                                                                 [:move-to [0 50]]
                                                                 [:move-to [0 0]]
                                                                 [:return]]
                                                                [:loop
                                                                 [:move-to [-50 0]]
                                                                 [:move-to [-50 -50]]
                                                                 [:move-to [0 -50]]
                                                                 [:move-to [0 0]]
                                                                 [:return]]]))))

(defn move-to [entity pos on-reach]
  (s/assert ::tool.math/vec2 pos)
  (s/assert (s/keys :req-un [::position ::last-position]) entity)
  (s/assert fn? on-reach)
  (let [last-velocity (s/assert
                       ::tool.math/vec2
                       (m/sub (:position entity) (:last-position entity)))
        to-pos-vec (s/assert
                    ::tool.math/vec2
                    (m/sub pos (:last-position entity)))
        reach? (s/assert
                boolean?
                (if (zero? (m/magnitude to-pos-vec))
                  true
                  ; 內積單位向量 = 投影到單位向量的長度
                  ; 如果長度大於等於上一個位置到目標的距離 = 超過或到達目標點
                  (-> (m/dot last-velocity (m/normalise to-pos-vec))
                      (>= (m/magnitude to-pos-vec)))))]
    (if reach?
      (-> entity
          (assoc :velocity [0 0])
          on-reach)
      (let [velocity (s/assert
                      ::tool.math/vec2
                      (let [offset (m/sub pos (:position entity))
                            velocity (if (zero? (m/magnitude offset))
                                       [0 0]
                                       (-> offset
                                           m/normalise
                                           (m/mmul 1)))]
                        velocity))
            entity (assoc entity :velocity velocity)]
        entity))))

(defmethod exe-goal :move-to [[_ pos :as curr-goal] entity gameplay [cmd args]]
  (move-to entity pos (fn [entity]
                        (update-in entity [:brain :goal] (fn [goal]
                                                           (let [parent-goal (-> goal
                                                                                 tool.goal/zip
                                                                                 (tool.goal/find-node curr-goal)
                                                                                 z/up
                                                                                 z/node)
                                                                 next-parent-goal (tool.goal/next-goal parent-goal)]
                                                             (w/prewalk-replace {parent-goal next-parent-goal} goal)))))))

(defmethod exe-goal :move-to-entity [[_ player-id :as curr-goal] entity gameplay [cmd args]]
  (let [next-goal-fn (fn [goal]
                       (let [parent-goal (-> goal
                                             tool.goal/zip
                                             (tool.goal/find-node curr-goal)
                                             z/up
                                             z/node)
                             next-parent-goal (tool.goal/next-goal parent-goal)]
                         (w/prewalk-replace {parent-goal next-parent-goal} goal)))
        player (s/assert
                (s/nilable ::entity)
                (get-in gameplay [:state :entities player-id]))
        entity (if (nil? player)
                 (update-in entity [:brain :goal] next-goal-fn)
                 (move-to entity
                          (get-in gameplay [:state :entities player-id :position])
                          (fn [entity]
                            (update-in entity [:brain :goal] next-goal-fn))))]
    entity))


(defmethod exe-goal :return [curr-goal entity gameplay [cmd args]]
  (update-in entity [:brain :goal] (fn [goal]
                                     (let [parent-goal (-> goal
                                                           tool.goal/zip
                                                           (tool.goal/find-node curr-goal)
                                                           z/up
                                                           z/up
                                                           z/node)
                                           next-parent-goal (tool.goal/next-goal parent-goal)]
                                       (w/prewalk-replace {parent-goal next-parent-goal} goal)))))

(defmethod exe-goal :search [[_ f] entity gameplay [cmd args]]
  (let [search-box (->> [[-25 -25] [25 25]]
                        (map #(m/sub % (:position entity)))
                        flatten
                        (into []))
        enemies (tool.rbush/search (-> gameplay :js :rbush) search-box)]
    entity))

(defmethod exe-goal :attack [[_ goal-args] entity gameplay [cmd args]]
  entity)

(defn brain-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:brain :robot-state :last-position])
         (= :tick cmd))
    (let [goal (-> entity :brain :goal)
          curr-goal (tool.goal/get-goal goal)
          entity (exe-goal curr-goal entity gameplay [cmd args])]
      entity)

    :else
    entity))