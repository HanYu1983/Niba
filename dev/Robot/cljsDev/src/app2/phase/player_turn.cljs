(ns app2.phase.player-turn
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [clojure.set]
            [app2.gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]])
  (:require-macros [app2.macros :refer [async->]]
                   [app2.phase.core :refer [simple-impl]]))


(defn make-indexed [units key-fn value-fn origin]
  (let [next origin
        now-entities (zipmap (map key-fn units)
                             (map value-fn units))

        old-ids (->> (keys origin) (into #{}))
        now-ids (->> (map key-fn units) (into #{}))

        removed-ids (clojure.set/difference old-ids now-ids)
        next (reduce #(dissoc %1 %2) next removed-ids)

        new-ids (clojure.set/difference now-ids old-ids)
        next (reduce #(assoc %1 %2 (now-entities %2)) next new-ids)

        hold-ids (clojure.set/intersection old-ids now-ids)
        next (reduce #(assoc %1 %2 (now-entities %2)) next hold-ids)]
    next))

(def atom-indexed-position-unit (atom (sorted-map-by (fn [[x _] [x2 _]]
                                                       (> x x2)))))
(defn unit-by-position [ctx pos]
  (let [_ (swap! atom-indexed-position-unit (partial make-indexed
                                                     (:units ctx)
                                                     (fn [[_ v]]
                                                       (:position v))
                                                     second))
        unit (@atom-indexed-position-unit pos)]
    unit))

(defn unit-by-range-x [ctx x1 x2]
  (let [_ (swap! atom-indexed-position-unit (partial make-indexed
                                                     (:units ctx)
                                                     (fn [[_ v]]
                                                       (:position v))
                                                     second))
        units (subseq @atom-indexed-position-unit >= [x1 0] < [x2 0])]
    units))

(defn player-turn [ctx input-ch]
  (a/go
    (try
      (loop [ctx ctx]
        (let [evt (a/<! input-ch)
              _ (when (nil? evt)
                  (throw (js/Error. "close")))
              ctx (async-> ctx
                           (handle-cursor-component evt))
              ctx (if (fn? evt)
                    (evt ctx)
                    ctx)]
          (recur ctx)))
      (catch js/Error err
        [ctx err]))))

#_(defn player-turn [ctx input-ch]
  (a/go
    (try
      (simple-impl (handle-cursor-component evt))
      (catch js/Error err
        [ctx err]))))


