(ns client.core
  (:require [cljs.reader :as reader]))
(enable-console-print!)
(.log js/console "abc")
(println "abc")

(-> (js/axios (clj->js {:method "GET"
                        :url "/fn/model"}))
    (.then (fn [resp]
             (-> resp (.-data) reader/read-string println)))
    (.catch println))
