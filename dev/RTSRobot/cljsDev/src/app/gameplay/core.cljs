(ns app.gameplay.core
  (:require ["planck-js" :as pl]
            ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op]
            [clojure.spec.alpha :as s])
  (:require [app.gameplay.view]
            [app.gameplay.system.core]
            [app.gameplay.system.body.core]
            [app.gameplay.model]))

(defn comp-reduce [fns ctx args]
  (reduce (fn [ctx f]
            (f ctx args))
          ctx
          fns))

(defn main []
  (let [gameplay app.gameplay.model/gameplay
        gameplay (app.gameplay.model/create-player gameplay
                                                   {:id (str (gensym))
                                                    :player true
                                                    :position (pl/Vec2. 1 1)})
        gameplay (app.gameplay.model/create-enemy gameplay
                                                  {:id (str (gensym))}
                                                  {:position (pl/Vec2. 100 100)
                                                   :angle 1})
        _ (-> (:world gameplay)
              (.createBody (js-obj "position" (pl/Vec2 0 100)
                                   "angle" 0.1))
              (.createFixture (pl/Box. 500 10)))


        atom-gameplay (atom gameplay)
        input-signal (rx/Subject.)
        _ (app.gameplay.view/view atom-gameplay input-signal)


        tick-signal (let [fps 30]
                      (-> (rx/interval (/ 1 fps))
                          (.pipe (rx-op/map (fn [] [:tick (/ 1 fps)])))))
        mouse-pressed-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mousePressed)))))
        mouse-released-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mouseReleased)))))
        mouse-dragged-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mouseDragged)))))

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
                                                             [:select-box-dragging [[minx miny] [maxx maxy]]])))))

        select-box-done-signal (-> select-box-dragging-signal
                                   (.pipe (rx-op/switchMap (fn [] mouse-released-signal))
                                          (rx-op/map (fn [args]
                                                       (let [[_ [p1x p1y]] args
                                                             [p2x p2y] @mouse-press-pos
                                                             minx (min p1x p2x)
                                                             miny (min p1y p2y)
                                                             maxx (max p1x p2x)
                                                             maxy (max p1y p2y)]
                                                         [:select-box-done [[minx miny] [maxx maxy]]])))))

        update-fn (partial comp-reduce [app.gameplay.system.core/camera-control
                                        (partial app.gameplay.system.core/comp-body-control 
                                                 [app.gameplay.system.body.core/player-control])
                                        app.gameplay.system.core/select-box-control
                                        app.gameplay.system.core/step-world])

        model-signal (-> (rx/merge tick-signal
                                   select-box-dragging-signal
                                   select-box-done-signal
                                   input-signal)
                         (.pipe (rx-op/scan update-fn gameplay)))

        _ (.subscribe model-signal
                      (fn [gameplay]
                        (swap! atom-gameplay (constantly (app.gameplay.model/render gameplay)))))]))