(ns app3.gameplay.system.view
  (:require [app3.gameplay.emitter]
            [tool.p5]
            [tool.planck]))

(defn view-system []
  (let [atom-world (atom nil)
        atom-entities (atom {})
        _ (-> app3.gameplay.emitter/on-world
              (.subscribe (fn [world]
                            (reset! atom-world world))))
        _ (-> app3.gameplay.emitter/on-entity
              (.subscribe (fn [entity]
                            (swap! atom-entities #(assoc % (:id entity) entity)))))
        _ (-> app3.gameplay.emitter/on-entity-destroy
              (.subscribe (fn [entity]
                            (swap! atom-entities #(dissoc % (:id entity))))))
        atom-nothing (atom 0)
        _ (tool.p5/view "canvas" atom-nothing app3.gameplay.emitter/emitter
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