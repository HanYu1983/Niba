(ns app4.core
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s]))

(s/def ::world #(instance? pl/World %))
(s/def ::body #(instance? pl/Body %))
(s/def ::fixture #(instance? pl/Fixture %))

(defn create-world [world-def]
  (let [world (pl/World. world-def)]
    world))

(defn create-shape [shape-def])

(defn create-body [world body-def]
  (let [body (.createBody world body-def)
        _ (.forEach (.-fixtures body-def)
                    (fn [fixture-def]
                      (let [shape-def (.-shape fixture-def)
                            _ (.createFixture body
                                              (create-shape shape-def)
                                              fixture-def)])))
        _ (.setUserData body body-def)]))

(defn reduce-bodies [planck f ctx]
  (s/assert ::world planck)
  (s/assert fn? f)
  (s/assert any? ctx)
  (let [ctx (loop [body (.getBodyList planck)
                   ctx ctx]
              (if body
                (recur (.getNext body) (f ctx (s/assert ::body body)))
                ctx))]
    ctx))

(defn get-world-memonto [world]
  (let [_ (reduce-bodies world (fn [ctx body]
                                 (.push ctx (js-obj "userData" (.getUserData body))))
                         (array))]))