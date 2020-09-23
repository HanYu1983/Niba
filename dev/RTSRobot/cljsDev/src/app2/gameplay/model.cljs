(ns app2.gameplay.model
  (:require [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.zip :as z]
            [clojure.walk :as w]
            ["rxjs" :as rx])
  (:require [tool.rbush]
            [tool.math]
            [tool.goal]))

(s/def ::position ::tool.math/vec2)
(s/def ::velocity ::tool.math/vec2)
(s/def ::radius number?)
(s/def ::timer number?)
(s/def ::expire-time number?)
(s/def ::collision-state (s/keys :req-un []))
(s/def ::brain (s/keys :req-opt [:goal ::tool.goal/goal]))
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt [::position
                                  ::velocity
                                  ::radius
                                  ::brain
                                  ::robot-state
                                  ::collision-state
                                  ::timer
                                  ::expire-time]))
(s/def ::entities (s/map-of string? ::entity))


(s/def ::viewport ::tool.math/vec2)
(s/def ::camera ::tool.math/vec3)
(s/def ::state (s/keys :req-un [::entities ::viewport ::camera]))

(s/def ::js (s/keys :req-un [::tool.rbush/rbush]))
(s/def ::gameplay (s/keys :req-un [::state ::js]))


(def gameplay (s/assert
               ::gameplay
               {:state {:entities {"player" {:id "player"
                                             :position [0 0]
                                             :radius 10
                                             :player-state {}
                                             :robot-state {:heading [1 0]}}
                                   "ai" {:id "ai"
                                         :position [0 0]
                                         :radius 5
                                         :robot-state {:heading [1 0]}
                                         :brain {:goal [:stack
                                                        [:think]]}}}
                        :viewport [800 640]
                        :camera [0 0 1]}
                :js {:outputSubject (rx/Subject.)
                     :rbush (tool.rbush/create {:compareMinX (fn [a b]
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
      (condp = key
        "left"
        (update-in gameplay [:state :camera] #(m/add % [-1 0 0]))

        "up"
        (update-in gameplay [:state :camera] #(m/add % [0 -1 0]))

        "right"
        (update-in gameplay [:state :camera] #(m/add % [1 0 0]))

        "down"
        (update-in gameplay [:state :camera] #(m/add % [0 1 0]))

        "="
        (update-in gameplay [:state :camera] #(m/add %  [0 0 -0.1]))

        "-"
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

(defmulti exe-goal (fn [goal]
                         (first goal)))

(defmethod exe-goal :think [[_ goal-args] entity gameplay [cmd args]]
  (update-in entity [:brain :goal] (fn [goal]
                                     (tool.goal/push-goal goal [:loop
                                                                [:loop
                                                                 [:move-to [5 0]]
                                                                 [:move-to [5 5]]
                                                                 [:move-to [0 5]]
                                                                 [:move-to [0 0]]
                                                                 [:return]]
                                                                [:attack-and-return (gensym)]]))))

(defmethod exe-goal :move-to [[_ pos :as curr-goal] entity gameplay [cmd args]]
  (let [reach? (-> (m/distance (:position entity) pos)
                   (< 1))]
    (if reach?
      (update-in entity [:brain :goal] (fn [goal]
                                         (let [parent-goal (-> goal
                                                               tool.goal/zip
                                                               (tool.goal/find-node curr-goal)
                                                               z/up
                                                               z/node)
                                               next-parent-goal (tool.goal/next-goal parent-goal)]
                                           (w/prewalk-replace {parent-goal next-parent-goal} goal))))
      (let [offset (s/assert
                    ::tool.math/vec2
                    (-> (m/sub pos (:position entity))
                        (m/div 1)))
            entity (update entity :position (fn [pos]
                                              (m/add offset pos)))]
        entity))))


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

(defmethod exe-goal :search [[_ goal-args] entity gameplay [cmd args]]
  entity)

(defmethod exe-goal :attack [[_ goal-args] entity gameplay [cmd args]]
  entity)

(defn brain-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:brain :robot-state])
         (= :tick cmd))
    (let [goal (-> entity :brain :goal)
          curr-goal (tool.goal/get-goal goal)
          _ (println curr-goal)
          entity (exe-goal curr-goal entity gameplay [cmd args])]
      entity)

    :else
    entity))

(defn velocity-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:position :velocity])
         (= :tick cmd))
    (update entity :position #(m/add (:velocity entity) %))
    
    :else
    entity))

(defn timer-control [entity gameplay [cmd args]]
  (cond
    (and (:timer entity)
         (= :tick cmd))
    (let [elapsed args]
      (update-in entity [:timer] #(+ % elapsed)))

    :else
    entity))

(defn expire-evt-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:timer :expire-time])
         (= :tick cmd))
    (let [{:keys [timer expire-time]} entity
          _ (when (> timer expire-time)
              (a/go
                (.next (-> gameplay :js :outputSubject) [:entity-expire entity])))]
      entity)

    :else
    entity))

(defn expire-control [gameplay [cmd args]]
  (cond
    (= :entity-expire cmd)
    (let [entity args]
      (update-in gameplay [:state :entities] (fn [entities]
                                               (dissoc entities (:id entity)))))

    :else
    gameplay))

(defn player-control [entity gameplay [cmd args :as evt]]
  (if (every? #(% entity) [:position :player-state :robot-state])
    (let []
      (cond
        (= [:keyIsDown "w"] evt)
        (update-in entity [:position] #(m/add % (-> entity :robot-state :heading (m/mmul 1))))

        (= [:keyIsDown "s"] evt)
        (update-in entity [:position] #(m/add % (-> entity :robot-state :heading (m/mmul -1))))

        (= [:keyIsDown "a"] evt)
        (update-in entity [:robot-state :heading] #(tool.math/sat-vector-map % (fn [sat-v]
                                                                                 (.rotate sat-v -0.1))))

        (= [:keyIsDown "d"] evt)
        (update-in entity [:robot-state :heading] #(tool.math/sat-vector-map % (fn [sat-v]
                                                                                 (.rotate sat-v 0.1))))

        (= [:keyPressed "space"] evt)
        (let [_ (a/go (.next (-> gameplay :js :outputSubject) [:onPlayerFire entity]))]
          entity)

        :else
        entity))
    entity))

(defn system-control [gameplay [cmd args]]
  #_(when (not= :tick cmd)
    (println cmd args))
  (cond
    (= :onPlayerFire cmd)
    (let [entity (s/assert
                  (s/keys :req-un [::position ::robot-state])
                  args)]
      (update-in gameplay [:state :entities] (fn [entities]
                                               (let [bullet {:id (str (gensym "bullet"))
                                                             :position (:position entity)
                                                             :velocity (m/mmul (-> entity :robot-state :heading) 20)
                                                             :radius 20
                                                             :timer 0
                                                             :expire-time 2}]
                                                 (assoc entities (:id bullet) bullet)))))

    :else
    gameplay))