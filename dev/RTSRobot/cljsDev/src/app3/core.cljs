(ns app3.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op]
            ["planck-js" :as pl])
  (:require [tool.p5]
            [tool.planck]
            [tool.math]))

(s/check-asserts true)

(s/def ::entity (s/keys :req-un [::id]
                        :opt-un [::tool.planck/body-def]))

(def emitter (rx/Subject.))
(def on-world (rx/ReplaySubject.))
(def on-entity (rx/ReplaySubject.))
(def on-entity-destroy (rx/ReplaySubject.))
(def on-collide (rx/Subject.))
(def on-tick (-> emitter
                 (.pipe (rx-op/filter
                         (fn [[t]]
                           (= :tick t)))
                        (rx-op/timeInterval)
                        (rx-op/map
                         (fn [obj]
                           [:tick (/ (.-interval obj) 1000)])))))
(def on-entities (-> (rx/merge (-> on-entity
                                   (.pipe (rx-op/map (fn [entity]
                                                       [:create entity]))))
                               (-> on-entity-destroy
                                   (.pipe (rx-op/map (fn [entity]
                                                       [:destroy entity])))))
                     (.pipe (rx-op/scan (fn [ctx [cmd entity]]
                                          (cond
                                            (= :create cmd)
                                            (assoc ctx (:id entity) entity)

                                            (= :destroy cmd)
                                            (dissoc ctx (:id entity))

                                            :else
                                            ctx))
                                        {}))))
(defn get-bodies [world]
  (let [bodies (tool.planck/reduce-bodies world
                                          (fn [ctx body]
                                            (let [id (-> body .getUserData)]
                                              (assoc ctx id body)))
                                          {})]
    bodies))

(def on-bodies (-> on-world
                   (.pipe (rx-op/concatMap (fn [world]
                                             (-> on-entities
                                                 (.pipe (rx-op/map (fn []
                                                                     world))))))
                          (rx-op/map (fn [world]
                                       (get-bodies world))))))

(def on-trigger-save (rx/Subject.))
(def on-trigger-load (rx/Subject.))


(defn create-world [world-def]
  (let [world-def-js (clj->js (dissoc world-def :gravity))
        _ (when (:gravity world-def)
            (set! (.-gravity world-def-js) (tool.planck/pl-vector (:gravity world-def))))
        world (pl/World. world-def-js)
        _ (js/console.log world)
        _ (doto on-world
            (.next world)
            (.complete))
        _ (-> on-tick
              (.subscribe (fn [[_ t]]
                            (.step world t))))]
    world))

(defn create-entity [state]
  (s/assert ::entity state)
  (let [atom-state (atom state)
        body-def (:body-def state)
        body-def-js (clj->js (dissoc body-def :fixtures-def))
        _ (when (:position body-def)
            (set! (.-position body-def-js) (tool.planck/pl-vector (:position body-def))))
        _ (when (:linearVelocity body-def)
            (set! (.-linearVelocity body-def-js) (tool.planck/pl-vector (:linearVelocity body-def))))
        _ (-> on-world
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
                              (.next on-entity atom-state)))))]
    atom-state))

(defn destroy-entity [atom-state]
  (let [_ (-> on-world
              (.subscribe (fn [world]
                            (let [bodies (get-bodies world)
                                  body (bodies (:id @atom-state))
                                  _ (when body
                                      (.destroyBody world body))]
                              (.next on-entity-destroy atom-state)))))]))

(defn collide-system []
  (let [atom-entities (atom {})
        _ (-> on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))
        _ (-> on-world
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
                                             (.next on-collide [(entities a-id) (entities b-id)]))))]))))]))


(defn collide-reaction-system! []
  (let [_ (-> on-collide
              (.subscribe (fn [[a b]]
                            (swap! a #(update % :hp dec))
                            (swap! b #(update % :hp dec)))))]))

(defn entity-system [& dos-f]
  (let [atom-entities (atom {})
        _ (-> on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))

        atom-bodies (atom {})
        _ (-> on-bodies
              (.subscribe (fn [entities]
                            (reset! atom-bodies entities))))

        _ (-> emitter
              (.subscribe (fn [evt]
                            (let [players (vals @atom-entities)
                                  _ (doseq [entity players]
                                      (let [body (@atom-bodies (:id @entity))
                                            _ (doseq [do-f dos-f]
                                                (do-f entity body evt))]))]))))]))

(defn player-system! [atom-state body [cmd args]]
  (cond
    (and (:player-state @atom-state)
         body
         (= [:keyPressed "j"] [cmd args]))
    (let [_ (swap! atom-state identity)
          _ (destroy-entity atom-state)])

    :else
    nil))

(defn save-system []
  (let [atom-world (atom nil)
        atom-entities (atom {})
        _ (-> on-world
              (.subscribe (fn [world]
                            (reset! atom-world world))))
        _ (-> on-entities
              (.subscribe (fn [entities]
                            (reset! atom-entities entities))))
        _ (-> on-trigger-save
              (.subscribe (fn [])))]))

(defn load-system []
  (let [_ (-> on-trigger-load
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

(defn view-system []
  (let [atom-world (atom nil)
        atom-entities (atom {})
        _ (-> on-world
              (.subscribe (fn [world]
                            (reset! atom-world world))))
        _ (-> on-entity
              (.subscribe (fn [entity]
                            (swap! atom-entities #(assoc % (:id entity) entity)))))
        _ (-> on-entity-destroy
              (.subscribe (fn [entity]
                            (swap! atom-entities #(dissoc % (:id entity))))))
        atom-nothing (atom 0)
        _ (tool.p5/view "canvas" atom-nothing emitter
                        ["up" "down" "left" "right"
                         "w" "d" "a" "s" "=" "-"
                         "space" "," "."]
                        (fn [p _]
                          (when-let [world @atom-world]
                            (tool.planck/reduce-bodies
                             world
                             (fn [_ body]
                               (tool.planck/reduce-fixtures
                                body
                                (fn [_ fixture]
                                  (let [id (.getUserData body)
                                        shape (.getShape fixture)
                                        shapeType (.getType shape)
                                        _ (cond
                                            (= "circle" shapeType)
                                            (let [world-p (.getWorldPoint body (.getCenter shape))
                                                  [x y] [(.-x world-p) (.-y world-p)]
                                                  radius (.-m_radius shape)
                                                  _ (.circle p x y radius)])

                                            (= "polygon" shapeType)
                                            (let [ps (-> (.-m_vertices shape)
                                                         (.map (fn [p]
                                                                 (.getWorldPoint body p))))
                                                  _ (.beginShape p)
                                                  _ (.forEach ps (fn [v]
                                                                   (.vertex p (.-x v) (.-y v))))
                                                  _ (.endShape p (.-CLOSE p))]))]))
                                0))
                             0))
                          (doseq [entity @atom-entities])))]))

(defn assert-system []
  (let [_ (-> on-world
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert #(instance? pl/World %) obj)))))
        _ (-> on-entity
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert ::entity @obj)))))
        _ (-> on-entity-destroy
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert ::entity @obj)))))
        _ (-> on-collide
              (.pipe (rx-op/tap (fn [[a b]]
                                  (s/assert ::entity @a)
                                  (s/assert ::entity @b)))))
        _ (-> on-tick
              (.pipe (rx-op/filter (fn [[t]]
                                     (= t :tick)))
                     (rx-op/tap (fn [obj]
                                  (s/assert (s/tuple #{:tick} number?) obj)))))

        _ (-> on-entities
              (.pipe (rx-op/tap (fn [obj]
                                  (s/assert (s/map-of any? any?) obj)))))]))

(defn main []
  (let [_ (assert-system)
        _ (load-system)
        _ (save-system)
        _ (view-system)
        _ (.next on-trigger-load 0)]))

(main)