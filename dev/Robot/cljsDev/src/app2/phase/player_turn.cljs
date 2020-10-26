(ns app2.phase.player-turn
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [clojure.set]
            [app2.gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]]
            [tool.indexed :refer [sync-indexed]])
  (:require-macros [app2.macros :refer [async-> defasync]]
                   [app2.phase.core :refer [simple-impl]]))


(def sync-indexed-position (partial sync-indexed
                                    (fn [[_ v]]
                                      (:position v))
                                    second
                                    (fn [ctx id]
                                      (dissoc ctx id))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))
                                    (fn [ctx id entity]
                                      (assoc ctx id entity))))

(def atom-indexed-position-unit (atom {}))

(defn handle-debug [ctx evt]
  (a/go
    (cond
      (fn? evt)
      [(evt ctx) nil]

      (nil? evt)
      [ctx (js/Error. "chan closed")]

      :else
      [ctx nil])))


(defasync handle-unit-menu [ctx any?, evt any?] [ctx err] any?
  [ctx nil])

(defasync menu-step [ctx any?, input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [evt (a/<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-unit-menu evt))
          [ctx cancel? err] (cond
                              (= [:on-click "esc"] evt)
                              [ctx true nil]

                              :else
                              [ctx false nil])
          _ (when err (throw err))]
      (if cancel?
        [ctx nil]
        (recur ctx)))))

(defasync unit-menu [ctx any?, unit any?, input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [menu {}
          ctx (assoc ctx
                     :unit-menu menu
                     :unit-menu-unit unit)
          [ctx err] (a/<! (menu-step ctx input-ch))
          _ (when err (throw err))]
      [(dissoc ctx :unit-menu :unit-menu-unit) nil])))

(defasync system-menu [ctx any?, input-ch any?] [ctx false err] any?
  (loop [ctx ctx]
    (let [menu {}
          ctx (assoc ctx :system-menu menu)
          [ctx err] (a/<! (menu-step ctx input-ch))
          _ (when err (throw err))]
      [(dissoc ctx :system-menu) false nil])))

(defasync player-turn [ctx any?, input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [evt (a/<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-cursor-component evt))
          [ctx end? err] (cond
                           (= [:on-click "space"] evt)
                           (let [units (:units ctx)
                                 cursor (:cursor ctx)
                                 indexed-position-units (sync-indexed-position units @atom-indexed-position-unit)
                                 _ (reset! atom-indexed-position-unit indexed-position-units)
                                 unitAtCursor (indexed-position-units cursor)
                                 [ctx end? err] (if unitAtCursor
                                                  (let [[ctx err] (a/<! (unit-menu ctx unitAtCursor input-ch))]
                                                    [ctx false err])
                                                  (a/<! (system-menu ctx input-ch)))
                                 _ (when err (throw err))]
                             [ctx end? nil])
                           :else
                           [ctx nil])
          _ (when err (throw err))]
      (if end?
        [ctx nil]
        (recur ctx)))))

#_(defn player-turn [ctx input-ch]
    (a/go
      (try
        (simple-impl (handle-cursor-component evt))
        (catch js/Error err
          [ctx err]))))


