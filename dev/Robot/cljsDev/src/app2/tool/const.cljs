(ns app2.tool.const
  (:require [tool.indexed :refer [sync-indexed]]))

; "跑test時要設為真"
(def *test true)

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