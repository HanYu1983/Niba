(ns tool.goal
  (:require [clojure.spec.alpha :as s]))

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
  {:post [(s/valid? ::goal %)]}
  (if (nil? goal)
    [:none]
    goal))

(defmethod get-goal :seq [[_ & [goal & _]]]
  {:post [(s/valid? ::goal %)]}
  (get-goal goal))

(defmethod get-goal :loop [[_ & [goal & _]]]
  {:post [(s/valid? ::goal %)]}
  (get-goal goal))

(defmethod get-goal :stack [[_ & [goal & _]]]
  {:post [(s/valid? ::goal %)]}
  (get-goal goal))


(defmulti next-goal first)
(defmethod next-goal :default [goal]
  goal)

(defmethod next-goal :seq [[type & [goal & goals]]]
  {:post [(s/valid? ::goal %)]}
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
      (cons type goals))))

(defmethod next-goal :loop [[type & [goal & goals]]]
  {:post [(s/valid? ::goal %)]}
  (let [[t & args] goal]
    (cond
      (#{:seq :loop :stack} t)
      (if (nil? args)
        (cons type (reverse (cons goal (reverse goals))))
        (cons type (reverse (cons (next-goal goal) (reverse goals)))))

      :else
      (cons type (reverse (cons goal (reverse goals)))))))

(defmethod next-goal :stack [[type & [goal & goals]]]
  {:post [(s/valid? ::goal %)]}
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
      (cons type goals))))

(defmulti push-goal first)
(defmethod push-goal :default [goal]
  goal)

(defmethod push-goal :seq [[type & goals] newgoal]
  (cons type (reverse (cons newgoal (reverse goals)))))

(defmethod push-goal :loop []
  (throw (js/Error. "not support")))

(defmethod push-goal :stack [[type & goals] newgoal]
  (cons type (cons newgoal goals)))

(defn test-it []
  (let [goal [:stack
              [:seq [:1] [:2] [:3]]
              [:moveTo]
              [:loop
               [:searchTarget]
               [:attackTarget]]]
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
        goal (push-goal goal [:moveTo])
        _ (when (not= [:moveTo] (get-goal goal))
            (throw (js/Error. "must be moveTo")))

        goal [:seq [:attack]]
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

        goal [:stack]
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

        goal [:loop [:1] [:2] [:3]]
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
            (throw (js/Error. "must be 1")))]))

(test-it)