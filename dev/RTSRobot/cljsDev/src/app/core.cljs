(ns app.core
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]))

(s/check-asserts true)

(defn main []
  (let [world (pl/World. (js-obj))
        fix (-> (.createDynamicBody world (js-obj "position" (pl/Vec2. 0 0)
                                                  "userData" (js-obj "id" 20)))
                (.createFixture (pl/Circle. (pl/Vec2. 0 0) 1) (js-obj "friction" 0.1
                                                                      "restitution" 0.99
                                                                      "density" 1
                                                                      "userData" "ball")))
        _ (-> (.createBody world (js-obj "position" (pl/Vec2 10 10)
                                         "angle" 1))
              (.createFixture (pl/Box. 1 1)))
        ; render
        _ (loop [body (.getBodyList world)]
            (when body
              (loop [fixture (.getFixtureList body)]
                (when fixture
                  (let [shape (.getShape fixture)
                        body (.getBody fixture)
                        tx (.getTransform body)
                        _ (condp = (.getType shape)
                            "circle"
                            0
                            "polygon"
                            (let [worldVertices (-> shape
                                                    (.-m_vertices)
                                                    (.map (pl/Transform.mulFn tx)))
                                  _ (js/console.log worldVertices)])
                            0)])
                  (js/console.log "store:" fixture)
                  (recur (.getNext fixture))))
              (recur (.getNext body))))

        ; apply force
        body (.getBody fix)
        _ (.applyForce body (pl/Vec2. 1 1) (pl/Vec2. 0 0) true)
        ; apply force
        _ (.step world 10)
        shape (.getShape fix)
        _ (js/console.log body)
        _ (js/console.log shape (.getCenter shape) (.getWorldPoint body (.getCenter shape)))
        ; query aabb
        _ (.queryAABB world
                      (pl/AABB. (pl/Vec2. 0 0) (pl/Vec2. 5 5))
                      (fn [fixture]
                        (js/console.log "find" fixture (.getUserData fixture))
                        true))
        ; change position
        _ (.setPosition body (pl/Vec2 10 10))
        ; query aabb again
        _ (.queryAABB world
                      (pl/AABB. (pl/Vec2. 0 0) (pl/Vec2. 15 15))
                      (fn [fixture]
                        (js/console.log "find" fixture (.getUserData fixture))
                        true))]))

(main)