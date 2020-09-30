(ns app3.gameplay.system.collide
  (:require [app3.gameplay.emitter]
            [app3.gameplay.system.basic :refer [destroy-entity]]))

(defn collide-reaction-system! []
  (let [_ (-> app3.gameplay.emitter/on-collide
              (.subscribe (fn [[[a _ fa] [b _ fb]]]
                            (when (= app3.gameplay.emitter/category-player-bullet (.getFilterCategoryBits fa))
                              (destroy-entity a))

                            (when (= app3.gameplay.emitter/category-player-bullet (.getFilterCategoryBits fb))
                              (destroy-entity b))

                            (swap! a #(update % :hp @a))
                            (swap! b #(update % :hp @b)))))]))