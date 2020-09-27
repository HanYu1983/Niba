(ns app3.gameplay.emitter
  (:require ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op])
  (:require [app3.gameplay.tool]))

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

(def on-bodies (-> on-world
                   (.pipe (rx-op/concatMap (fn [world]
                                             (-> on-entities
                                                 (.pipe (rx-op/map (fn []
                                                                     world))))))
                          (rx-op/map (fn [world]
                                       (app3.gameplay.tool/get-bodies world))))))

(def on-trigger-save (rx/Subject.))
(def on-trigger-load (rx/Subject.))
