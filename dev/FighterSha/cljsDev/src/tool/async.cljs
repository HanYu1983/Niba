(ns tool.async
  (:require [clojure.core.async :as a]))

(defn async-reduce [f init data]
  (a/go
    (loop [coll (into [] data)
           acc init]
      (let [[x & rest] coll]
        (if x
          (let [acc (a/<! (f acc x))]
            (recur rest acc))
          acc)))))

(defn async-map [f data]
  (a/map vector (map f data)))

(defn test-1 []
  (a/go
    (let [_ (println (a/<! (async-map (fn [id]
                                        (a/go
                                          (inc id)))
                                      [1 2 3])))
          _ (println (a/<! (async-reduce (fn [acc c]
                                           (a/go
                                             (cons c acc)))
                                         []
                                         [1 2 3])))])))