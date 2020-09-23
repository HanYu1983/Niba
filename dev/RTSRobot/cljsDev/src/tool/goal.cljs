(ns tool.goal
  (:require [clojure.spec.alpha :as s]
            [clojure.zip]
            [clojure.walk]))


(defmulti goalType first)
(defmethod goalType :default []
  (s/cat :type keyword?
         :args (s/* (constantly true))))
(defmethod goalType :seq [_]
  (s/cat :type keyword?
         :goals (s/* ::goal)))
(defmethod goalType :loop [_]
  (s/cat :type keyword?
         :goals (s/* ::goal)))
(defmethod goalType :stack [_]
  (s/cat :type keyword?
         :goals (s/* ::goal)))
(s/def ::goal (s/multi-spec goalType ::goal))


(defmulti get-goal first)
(defmethod get-goal :default [goal]
  (s/assert
   ::goal
   (if (nil? goal)
     [:none]
     goal)))

(defmethod get-goal :seq [[_ & [goal & _]]]
  (s/assert
   ::goal 
   (get-goal goal)))

(defmethod get-goal :loop [[_ & [goal & _]]]
  (s/assert
   ::goal
   (get-goal goal)))

(defmethod get-goal :stack [[_ & [goal & _]]]
  (s/assert
   ::goal
   (get-goal goal)))


(defmulti next-goal first)
(defmethod next-goal :default [goal]
  goal)

(defmethod next-goal :seq [[type & [goal & goals]]]
  (s/assert
   ::goal
   (let [[t & args] goal]
     (cond
       (#{:seq :loop :stack} t)
       (if (nil? args)
         (cons type goals)
         (let [[_ & args :as nextGoal] (next-goal goal)]
           (if (nil? args)
             (cons type goals)
             (cons type (cons nextGoal goals)))))

       :else
       (cons type goals)))))

(defmethod next-goal :loop [[type & [goal & goals]]]
  (s/assert
   ::goal
   (let [[t & args] goal]
     (cond
       (#{:seq :loop :stack} t)
       (if (nil? args)
         (cons type (reverse (cons goal (reverse goals))))
         (cons type (reverse (cons (next-goal goal) (reverse goals)))))

       :else
       (cons type (reverse (cons goal (reverse goals))))))))

(defmethod next-goal :stack [[type & [goal & goals]]]
  (s/assert
   ::goal
   (let [[t & args] goal]
     (cond
       (#{:seq :loop :stack} t)
       (if (nil? args)
         (cons type goals)
         (let [[_ & args :as nextGoal] (next-goal goal)]
           (if (nil? args)
             (cons type goals)
             (cons type (cons nextGoal goals)))))

       :else
       (cons type goals)))))

(defn push-goal-into [curr-goal goal]
  (s/assert ::goal curr-goal)
  (s/assert ::goal goal)
  (s/assert
   ::goal
   (let [[goal-type & args] curr-goal
         curr-goal (condp = goal-type
                     :stack
                     (cons goal-type (cons goal args))
                     :seq
                     (cons goal-type (reverse (cons goal (reverse args))))
                     (throw (js/Error. "not support")))]
     curr-goal)))


(defn zip [goal]
  (s/assert ::goal goal)
  (clojure.zip/zipper
   (fn [x]
     (and vector?
          (-> x first #{:stack :loop :seq})))
   rest
   (fn [p xs]
     [p xs])
   goal))

(defn find-node [gz v]
  (if (clojure.zip/end? gz)
    nil
    (if (= (clojure.zip/node gz) v)
      gz
      (recur (clojure.zip/next gz) v))))


(defn parent-node [zip-goal curr-goal]
  (s/assert clojure.zip/branch? zip-goal)
  (s/assert ::goal curr-goal)
  (let [node (find-node zip-goal curr-goal)
        _ (when (nil? node)
            (throw (js/Error. "xxx")))
        node (clojure.zip/up node)
        _ (when (nil? node)
            (throw (js/Error. "xxx")))]
    node))

(defn remove-parent [goal curr-goal]
  (s/assert ::goal goal)
  (s/assert ::goal curr-goal)
  (let [zip-goal (zip goal)
        node (parent-node zip-goal curr-goal)]
    (-> node
        clojure.zip/remove
        clojure.zip/root)))

(defn push-goal [goal new-goal]
  (s/assert ::goal goal)
  (s/assert ::goal new-goal)
  (let [curr-goal (get-goal goal)
        goal (if (= [:none] curr-goal)
               (push-goal-into goal new-goal)
               (let [parent-origin (-> (parent-node (zip goal) curr-goal)
                                       clojure.zip/node)
                     parent-next (push-goal-into parent-origin new-goal)
                     goal (clojure.walk/prewalk-replace {parent-origin parent-next} goal)]
                 goal))]
    goal))


#_(defn first-leaf [gz]
  (if (clojure.zip/end? gz)
    gz
    (if (not (clojure.zip/branch? gz))
      gz
      (recur (clojure.zip/next gz)))))



(defn test-it []
  (let [goal (s/assert
              ::goal
              [:stack
               [:seq [:1] [:2] [:3]]
               [:moveTo]
               [:loop
                [:searchTarget]
                [:attackTarget]]])
        _ (when (not (s/valid? ::goal goal))
            (s/explain-str ::goal goal))
        _ (when (not= [:1] (get-goal goal))
            (throw (js/Error. "must be 1")))
        goal (next-goal goal)
        _ (when (not= [:2] (get-goal goal))
            (throw (js/Error. "must be 2")))
        goal (next-goal goal)
        _ (when (not= [:3] (get-goal goal))
            (throw (js/Error. "must be 3")))
        goal (next-goal goal)
        _ (when (not= [:moveTo] (get-goal goal))
            (throw (js/Error. "must be moveTo")))
        goal (next-goal goal)
        _ (when (not= [:searchTarget] (get-goal goal))
            (throw (js/Error. "must be searchTarget")))
        goal (next-goal goal)
        _ (when (not= [:attackTarget] (get-goal goal))
            (throw (js/Error. "must be attackTarget")))
        goal (next-goal goal)
        _ (when (not= [:searchTarget] (get-goal goal))
            (throw (js/Error. "must be searchTarget")))

        goal (s/assert
              ::goal
              [:seq [:attack]])
        _ (when (not= [:attack] (get-goal goal))
            (throw (js/Error. "must be attack")))
        goal (push-goal goal [:moveTo [0 0]])
        _ (when (not= [:attack] (get-goal goal))
            (throw (js/Error. "must be attack")))
        goal (next-goal goal)
        _ (when (not= [:moveTo [0 0]] (get-goal goal))
            (throw (js/Error. "must be moveTo")))
        goal (next-goal goal)
        _ (when (not= [:none] (get-goal goal))
            (throw (js/Error. "must be none")))

        goal (s/assert
              ::goal
              [:stack])
        _ (when (not= [:none] (get-goal goal))
            (throw (js/Error. "must be none")))
        goal (push-goal goal [:1])
        _ (when (not= [:1] (get-goal goal))
            (throw (js/Error. "must be 1")))
        goal (push-goal goal [:2])
        _ (when (not= [:2] (get-goal goal))
            (throw (js/Error. "must be 2")))
        goal (next-goal goal)
        _ (when (not= [:1] (get-goal goal))
            (throw (js/Error. "must be 1")))
        goal (next-goal goal)
        _ (when (not= [:none] (get-goal goal))
            (throw (js/Error. "must be none")))

        goal (s/assert
              ::goal
              [:loop [:1] [:2] [:3]])
        _ (when (not= [:1] (get-goal goal))
            (throw (js/Error. "must be 1")))
        goal (next-goal goal)
        _ (when (not= [:2] (get-goal goal))
            (throw (js/Error. "must be 2")))
        goal (next-goal goal)
        _ (when (not= [:3] (get-goal goal))
            (throw (js/Error. "must be 3")))
        goal (next-goal goal)
        _ (when (not= [:1] (get-goal goal))
            (throw (js/Error. "must be 1")))

        goal (s/assert
              ::goal
              [:loop
               [:loop
                [:move-to [5 0]]
                [:move-to [5 5]]
                [:move-to [0 5]]
                [:move-to [0 0]]]
               [:attack-and-return (gensym)]])
        _ (println goal)
        ;_ (println (get-goal goal))
        goal (next-goal goal)
        _ (println goal)
        ;_ (println (get-goal goal))
        ]))

