(ns app3.gameplay.system.view
  (:require [app3.gameplay.emitter]
            [tool.p5]
            [tool.planck]
            [tool.math]))

(defn view-system []
  (let [viewport [800 640]

        atom-world (atom nil)
        _ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [obj]
                            (reset! atom-world obj))))
        atom-entities (atom {})
        _ (-> app3.gameplay.emitter/on-entities
              (.subscribe (fn [obj]
                            (reset! atom-entities obj))))
        atom-camera (atom {})
        _ (-> app3.gameplay.emitter/on-camera
              (.subscribe (fn [obj]
                            (reset! atom-camera obj))))
        atom-dragging-box (atom nil)
        _ (-> app3.gameplay.emitter/on-dragging-box
              (.subscribe (fn [obj]
                            (reset! atom-dragging-box obj))))
        _ (-> app3.gameplay.emitter/on-dragging-box-done
              (.subscribe (fn []
                            (reset! atom-dragging-box nil))))
        _ (tool.p5/view "canvas" (atom 0) app3.gameplay.emitter/emitter
                        ["up" "down" "left" "right"
                         "w" "d" "a" "s" "=" "-"
                         "space" "," "."]
                        (fn [p _]
                          (let [world @atom-world
                                camera @atom-camera
                                dragging-box @atom-dragging-box]
                            (when (and world camera)
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
                                                    [x y] (tool.math/get-camera-point viewport camera [x y])
                                                    radius (.-m_radius shape)
                                                    radius (* (tool.math/world-camera-factor camera) radius)
                                                    _ (.circle p x y radius)])

                                              (= "polygon" shapeType)
                                              (let [ps (-> (.-m_vertices shape)
                                                           (.map (fn [v]
                                                                   (.getWorldPoint body v))))
                                                    _ (.beginShape p)
                                                    _ (.forEach ps (fn [v]
                                                                     (let [[x y] [(.-x v) (.-y v)]
                                                                           [x y] (tool.math/get-camera-point viewport camera [x y])
                                                                           _ (.vertex p x y)])))
                                                    _ (.endShape p (.-CLOSE p))]))]))
                                  0))
                               0))
                            (when dragging-box
                              (let [[[x y] [x2 y2]] dragging-box
                                    _ (.rect p x y (- x2 x) (- y2 y))]))
                            (doseq [entity @atom-entities]))))]))