(ns app3.gameplay.core
  (:require [clojure.spec.alpha :as s]
            ["rxjs/operators" :as rx-op]
            ["planck-js" :as pl])
  (:require [app3.gameplay.emitter]
            [app3.gameplay.spec]
            [app3.gameplay.system.basic :refer [create-world create-entity collide-system  entity-system]]
            [app3.gameplay.system.collide :refer [collide-reaction-system!]]
            [app3.gameplay.system.player :refer [player-system!]]
            [app3.gameplay.system.camera :refer [camera-control!]]
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
                            (let [_ (create-world {:gravity [0 9]})
                                  _ (create-entity {:id "player"
                                                    :player-state {}
                                                    :body-def {:userData "player"
                                                               :position [0 0]
                                                               :type :dynamic
                                                               :fixtures-def [{:shape-def [:polygon (cons [0 0] (tool.math/circle-to-polygon 5 0 3.14 4))]
                                                                               :density 1}]}})
                                  _ (create-entity {:id "ai"
                                                    :body-def {:userData "ai"
                                                               :position [0 0]
                                                               :type :dynamic
                                                               :fixtures-def [{:shape-def [:circle [0 0] 3]
                                                                               :density 1}
                                                                              {:shape-def [:circle [3 0] 3]
                                                                               :density 1}
                                                                              {:shape-def [:circle [0 3] 3]
                                                                               :density 1}]}})
                                  
                                  _ (create-entity {:id "wall"
                                                    :body-def {:userData "wall"
                                                               :position [0 0]
                                                               :type :static
                                                               :fixtures-def [{:shape-def [:polygon [[0 30] [800 30] [800 60] [0 60]]]}]}})

                                  _ (collide-system)
                                  _ (collide-reaction-system!)
                                  _ (camera-control!)
                                  _ (entity-system player-system!)]))))]))

(defn assert-system []
  (let [_ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [obj]
                            (s/assert #(instance? pl/World %) obj))))
        _ (-> app3.gameplay.emitter/on-entity
              (.subscribe (fn [obj]
                            (s/assert ::app3.gameplay.spec/entity @obj))))
        _ (-> app3.gameplay.emitter/on-entity-destroy
              (.subscribe (fn [obj]
                            (s/assert ::app3.gameplay.spec/entity @obj))))
        _ (-> app3.gameplay.emitter/on-collide
              (.subscribe (fn [[a b]]
                            (s/assert ::app3.gameplay.spec/entity @a)
                            (s/assert ::app3.gameplay.spec/entity @b))))
        _ (-> app3.gameplay.emitter/on-tick
              (.subscribe (fn [obj]
                            (s/assert (s/tuple #{:tick} number?) obj))))

        _ (-> app3.gameplay.emitter/on-entities
              (.subscribe (fn [obj]
                            (s/assert (s/map-of any? any?) obj))))]))

(defn main []
  (let [_ (assert-system)
        _ (load-system)
        _ (save-system)
        _ (view-system)
        _ (.next app3.gameplay.emitter/on-trigger-load 0)]))
