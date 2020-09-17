(ns app2.gameplay.model
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m])
  (:require [tool.rbush]
            [tool.math]
            [tool.goal]))


(s/def ::position ::tool.math/vec2)
(s/def ::radius number?)
(s/def ::brain ::tool.goal/goal)
(s/def ::entity (s/keys :req-un [::id ::position ::radius]
                        :req-opt [::brain]))
(s/def ::entities (s/map-of string? ::entity))


(s/def ::viewport ::tool.math/vec2)
(s/def ::camera ::tool.math/vec3)
(s/def ::state (s/keys :req-un [::entities ::viewport ::camera]))

(s/def ::js (s/keys :req-un [::tool.rbush/rbush]))
(s/def ::gameplay (s/keys :req-un [::state ::js]))


(def gameplay (s/assert
               ::gameplay
               {:state {:entities {"abc" {:id (gensym "entity")
                                          :position [0 0]
                                          :radius 5}}
                        :viewport [600 400]
                        :camera [0 0 1]}
                :js {:rbush (tool.rbush/create {:compareMinX (fn [a b]
                                                               (- (- (get-in a [:position 0]) (:radius a))
                                                                  (- (get-in b [:position 0]) (:radius b))))
                                                :compareMinY (fn [a b]
                                                               (- (- (get-in a [:position 1]) (:radius a))
                                                                  (- (get-in b [:position 1]) (:radius b))))
                                                :toBBox (fn [item]
                                                          [(- (get-in item [:position 0]) (:radius item))
                                                           (- (get-in item [:position 1]) (:radius item))
                                                           (+ (get-in item [:position 0]) (:radius item))
                                                           (+ (get-in item [:position 1]) (:radius item))])})}}))

(defn camera-control [gameplay [cmd args]]
  (condp = cmd
    :keyIsDown
    (let [key args]
      (println args)
      (condp = key
        37
        (update-in gameplay [:state :camera] #(m/add % [-1 0 0]))

        38
        (update-in gameplay [:state :camera] #(m/add % [0 -1 0]))

        39
        (update-in gameplay [:state :camera] #(m/add % [1 0 0]))

        40
        (update-in gameplay [:state :camera] #(m/add % [0 1 0]))

        187
        (update-in gameplay [:state :camera] #(m/add %  [0 0 -0.1]))

        189
        (update-in gameplay [:state :camera] #(m/add %  [0 0 0.1]))

        gameplay))
    gameplay))

(defn entities-reduce [fns gameplay [cmd args]]
  (update-in gameplay [:state :entities] (fn [entities]
                                           (->> (vals entities)
                                                (map (fn [entity]
                                                       (reduce (fn [entity f]
                                                                 (f entity gameplay [cmd args]))
                                                               entity
                                                               fns)))
                                                (zipmap (keys entities))))))

(defn brain-control [entity gameplay [cmd args]]
  (if (:brain entity)
    entity
    entity))

(defn player-control [gameplay [cmd args]]
  (condp = cmd
    :keyIsDown
    (let [key args]
      (condp = key
        87
        (update-in gameplay [:state :entities] (fn [entities]
                                                 (->> (vals entities)
                                                      (map (fn [entity]
                                                             (update entity :position #(m/add % [1 1]))))
                                                      (zipmap (keys entities)))))

        83
        (update-in gameplay [:state :entities] (fn [entities]
                                                 (->> (vals entities)
                                                      (map (fn [entity]
                                                             (update entity :position #(m/add % [-1 -1]))))
                                                      (zipmap (keys entities)))))
        
        65
        (let [_ (println (tool.rbush/search (get-in gameplay [:js :rbush]) [0 0 10 10]))]
          gameplay)

        32
        (update-in gameplay [:state :entities] (fn [entities]
                                                 (let [bullet {:id (str (gensym "bullet"))
                                                               :position [7 7]
                                                               :radius 2}]
                                                   (assoc entities (:id bullet) bullet))))
        gameplay))
    gameplay))