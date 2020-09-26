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


(s/def ::world #(instance? pl/World %))
(s/def ::body #(instance? pl/Body %))
(s/def ::velocity (s/tuple number? number?))
(s/def ::entity (s/keys :req-un [::id]
                        :opt-un [::velocity]))

(defn reduce-bodies [planck f ctx]
  (s/assert ::world planck)
  (let [ctx (loop [body (.getBodyList planck)
                   ctx ctx]
              (if body
                (recur (.getNext body) (f ctx body))
                ctx))]
    ctx))

(defn reduce-fixtures [body f ctx]
  (s/assert ::body body)
  (let [ctx (loop [fix (.getFixtureList body)
                   ctx ctx]
              (if fix
                (recur (.getNext fix) (f ctx fix))
                ctx))]
    ctx))

(defn pl-vector [[x y]]
  (pl/Vec2 x y))

(defn update! [planck old-entites now-entites]
  (s/assert ::world planck)
  (s/assert (s/map-of any? ::entity) old-entites)
  (s/assert (s/map-of any? ::entity) now-entites)
  (update-basic! (fn [created-ids]
                   (let [entities (->> created-ids
                                       (map now-entites))
                         _ (doseq [entity entities]
                             (let [body-def (:body entity)
                                   body (-> planck
                                            (.createDynamicBody (js-obj "position" (or (pl-vector (:position body-def))
                                                                                       (pl/Vec2 0 0))
                                                                        "userData" (:id entity))))
                                   fixture-defs (:fixtures body-def)
                                   _ (doseq [fixture-def fixture-defs]
                                       (.createFixture body
                                                       (pl/Polygon (array (pl/Vec2 -2 -1)
                                                                          (pl/Vec2 2 0)
                                                                          (pl/Vec2 -2 1)))
                                                       (js-obj "density" 1)))]))]))
                 (fn [removed-ids]
                   (let [_ (reduce-bodies planck (fn [_ body]
                                                   (when (removed-ids (-> body .getUserData))
                                                     (.destroyBody planck body)))
                                          0)]))
                 (fn [hold-ids]
                   (let [_ (reduce-bodies planck (fn [_ body]
                                                   (when (hold-ids (-> body .getUserData))
                                                     (let [entity (now-entites (-> body .getUserData))
                                                           _ (when (:velocity entity)
                                                               (.setLinearVelocity body (pl-vector (:velocity entity))))])))
                                          0)]))
                 old-entites
                 now-entites))