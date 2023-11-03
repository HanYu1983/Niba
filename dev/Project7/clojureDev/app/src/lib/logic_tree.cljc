(ns lib.logic-tree)

(defn or? [tree]
  (= (first tree) 'Or))

(defn and? [tree]
  (= (first tree) 'And))

(defn leaf? [tree]
  (= (first tree) 'Leaf))

(defn children [tree]
  (rest tree))

(defn cross-product [a b]
  (for [x a y b] (concat x y)))

(defn enumerateAll [tree]
  (cond
    (or? tree) (mapcat enumerateAll (children tree))
    (and? tree) (reduce cross-product '(()) (map enumerateAll (children tree)))
    (leaf? tree) (list (list (second tree)))
    :else (throw (ex-info (str "Unknown tree structure" tree) {}))))

(defn has [tree keys]
  (->> (enumerateAll tree) (map #(into #{} %)) (some #(= (into #{} keys) %))))

(def question1 '(And
                 (Leaf "action-1")
                 (Leaf "action-2")
                 (Or (Leaf "action-3")
                     (Leaf "action-4")
                     (Or (Leaf "5")
                         (Leaf "6")))
                 (And
                  (Leaf "action-7")
                  (Leaf "action-8"))
                 (And
                  (Or
                   (Leaf "action-9")
                   (Leaf "action-10"))
                  (Leaf "action-11"))))

(def question2 '(And
                 (Leaf "5")
                 (Leaf "6")
                 (Or
                  (Leaf "1")
                  (Or
                   (Leaf "2")
                   (Leaf "3")))))

(def question3 '(And
                 (Leaf "5")
                 (Leaf "6")
                 (Or
                  (Leaf "1")
                  (Or
                   (Leaf "2")
                   (Leaf "3")))
                 (Or
                  (Leaf "7")
                  (And
                   (Leaf "8")
                   (Leaf "9")))))

(defn test-all []
  (println (enumerateAll question1))
  (println (enumerateAll question2))
  (println (enumerateAll question3)))