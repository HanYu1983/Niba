(ns app2.tool.const
  (:require [tool.indexed :refer [sync-indexed]]
            [tool.keycode :refer [keycode]]))

; "跑test時要設為真"
(def *test true)

; https://clojure.org/reference/transducers
(def xf-filter-evt (comp (map (fn [[cmd args :as evt]]
                                (cond
                                  (= "KEY_DOWN" cmd)
                                  [:on-click (keycode args)]

                                  :else
                                  evt)))))

; get unit by position
(def sync-indexed-position (partial sync-indexed
                                    (fn [[_ v]]
                                      (:position v))
                                    second
                                    (fn [ctx id]
                                      (dissoc ctx id))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))))

(def atom-indexed-position-unit (atom {}))