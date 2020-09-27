(ns app3.gameplay.system.basic
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            ["planck-js" :as pl])
  (:require [app3.gameplay.emitter]
            [app3.gameplay.tool]
            [app3.gameplay.spec]
            [tool.planck]))

(defn create-world [world-def]
  (let [world-def-js (clj->js (dissoc world-def :gravity))
        _ (when (:gravity world-def)
            (set! (.-gravity world-def-js) (tool.planck/pl-vector (:gravity world-def))))
        world (pl/World. world-def-js)
        _ (js/console.log world)
        _ (doto app3.gameplay.emitter/on-world
            (.next world)
            (.complete))
        _ (-> app3.gameplay.emitter/on-tick
              (.subscribe (fn [[_ t]]
                            (.step world t))))]
    world))

(defn create-entity [state]
  (s/assert ::app3.gameplay.spec/entity state)
  (let [atom-state (atom state)
        body-def (:body-def state)
        body-def-js (clj->js (dissoc body-def :fixtures-def))
        _ (when (:position body-def)
            (set! (.-position body-def-js) (tool.planck/pl-vector (:position body-def))))
        _ (when (:linearVelocity body-def)
            (set! (.-linearVelocity body-def-js) (tool.planck/pl-vector (:linearVelocity body-def))))
        _ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [world]
                            (let [body (.createBody world body-def-js)
                                  _ (js/console.log body)
                                  fixture-defs (:fixtures-def body-def)
                                  _ (doseq [fixture-def fixture-defs]
                                      (let [shape-def (:shape-def fixture-def)
                                            fixture-def-js (clj->js (dissoc fixture-def :shape-def))
                                            _ (match shape-def
                                                [:circle [x y] radius]
                                                (.createFixture body
                                                                (pl/Circle (pl/Vec2 x y) radius)
                                                                fixture-def-js)

                                                [:polygon vers]
                                                (.createFixture body
                                                                (pl/Polygon (to-array (map (fn [[x y]] (pl/Vec2 x y)) vers)))
                                                                fixture-def-js))]))]
                              (.next app3.gameplay.emitter/on-entity atom-state)))))]
    atom-state))

(defn destroy-entity [atom-state]
  (let [_ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [world]
                            (let [bodies (app3.gameplay.tool/get-bodies world)
                                  body (bodies (:id @atom-state))
                                  _ (when body
                                      (.destroyBody world body))]
                              (.next app3.gameplay.emitter/on-entity-destroy atom-state)))))]))


(defn collide-system []
  (let [atom-entities (atom {})
        _ (-> app3.gameplay.emitter/on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))
        _ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [world]
                            (let [_ (.on world "begin-contact"
                                         (fn [e]
                                           (let [entities @atom-entities
                                                 a-id (-> e .getFixtureA .getUserData)
                                                 b-id (-> e .getFixtureB .getUserData)
                                                 _ (when (not (entities a-id))
                                                     (throw (js/Error. "not found")))
                                                 _ (when (not (entities b-id))
                                                     (throw (js/Error. "not found")))]
                                             (.next app3.gameplay.emitter/on-collide [(entities a-id) (entities b-id)]))))]))))]))

(defn entity-system [& dos-f]
  (let [atom-entities (atom {})
        _ (-> app3.gameplay.emitter/on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))

        atom-bodies (atom {})
        _ (-> app3.gameplay.emitter/on-bodies
              (.subscribe (fn [entities]
                            (reset! atom-bodies entities))))

        _ (-> app3.gameplay.emitter/emitter
              (.subscribe (fn [evt]
                            (let [players (vals @atom-entities)
                                  _ (doseq [entity players]
                                      (let [body (@atom-bodies (:id @entity))
                                            _ (doseq [do-f dos-f]
                                                (do-f entity body evt))]))]))))]))