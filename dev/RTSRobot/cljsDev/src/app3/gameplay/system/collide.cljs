(ns app3.gameplay.system.collide
  (:require [app3.gameplay.emitter]))

(defn collide-reaction-system! []
  (let [_ (-> app3.gameplay.emitter/on-collide
              (.subscribe (fn [[a b]]
                            (swap! a #(update % :hp dec))
                            (swap! b #(update % :hp dec)))))]))