


(defmulti tagEntry first)
(s/def ::tagEntry (s/multi-spec tagEntry ::tagEntry))

(defmethod tagEntry :moveToPosition [_] (s/tuple keyword? ::position))
(defmethod tagEntry :moveToUnit [_] (s/tuple keyword? ::unit))
(defmethod tagEntry :supportUnit [_] (s/tuple keyword? ::unit))
(defmethod tagEntry :loopGoal [_] (s/tuple keyword? (s/* ::tagEntry)))

(defmethod tagEntry :moveTo [_] (s/tuple keyword? ::position))
(s/def ::attitude (s/map-of keyword? ))



(defmulti get-goal first)
(defmethod get-goal :default [goal]
  goal)
(defmethod get-goal :seq [[_ idx & goals]]
  (recur (nth goals idx)))

(defmethod get-goal :loop [[_ idx & goals]]
  (recur (nth goals idx)))

(defmethod get-goal :stack [[_ & goals]]
  (recur (last goals)))

(defmulti update-goal first)
(defmethod update-goal :default [goal]
  goal)

(defmethod update-goal :seq [[_ idx & goals]]
  (replace {(nth goals idx) (update-goal (nth goals idx))}))

(defmethod update-goal :loop [[_ idx & goals]]
  (recur (nth goals idx)))

(defmethod update-goal :stack [[_ & goals]]
  (recur (last goals)))

(def goal [:seq 0
           [:moveTo [0 0]]
           [:loop 0
            [:moveTo [0 0]]
            [:moveTo [20 20]]]
           [:stack [[:moveTo [20 0]]
                    [:moveTo [30 30]]
                    [:loop 0 [:moveTo [0 0]]]]]])