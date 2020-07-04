(ns app.core
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]))

(s/check-asserts true)

(s/def ::world #(instance? pl/World %))
(s/def ::life int?)
(s/def ::score int?)
(s/def ::end? boolean?)
(s/def ::camera #(instance? pl/Vec2 %))
(s/def ::id string?)
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt []))
(s/def ::entities (s/map-of ::id ::entity))
(s/def ::gameplay (s/keys :req-un [::world ::life ::score ::end? ::camera ::entities]))
(def gameplay (s/assert
               ::gameplay
               {:world (pl/World. (js-obj))
                :life 3
                :score 0
                :end? false
                :camera (pl/Vec2. 0 0)
                :entities {}}))

(defn create-player [gameplay entity]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (pl/Vec2. 0 0)
                                             "userData" (:id entity))))
        _ (doto body
            (.createFixture (pl/Circle. (pl/Vec2. 0 0) 10)))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn create-enemy [gameplay entity {:keys [position angle]}]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (s/assert (s/nilable #(instance? pl/Vec2 %)) position)
  (s/assert (s/nilable number?) angle)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (or position (pl/Vec2. 0 0))
                                             "angle" (or angle 0)
                                             "userData" (:id entity))))
        _ (doto body
            (.createFixture (pl/Box 10 10)))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn reduce-entities [f ctx]
  (s/assert ::gameplay gameplay)
  (let [ctx (loop [body (.getBodyList (:world gameplay))
                   ctx ctx]
              (if body
                (recur (.getNext body) (f ctx body))
                ctx))]
    ctx))

(defn render-fixtures [gameplay]
  (s/assert ::gameplay gameplay)
  (let [entities (atom '())
        _ (loop [body (.getBodyList (:world gameplay))]
            (when body
              (loop [fixture (.getFixtureList body)]
                (when fixture
                  (let [shape (.getShape fixture)
                        body (.getBody fixture)
                        tx (.getTransform body)
                        userData (.getUserData body)
                        shapeType (.getType shape)
                        _ (condp = shapeType
                            "circle"
                            (swap! entities #(cons (let [worldPoint (.getWorldPoint body (.getCenter shape))]
                                                     (js-obj "type" shapeType
                                                             "vertices" (array worldPoint)
                                                             "userData" userData))
                                                   %))
                            "polygon"
                            (swap! entities #(cons (let [worldVertices (-> shape
                                                                           (.-m_vertices)
                                                                           (.map (pl/Transform.mulFn tx)))]
                                                     (js-obj "type" shapeType
                                                             "vertices" worldVertices
                                                             "userData" userData))
                                                   %))
                            0)])
                  (recur (.getNext fixture))))
              (recur (.getNext body))))]
    @entities))

(defn render [gameplay]
  (s/assert ::gameplay gameplay)
  (clj->js (assoc gameplay :fixtures (render-fixtures gameplay))))

(defn test2 []
  (let [gameplay gameplay
        gameplay (create-player gameplay {:id (str (gensym))})
        gameplay (create-enemy gameplay
                                {:id (str (gensym))}
                                {:position (pl/Vec2. 10 10)
                                 :angle 1})
        _ (println gameplay)
        _ (js/console.log (render gameplay))
        gameplay (reduce-entities (fn [gameplay body]
                                    (let [id (.getUserData body)]
                                      (update-in gameplay [:entities id] #(assoc % :win true))))
                                  gameplay)
        _ (println gameplay)]))

(test2)

(defn test-pl []
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
                            (let [worldPoint (.getWorldPoint body (.getCenter shape))
                                  _ (js/console.log worldPoint)])
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