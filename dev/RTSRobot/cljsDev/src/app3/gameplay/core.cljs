(ns app3.gameplay.core
  (:require [clojure.spec.alpha :as s]
            ["rxjs/operators" :as rx-op]
            ["planck-js" :as pl])
  (:require [app3.gameplay.emitter]
            [app3.gameplay.system.basic :refer [create-world create-entity collide-system  entity-system]]
            [app3.gameplay.system.collide :refer [collide-reaction-system!]]
            [app3.gameplay.system.player :refer [player-system!]]
            [app3.gameplay.system.view :refer [view-system]]
            [tool.p5]
            [tool.planck]
            [tool.math]))

(defn save-system []
  (let [atom-world (atom nil)
        atom-entities (atom {})
        _ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [world]
                            (reset! atom-world world))))
        _ (-> app3.gameplay.emitter/on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))
        _ (-> app3.gameplay.emitter/on-trigger-save
              (.subscribe (fn [])))]))

(defn load-system []
  (let [_ (-> app3.gameplay.emitter/on-trigger-load
              (.subscribe (fn []
                            (let [_ (create-world {:gravity [1 0]})
                                  _ (create-entity {:id "player"
                                                    :player-state {}
                                                    :body-def {:userData "player"
                                                               :position [100 100]
                                                               :type :dynamic
                                                               :fixtures-def [{:shape-def [:circle [100 0] 50]}
                                                                              {:shape-def [:polygon (cons [0 0] (tool.math/circle-to-polygon 20 0 3.14 4))]}]}})
                                  _ (collide-system)
                                  _ (collide-reaction-system!)
                                  _ (entity-system player-system!)]))))]))

(defn assert-system []
  (let [_ (-> app3.gameplay.emitter/on-world
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert #(instance? pl/World %) obj)))))
        _ (-> app3.gameplay.emitter/on-entity
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert ::entity @obj)))))
        _ (-> app3.gameplay.emitter/on-entity-destroy
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert ::entity @obj)))))
        _ (-> app3.gameplay.emitter/on-collide
              (.pipe (rx-op/tap (fn [[a b]]
                                  (s/assert ::entity @a)
                                  (s/assert ::entity @b)))))
        _ (-> app3.gameplay.emitter/on-tick
              (.pipe (rx-op/filter (fn [[t]]
                                     (= t :tick)))
                     (rx-op/tap (fn [obj]
                                  (s/assert (s/tuple #{:tick} number?) obj)))))

        _ (-> app3.gameplay.emitter/on-entities
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert (s/map-of any? any?) obj)))))]))

(defn main []
  (let [_ (assert-system)
        _ (load-system)
        _ (save-system)
        _ (view-system)
        _ (.next app3.gameplay.emitter/on-trigger-load 0)]))
