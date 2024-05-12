(ns client.core
  (:require [cljs.reader :as reader]
            [reagent.core :as r]
            [reagent.dom :as d]))


(def model-atom (r/atom {:id "default"}))


(defn home-page []
  (let [model @model-atom]
    [:div
     [:div [:h2 (-> model :id)]]
     [:button
      {:on-click (fn [e]
                   (.log js/console e)
                   (swap! model-atom (fn [origin] {:id "gan"})))}
      "Click"]]))

(defn main []
  (enable-console-print!)
  (d/render [home-page] (.getElementById js/document "app")))
  
(main)

(-> (js/axios (clj->js {:method "GET"
                        :url "/fn/model"}))
    (.then (fn [resp]
             (-> resp (.-data) reader/read-string :main println)))
    (.catch println))
