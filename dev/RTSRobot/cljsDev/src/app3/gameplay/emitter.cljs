(ns app3.gameplay.emitter
  (:require ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op]
            [clojure.core.matrix :as m])
  (:require [app3.gameplay.tool]))

(def on-world (rx/ReplaySubject.))
(def on-entity (rx/ReplaySubject.))
(def on-entity-destroy (rx/ReplaySubject.))
(def on-collide (rx/Subject.))
(def on-entities (-> (rx/merge (-> on-entity
                                   (.pipe (rx-op/map (fn [entity]
                                                       [:create entity]))))
                               (-> on-entity-destroy
                                   (.pipe (rx-op/map (fn [entity]
                                                       [:destroy entity])))))
                     (.pipe (rx-op/scan (fn [ctx [cmd entity]]
                                          (cond
                                            (= :create cmd)
                                            (assoc ctx (:id @entity) entity)

                                            (= :destroy cmd)
                                            (dissoc ctx (:id @entity))

                                            :else
                                            ctx))
                                        {}))))

(def on-bodies (-> on-world
                   (.pipe (rx-op/switchMap (fn [world]
                                             (-> on-entities
                                                 (.pipe (rx-op/map (fn []
                                                                     world))))))
                          (rx-op/map (fn [world]
                                       (app3.gameplay.tool/get-bodies world))))))

(def on-trigger-save (rx/Subject.))
(def on-trigger-load (rx/Subject.))

; view event
(def emitter (rx/Subject.))
; tick
(def on-tick (-> emitter
                 (.pipe (rx-op/filter
                         (fn [[t]]
                           (= :tick t)))
                        (rx-op/timeInterval)
                        (rx-op/map
                         (fn [obj]
                           [:tick (/ (.-interval obj) 1000)])))))

; camera
(def on-camera (-> emitter
                   (.pipe (rx-op/scan (fn [camera [cmd args]]
                                        (cond
                                          (= [:keyIsDown "left"] [cmd args])
                                          (m/add [-1 0 0] camera)

                                          (= [:keyIsDown "right"] [cmd args])
                                          (m/add [1 0 0] camera)

                                          (= [:keyIsDown "up"] [cmd args])
                                          (m/add [0 -1 0] camera)

                                          (= [:keyIsDown "down"] [cmd args])
                                          (m/add [0 1 0] camera)

                                          (= [:keyPressed "-"] [cmd args])
                                          (m/add [0 0 0.2] camera)

                                          (= [:keyPressed "="] [cmd args])
                                          (m/add [0 0 -0.2] camera)

                                          :else
                                          camera))
                                      [0 0 1]))))

; dragging
(let [mouse-pressed-signal (-> emitter (.pipe (rx-op/filter (fn [[type _]] (= type :mousePressed)))))
      mouse-released-signal (-> emitter (.pipe (rx-op/filter (fn [[type _]] (= type :mouseReleased)))))
      mouse-dragged-signal (-> emitter (.pipe (rx-op/filter (fn [[type _]] (= type :mouseDragged)))))

      select-box-dragging-prepare-signal (-> mouse-pressed-signal
                                             (.pipe (rx-op/switchMap (fn [] mouse-dragged-signal))
                                                    (rx-op/takeUntil mouse-released-signal)
                                                    (rx-op/repeat)))

      mouse-press-pos (atom [0 0])
      _ (.subscribe mouse-pressed-signal (fn [[_ pos]]
                                           (reset! mouse-press-pos pos)))

      select-box-dragging-signal (-> select-box-dragging-prepare-signal
                                     (.pipe (rx-op/map (fn [args]
                                                         (let [[_ [p1x p1y]] args
                                                               [p2x p2y] @mouse-press-pos
                                                               minx (min p1x p2x)
                                                               miny (min p1y p2y)
                                                               maxx (max p1x p2x)
                                                               maxy (max p1y p2y)]
                                                           [[minx miny] [maxx maxy]])))))


      select-box-done-signal (-> select-box-dragging-signal
                                 (.pipe (rx-op/switchMap (fn [] mouse-released-signal))
                                        (rx-op/map (fn [args]
                                                     (let [[_ [p1x p1y]] args
                                                           [p2x p2y] @mouse-press-pos
                                                           minx (min p1x p2x)
                                                           miny (min p1y p2y)
                                                           maxx (max p1x p2x)
                                                           maxy (max p1y p2y)]
                                                       [[minx miny] [maxx maxy]])))))]
  (def on-dragging-box select-box-dragging-signal)
  (def on-dragging-box-done select-box-done-signal))