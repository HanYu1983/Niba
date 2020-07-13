(ns app.core
  (:require ["planck-js" :as pl]
            ["p5" :as p5]
            ["rxjs" :as rx]
            ["rxjs/operators" :as rx-op]
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
(s/def ::selected? boolean?)
(s/def ::entity (s/keys :req-un [::id]
                        :req-opt [::selected?]))
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

(defn select-box-control [gameplay [cmd args]]
  (cond
    (= cmd :select-box-draging)
    (let [gameplay (assoc gameplay :entities (->> (:entities gameplay)
                                                  vals
                                                  (map (fn [entity]
                                                         (dissoc entity :selected?)))
                                                  (zipmap (keys (:entities gameplay)))))
          {:keys [camera viewport]} gameplay
          [[x1 y1] [x2 y2]] (s/assert ::select-box args)
           
          atom-selected (atom [])
          _ (.queryAABB (:world gameplay)
                        (pl/AABB. (getWorldPoint viewport camera (pl/Vec2. x1 y1)) 
                                  (getWorldPoint viewport camera (pl/Vec2. x2 y2)))
                        (fn [fixture]
                          (when (-> fixture .getBody .getUserData)
                            (swap! atom-selected #(cons (-> fixture .getBody .getUserData) %)))
                          true))
          gameplay (reduce (fn [gameplay id]
                             (update-in gameplay [:entities id] (fn [entity]
                                                                  (assoc entity :selected? true))))
                           gameplay
                           @atom-selected)
          gameplay (assoc gameplay :select-box args)]
      gameplay)

    (= cmd :mouseReleased)
    (dissoc gameplay :select-box)

    :else
    gameplay))


(defn comp-reduce [fns ctx args]
  (reduce (fn [ctx f]
            (f ctx args))
          ctx
          fns))

(defn view [atom-gameplay input-signal]
  (p5. (fn [p]
         (set! (.-keyPressed p)
               (fn []
                 ;(println ".-keyPressed" (.-key p) (.-keyCode p))
                 (.next input-signal [:keyPressed (.-keyCode p)])))

         (set! (.-keyReleased p)
               (fn []
                 ;(println ".-keyReleased" (.-key p) (.-keyCode p))
                 (.next input-signal [:keyReleased (.-keyCode p)])))

         (set! (.-mousePressed p)
               (fn []
                 ;(println ".-mousePressed" (.-mouseButton p))
                 (.next input-signal [:mousePressed [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseReleased p)
               (fn []
                 ;(println ".-mouseReleased" (.-mouseButton p))
                 (.next input-signal [:mouseReleased [(.-mouseX p) (.-mouseY p) (.-mouseButton p)]])))

         (set! (.-mouseMoved p)
               (fn []
                 ;(println ".-mouseMoved")
                 (.next input-signal [:mouseMoved])))

         (set! (.-mouseDragged p)
               (fn []
                 (.next input-signal [:mouseDragged [(.-mouseX p) (.-mouseY p)]])))

         (set! (.-setup p)
               (let [_ 0]
                 (fn []
                   (.createCanvas p 800 640))))

         (set! (.-draw p)
               (fn []
                 ;(js/console.log @atom-gameplay)

                 (doseq [key [(.-UP_ARROW p)
                              (.-LEFT_ARROW p)
                              (.-DOWN_ARROW p)
                              (.-RIGHT_ARROW p)
                              32
                              187
                              189
                              87 68 83 65]
                         :when (.keyIsDown p key)]
                   (.next input-signal [:keyIsDown key]))

                 (let [fixtures (.-fixtures @atom-gameplay)]
                   (.background p 0)
                   (.fill p 100)
                   (.stroke p 255)
                   (.forEach fixtures
                             (fn [fix]
                               (let [meta (aget @atom-gameplay "entities" (.-userData fix))]
                                 (.stroke p 255)
                                 (condp = (.-type fix)
                                   "circle"
                                   (.ellipse p
                                             (-> fix .-point .-x)
                                             (-> fix .-point .-y)
                                             (-> fix .-radius)
                                             (-> fix .-radius))

                                   "polygon"
                                   (do
                                     (when meta
                                       (let [v (aget fix "vertices" 0)]
                                         (.text p (.-id meta) (.-x v) (.-y v)))
                                       (when (aget meta "selected?")
                                         (.stroke p 0 255 0)))

                                     (.beginShape p)
                                     (.forEach (-> fix .-vertices)
                                               (fn [v]
                                                 (.vertex p (.-x v) (.-y v))))
                                     (.endShape p (.-CLOSE p)))
                                   0)))))

                 (let [select-box (aget @atom-gameplay "select-box")]
                   (when select-box
                     (.fill p 0 255 0 100)
                     (.rect p
                            (aget select-box 0 0)
                            (aget select-box 0 1)
                            (- (aget select-box 1 0) (aget select-box 0 0))
                            (- (aget select-box 1 1) (aget select-box 0 1))))))))
       "canvas"))

(defn test4 []
  (let [gameplay (create-player gameplay {:id (str (gensym))
                                          :player true
                                          :position (pl/Vec2. 1 1)})
        gameplay (create-enemy gameplay
                               {:id (str (gensym))}
                               {:position (pl/Vec2. 100 100)
                                :angle 1})
        _ (-> (:world gameplay)
              (.createBody (js-obj "position" (pl/Vec2 0 100)
                                   "angle" 0.1))
              (.createFixture (pl/Box. 500 10)))


        atom-gameplay (atom gameplay)
        input-signal (rx/Subject.)
        _ (view atom-gameplay input-signal)


        tick-signal (let [fps 30]
                      (-> (rx/interval (/ 1 fps))
                          (.pipe (rx-op/map (fn [] [:tick (/ 1 fps)])))))
        mouse-pressed-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mousePressed)))))
        mouse-released-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mouseReleased)))))
        mouse-dragged-signal (-> input-signal (.pipe (rx-op/filter (fn [[type _]] (= type :mouseDragged)))))

        select-box-draging-prepare-signal (-> mouse-pressed-signal
                                              (.pipe (rx-op/switchMap (fn [] mouse-dragged-signal))
                                                     (rx-op/takeUntil mouse-released-signal)
                                                     (rx-op/repeat)))
        
        mouse-press-pos (atom [0 0])
        _ (.subscribe mouse-pressed-signal (fn [[_ pos]]
                                             (reset! mouse-press-pos pos)))

        select-box-draging-signal (-> select-box-draging-prepare-signal
                                      (.pipe (rx-op/map (fn [args]
                                                          (let [[_ [p1x p1y]] args
                                                                [p2x p2y] @mouse-press-pos
                                                                minx (min p1x p2x)
                                                                miny (min p1y p2y)
                                                                maxx (max p1x p2x)
                                                                maxy (max p1y p2y)]
                                                            [:select-box-draging [[minx miny] [maxx maxy]]])))))

        select-box-done-signal (-> select-box-draging-signal
                                   (.pipe (rx-op/switchMap (fn [] mouse-released-signal))))


        update-fn (partial comp-reduce [camera-control
                                        player-control
                                        select-box-control
                                        step-world])
        model-signal (-> (rx/merge
                          tick-signal
                          select-box-draging-signal
                          select-box-done-signal
                          input-signal)
                         (.pipe (rx-op/scan update-fn gameplay)))

        _ (.subscribe
           model-signal
           (fn [gameplay]
             (swap! atom-gameplay (constantly (render gameplay)))))]))


(test4)