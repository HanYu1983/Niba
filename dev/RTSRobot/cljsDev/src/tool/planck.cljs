(ns tool.planck
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s]
            [clojure.set]))

(defn update-basic! [on-create on-remove on-update old-entites now-entites]
  (s/assert fn? on-create)
  (s/assert fn? on-remove)
  (s/assert fn? on-update)
  (s/assert (s/map-of any? ::entity) old-entites)
  (s/assert (s/map-of any? ::entity) now-entites)
  (let [old-ids (->> (keys old-entites) (into #{}))
        now-ids (->> (keys now-entites) (into #{}))

        removed-ids (clojure.set/difference old-ids now-ids)
        _ (when (> (count removed-ids) 0)
            (on-remove removed-ids))

        new-ids (clojure.set/difference now-ids old-ids)
        _ (when (> (count new-ids) 0)
            (on-create new-ids))

        hold-ids (clojure.set/intersection old-ids now-ids)
        _ (when (> (count hold-ids) 0)
            (on-update hold-ids))]))

(s/def ::vec2 (s/tuple number? number?))

(s/def ::world #(instance? pl/World %))
(s/def ::body #(instance? pl/Body %))
(s/def ::fixture #(instance? pl/Fixture %))

(s/def ::density number?)
(s/def ::filterCategoryBits number?)
(s/def ::filterGroupIndex number?)
(s/def ::filterMaskBits number?)
(s/def ::friction number?)
(s/def ::isSensor boolean?)
(s/def ::restitution number?)
(s/def ::shape-def (s/or :rect (s/tuple #{:rect} ::vec2 ::vec2)
                         :arc (s/tuple #{:arc} number? number? number?)
                         :circle (s/tuple #{:circle} number?)
                         :polygon (s/tuple #{:polygon} (s/coll-of ::vec2))))
(s/def ::userData any?)
(s/def ::fixture-def (s/keys :opt-un [::density
                                      ::filterCategoryBits
                                      ::filterGroupIndex
                                      ::filterMaskBits
                                      ::friction
                                      ::isSensor
                                      ::restitution
                                      ::shape-def
                                      ::filterMaskBits
                                      ::userData]))

(s/def ::active boolean?)
(s/def ::allowSleep boolean?)
(s/def ::angle number?)
(s/def ::angularDamping number?)
(s/def ::angularVelocity number?)
(s/def ::awake boolean?)
(s/def ::bullet boolean?)
(s/def ::fixedRotation boolean?)
(s/def ::gravityScale number?)
(s/def ::linearDamping number?)
(s/def ::linearVelocity ::vec2)
(s/def ::position ::vec2)
(s/def ::type string?)
(s/def ::fixtures-def (s/coll-of ::fixture-def))
(s/def ::body-def (s/keys :opt-un [::active
                                   ::allowSleep
                                   ::angle
                                   ::angularDamping
                                   ::angularVelocity
                                   ::awake
                                   ::bullet
                                   ::fixedRotation
                                   ::gravityScale
                                   ::linearDamping
                                   ::linearVelocity
                                   ::position
                                   ::type
                                   ::userData
                                   ::fixture-def]))

(s/def ::entity (s/keys :req-un [::body-def]))

(defn pl-vector [[x y]]
  (pl/Vec2 x y))

(defn reduce-bodies [planck f ctx]
  (s/assert ::world planck)
  (s/assert fn? f)
  (s/assert any? ctx)
  (let [ctx (loop [body (.getBodyList planck)
                   ctx ctx]
              (if body
                (recur (.getNext body) (f ctx body))
                ctx))]
    ctx))

(defn reduce-fixtures [body f ctx]
  (s/assert ::body body)
  (s/assert fn? f)
  (s/assert any? ctx)
  (let [ctx (loop [fix (.getFixtureList body)
                   ctx ctx]
              (if fix
                (recur (.getNext fix) (f ctx fix))
                ctx))]
    ctx))

(defn reduce-query-fixtures [planck p1 p2 f ctx]
  (s/assert ::world planck)
  (s/assert ::vec2 p1)
  (s/assert ::vec2 p2)
  (s/assert fn? f)
  (s/assert any? ctx)
  (let [atom-selected (atom ctx)
        _ (.queryAABB planck
                      (pl/AABB. (pl-vector p1)
                                (pl-vector p2))
                      (fn [fixture]
                        (swap! atom-selected #(f % fixture))
                        true))]
    @atom-selected))

(defn on! [planck evt-name on-event]
  (s/assert ::world planck)
  (s/assert #{:begin-contact :end-contact :pre-solve :post-solve :remove-joint :remove-fixture :remove-body} evt-name)
  (s/assert fn? on-event)
  (let [_ (.on planck (str evt-name)
               (fn [e]
                 (let [a (-> e .getFixtureA .getUserData)
                       b (-> e .getFixtureB .getUserData)]
                   (on-event a b))))]))

(defn step! [planck t]
  (s/assert ::world planck)
  (s/assert number? t)
  (.step planck t))

(defn update! [planck old-entites now-entites]
  (s/assert ::world planck)
  (s/assert (s/map-of any? ::entity) old-entites)
  (s/assert (s/map-of any? ::entity) now-entites)
  (update-basic! (fn [created-ids]
                   (let [entities (->> created-ids
                                       (map now-entites))
                         _ (doseq [entity entities]
                             (let [; create body
                                   body-def (:body-def entity)
                                   body-def (clj->js (dissoc body-def :fixtures-def))
                                   _ (when (:position body-def)
                                       (set! (.-position body-def) (pl-vector (:position body-def))))
                                   _ (when (:linearVelocity body-def)
                                       (set! (.-linearVelocity body-def) (pl-vector (:linearVelocity body-def))))
                                   _ (js/console.log body-def)
                                   body (.createBody planck body-def)

                                   ; create fixture
                                   fixture-defs (:fixtures-def body-def)
                                   _ (doseq [fixture-def fixture-defs]
                                       (let [fixture-def (clj->js (dissoc fixture-def :shape-def))
                                             _ (js/console.log fixture-def)]
                                         (.createFixture body
                                                         (pl/Polygon (array (pl/Vec2 -2 -1)
                                                                            (pl/Vec2 2 0)
                                                                            (pl/Vec2 -2 1)))
                                                         fixture-def)))]))]))
                 (fn [removed-ids]
                   (let [_ (reduce-bodies planck (fn [_ body]
                                                   (when (removed-ids (-> body .getUserData))
                                                     (.destroyBody planck body)))
                                          0)]))
                 (fn [hold-ids]
                   (let [_ (reduce-bodies planck (fn [_ body]
                                                   (when (hold-ids (-> body .getUserData))
                                                     (let [old-entity (old-entites (-> body .getUserData))
                                                           entity (now-entites (-> body .getUserData))
                                                           _ (when (not= (:body-def old-entity) (:body-def now-entites))
                                                               (when (not= (-> old-entity :body-def :linearVelocity) (-> entity :body-def :linearVelocity))
                                                                 (.setLinearVelocity body (pl-vector (:velocity entity))))
                                                               (when (not= (-> old-entity :body-def :active) (-> entity :body-def :active))
                                                                 (.setActive body (-> entity :body-def :active)))
                                                               (when (not= (-> old-entity :body-def :bullet) (-> entity :body-def :bullet))
                                                                 (.setBullet body (-> entity :body-def :bullet)))
                                                               (when (not= (-> old-entity :body-def :fixedRotation) (-> entity :body-def :fixedRotation))
                                                                 (.setFixedRotation body (-> entity :body-def :fixedRotation))))])))
                                          0)]))
                 old-entites
                 now-entites))