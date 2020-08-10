(ns app.gameplay.model
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s])
  (:require [app.gameplay.view]))

(s/def ::world #(instance? pl/World %))
(s/def ::life int?)
(s/def ::score int?)
(s/def ::end? boolean?)
(s/def ::camera #(instance? pl/Vec3 %))
(s/def ::viewport #(instance? pl/Vec2 %))
(s/def ::id string?)
(s/def ::selected? boolean?)
(s/def ::timeout number?)
(s/def ::player? boolean?)
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt [::selected? ::timeout ::player?]))
(s/def ::entities (s/map-of ::id ::entity))
(s/def ::select-box (s/tuple (s/tuple int? int?) (s/tuple int? int?)))
(s/def ::gameplay (s/keys :req-un [::world ::life ::score ::end? ::camera ::viewport ::entities]
                          :req-opt [::select-box]))
(def gameplay (s/assert
               ::gameplay
               {:world (pl/World. (js-obj "gravity" (pl/Vec2 0 0)))
                :life 3
                :score 0
                :end? false
                :camera (pl/Vec3. 0 0 0.1)
                :viewport (pl/Vec2. 800 640)
                :entities {}
                :select-box nil}))

(defn destroy-body [gameplay body]
  (let [id (.getUserData body)
        _ (.destroyBody (:world gameplay) body)
        gameplay (update gameplay :entities #(dissoc % id))]
    gameplay))

(defn create-player [gameplay bodyDef entity]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (or (:position bodyDef) (pl/Vec2 0 0))
                                             "userData" (:id entity))))
        _ (doto body
             ; 加上density才會計算轉動
            (.createFixture (pl/Polygon (array (pl/Vec2 -2 -1)
                                               (pl/Vec2 2 0)
                                               (pl/Vec2 -2 1)))
                            (js-obj "density" 1)))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn create-enemy [gameplay {:keys [position angle]} entity]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (s/assert (s/nilable #(instance? pl/Vec2 %)) position)
  (s/assert (s/nilable number?) angle)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (or position (pl/Vec2 0 0))
                                             "angle" (or angle 0)
                                             "userData" (:id entity))))
        _ (doto body
            (.createFixture (pl/Box 10 10) (js-obj "density" 0.1)))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn create-bullet [gameplay {:keys [position angle]} playerBody entity]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (s/assert (s/nilable #(instance? pl/Vec2 %)) position)
  (s/assert (s/nilable number?) angle)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (or position (pl/Vec2 0 0))
                                             "angle" (or angle 0)
                                             "userData" (:id entity))))
        _ (doto body
            (.createFixture (pl/Box 1 1) (js-obj "density" 0.1))
            (.applyLinearImpulse (.getWorldVector playerBody (pl/Vec2 1000 0))
                                 (.getWorldPoint body (pl/Vec2 0 5))
                                 true)
            (.applyAngularImpulse 100 true))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn reduce-bodies [f ctx]
  (s/assert ::gameplay gameplay)
  (let [ctx (loop [body (.getBodyList (:world gameplay))
                   ctx ctx]
              (if body
                (recur (.getNext body) (f ctx body))
                ctx))]
    ctx))

(defn getCameraPoint [viewport camera worldPoint]
  (s/assert #(instance? pl/Vec2 %) viewport)
  (s/assert ::camera camera)
  (s/assert #(instance? pl/Vec2 %) worldPoint)
  (s/assert
   #(instance? pl/Vec2 %)
   (let [p (pl/Vec2.sub worldPoint camera)
         distFactor (/ 1 (.-z camera))
         p (pl/Vec2.mul p distFactor)
         p (pl/Vec2.add p (pl/Vec2.mul viewport (/ 1 2)))]
     p)))

(defn getWorldPoint [viewport camera cameraPoint]
  (s/assert #(instance? pl/Vec2 %) viewport)
  (s/assert ::camera camera)
  (s/assert #(instance? pl/Vec2 %) cameraPoint)
  (s/assert
   #(instance? pl/Vec2 %)
   (let [p (pl/Vec2.sub cameraPoint (pl/Vec2.mul viewport (/ 1 2)))
         distFactor (.-z camera)
         p (pl/Vec2.mul p distFactor)
         p (pl/Vec2.add p camera)]
     p)))

(defn render-fixtures [gameplay]
  (s/assert ::gameplay gameplay)
  (let [entities (atom '())
        {:keys [camera viewport]} gameplay
        distFactor (/ 1 (.-z camera))
        _ (loop [body (.getBodyList (:world gameplay))]
            (when body
              (loop [fixture (.getFixtureList body)]
                (when fixture
                  (let [shape (.getShape fixture)
                        body (.getBody fixture)
                        id (.getUserData body)
                        shapeType (.getType shape)
                        _ (condp = shapeType
                            "circle"
                            (swap! entities #(cons (let [worldPoint (.getWorldPoint body (.getCenter shape))
                                                         worldPoint (getCameraPoint viewport camera worldPoint)]
                                                     (js-obj "type" shapeType
                                                             "point" worldPoint
                                                             "radius" (* distFactor (.-m_radius shape))
                                                             "meta" (-> (get-in gameplay [:entities id]) clj->js)))
                                                   %))
                            "polygon"
                            (swap! entities #(cons (let [worldVertices (-> shape
                                                                           (.-m_vertices)
                                                                           (.map (fn [v]
                                                                                   (.getWorldPoint body v)))
                                                                           (.map (fn [v]
                                                                                   (getCameraPoint viewport camera v))))]
                                                     (js-obj "type" shapeType
                                                             "vertices" worldVertices
                                                             "meta" (-> (get-in gameplay [:entities id]) clj->js)))
                                                   %))
                            0)])
                  (recur (.getNext fixture))))
              (recur (.getNext body))))]
    @entities))

(defn render [gameplay]
  (s/assert ::gameplay gameplay)
  (clj->js (assoc gameplay :fixtures (render-fixtures gameplay))))