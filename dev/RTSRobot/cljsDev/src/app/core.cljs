(ns app.core
  (:require ["planck-js" :as pl]
            ["p5" :as p5]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require ["./test.js" :as test-js]))

(s/check-asserts true)

(s/def ::world #(instance? pl/World %))
(s/def ::life int?)
(s/def ::score int?)
(s/def ::end? boolean?)
(s/def ::camera #(instance? pl/Vec3 %))
(s/def ::viewport #(instance? pl/Vec2 %))
(s/def ::id string?)
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt []))
(s/def ::entities (s/map-of ::id ::entity))
(s/def ::gameplay (s/keys :req-un [::world ::life ::score ::end? ::camera ::viewport ::entities]))
(def gameplay (s/assert
               ::gameplay
               {:world (pl/World. (js-obj "gravity" (pl/Vec2 0 0)))
                :life 3
                :score 0
                :end? false
                :camera (pl/Vec3. 0 0 0.1)
                :viewport (pl/Vec2. 800 640)
                :entities {}}))

(defn create-player [gameplay entity]
  (s/assert ::gameplay gameplay)
  (s/assert ::entity entity)
  (let [body (-> gameplay :world
                 (.createDynamicBody (js-obj "position" (pl/Vec2 0 0)
                                             "userData" (:id entity))))
        _ (doto body
             ; 加上density才會計算轉動
            (.createFixture (pl/Polygon (array (pl/Vec2 -2 -1)
                                               (pl/Vec2 2 0)
                                               (pl/Vec2 -2 1)))
                            (js-obj "density" 1)))]
    (update gameplay :entities #(assoc % (:id entity) entity))))

(defn create-enemy [gameplay entity {:keys [position angle]}]
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
                        userData (.getUserData body)
                        shapeType (.getType shape)
                        _ (condp = shapeType
                            "circle"
                            (swap! entities #(cons (let [worldPoint (.getWorldPoint body (.getCenter shape))
                                                         worldPoint (getCameraPoint viewport camera worldPoint)]
                                                     (js-obj "type" shapeType
                                                             "point" worldPoint
                                                             "radius" (* distFactor (.-m_radius shape))
                                                             "userData" userData))
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
                                                             "userData" userData))
                                                   %))
                            0)])
                  (recur (.getNext fixture))))
              (recur (.getNext body))))]
    @entities))

(defn render [gameplay]
  (s/assert ::gameplay gameplay)
  (clj->js (assoc gameplay :fixtures (render-fixtures gameplay))))

(defn view [atom-gameplay outputCh]
  (p5. (fn [p]
         (set! (.-keyPressed p)
               (fn []
                 (println ".-keyPressed" (.-key p) (.-keyCode p))
                 (a/go (a/>! outputCh [:keyPressed (.-keyCode p)]))))

         (set! (.-setup p)
               (let [_ 0]
                 (fn []
                   (.createCanvas p 800 640))))

         (set! (.-draw p)
               (fn []
                 (doseq [key [(.-UP_ARROW p) 
                              (.-LEFT_ARROW p) 
                              (.-DOWN_ARROW p) 
                              (.-RIGHT_ARROW p)
                              32
                              187
                              189
                              87 68 83 65]
                         :when (.keyIsDown p key)]
                   (a/go (a/>! outputCh [:keyIsDown key])))

                 (let [fixtures (.-fixtures @atom-gameplay)]
                   (.background p 0)
                   (.fill p 100)
                   (.stroke p 255)
                   (.forEach fixtures
                             (fn [fix]
                               (condp = (.-type fix)
                                 "circle"
                                 (.ellipse p
                                           (-> fix .-point .-x)
                                           (-> fix .-point .-y)
                                           (-> fix .-radius)
                                           (-> fix .-radius))

                                 "polygon"
                                 (do
                                   (.beginShape p)
                                   (.forEach (-> fix .-vertices)
                                             (fn [v]
                                               (.vertex p (.-x v) (.-y v))))
                                   (.endShape p (.-CLOSE p)))
                                 0)))))))
       "canvas"))

(defn camera-control [gameplay [cmd args]]
  (condp = cmd
    :keyIsDown
    (let [key args]
      (println args)
      (condp = key
        37
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. -1 0 0)))

        38
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 -1 0)))

        39
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 1 0 0)))

        40
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 1 0)))

        187
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 0 -0.01)))

        189
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 0 0.01)))

        gameplay))
    gameplay))

(defn step-world [gameplay [cmd args]]
  (condp = cmd
    :tick
    (let [elapsedTime args
          _ (.step (:world gameplay) elapsedTime)]
      gameplay)
    gameplay))

(defn player-control [gameplay [cmd args]]
  (condp = cmd
    :keyPressed
    (let [gameplay (reduce-bodies (fn [gameplay body]
                                    (let [id (.getUserData body)
                                          entity (get-in gameplay [:entities id])
                                          player? (:player entity)]
                                      (if player?
                                        (let [key args]
                                          (condp = key
                                            32
                                            (let [bulletEntity {:id (str (gensym))
                                                                :bullet true
                                                                :timeout 3000}
                                                  bulletBody (-> gameplay :world
                                                                 (.createDynamicBody (js-obj "position" (.getWorldPoint body (pl/Vec2 5 0))
                                                                                             "angle" (.getAngle body)
                                                                                             "userData" (:id bulletEntity))))
       
                                                  _ (doto bulletBody
                                                      (.createFixture (pl/Box 1 1) (js-obj "density" 0.1))
                                                      (.applyLinearImpulse (.getWorldVector body (pl/Vec2 1000 0))
                                                                           (.getWorldPoint bulletBody (pl/Vec2 0 5))
                                                                           true)
                                                      (.applyAngularImpulse 100 true))
                                                  gameplay (update gameplay :entities #(assoc % (:id bulletEntity) bulletEntity))]
                                              gameplay)
                                            gameplay))
                                        gameplay)))
                                  gameplay)]
      gameplay)
    
    :keyIsDown
    (let [gameplay (reduce-bodies (fn [gameplay body]
                                    (let [id (.getUserData body)
                                          entity (get-in gameplay [:entities id])
                                          player? (:player entity)]
                                      (if player?
                                        (let [key args]
                                          (condp = key
                                            87
                                            (do
                                              (.applyLinearImpulse body 
                                                           (.getWorldVector body (pl/Vec2 5 0)) 
                                                           (.getWorldPoint body (pl/Vec2)) 
                                                           true)
                                              gameplay)
                                            83
                                            (do
                                              (.applyLinearImpulse body
                                                                   (.getWorldVector body (pl/Vec2 -5 0))
                                                                   (.getWorldPoint body (pl/Vec2))
                                                                   true)
                                              gameplay)
                                            68
                                            (let [force 1]
                                              (.applyAngularImpulse body force true)
                                              gameplay)
                                            65
                                            (let [force -1]
                                              (.applyAngularImpulse body force true)
                                              gameplay)
                                            gameplay))
                                        gameplay)))
                                  gameplay)]
      gameplay)
    gameplay))

(defn comp-reduce [fns ctx args]
  (reduce (fn [ctx f]
            (f ctx args))
          ctx
          fns))

(defn model [atom-gameplay inputCh outputCh]
  (a/go
   (loop [gameplay @atom-gameplay]
     (reset! atom-gameplay (render gameplay))
     (let [evt (a/<! inputCh)
           update-fn (partial comp-reduce [camera-control
                                           player-control
                                           step-world])
           gameplay (update-fn gameplay evt)]
       (recur gameplay)))))


(defn test3 []
  (let [gameplay (create-player gameplay {:id (str (gensym))
                                          :player true})
        gameplay (create-enemy gameplay
                               {:id (str (gensym))}
                               {:position (pl/Vec2. 100 100)
                                :angle 1})
        _ (-> (:world gameplay)
              (.createBody (js-obj "position" (pl/Vec2 0 100)
                                   "angle" 0.1))
              (.createFixture (pl/Box. 500 10)))

        #_objA #_(-> (:world gameplay)
                     (.createDynamicBody (js-obj "position" (pl/Vec2 0 50))))
        #__ #_(doto objA
                (.createFixture (pl/Box. 20 20 (pl/Vec2.) 0))
                (.applyForce (pl/Vec2. 100 0) (.getWorldPoint objA (pl/Vec2.)) true)
                (.applyAngularImpulse -100 true))


        atom-gameplay (atom gameplay)
        inputCh (a/chan)
        outputCh (a/chan)
        _ (a/go-loop []
            (a/>! inputCh [:tick (/ 1 60)])
            (a/<! (a/timeout (/ 1000 60)))
            (recur))
        _ (model atom-gameplay inputCh outputCh)
        _ (view atom-gameplay inputCh)]))

(test3)


(defn test2 []
  (let [gameplay gameplay
        gameplay (create-player gameplay {:id (str (gensym))})
        gameplay (create-enemy gameplay
                               {:id (str (gensym))}
                               {:position (pl/Vec2 100 100)
                                :angle 1})
        _ (println gameplay)
        _ (println (render gameplay))
        gameplay (reduce-bodies (fn [gameplay body]
                                  (let [id (.getUserData body)]
                                    (update-in gameplay [:entities id] #(assoc % :win true))))
                                gameplay)
        _ (view (atom (render gameplay)) nil)]))


(defn test-pl []
  (let [world (pl/World. (js-obj))
        fix (-> (.createDynamicBody world (js-obj "position" (pl/Vec2. 0 0)
                                                  "userData" (js-obj "id" 20)))
                (.createFixture (pl/Circle. (pl/Vec2. 0 0) 1) (js-obj "friction" 0.1
                                                                      "restitution" 0.99
                                                                      "density" 0.1
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