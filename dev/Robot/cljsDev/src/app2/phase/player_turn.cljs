(ns app2.phase.player-turn
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [clojure.set]
            [app2.gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]]
            [tool.indexed :refer [sync-indexed]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]])
  (:require-macros [app2.macros :refer [async-> defasync defnx]]
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


(defasync handle-unit-menu [ctx any?, menu-key keyword?, evt any?] [ctx err] any?
  (cond
    (= [:on-click "w"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor1 origin dec)))
     nil]

    (= [:on-click "s"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor1 origin inc)))
     nil]

    (= [:on-click "a"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor2 origin nil dec)))
     nil]
    
    (= [:on-click "d"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor2 origin nil inc)))
     nil]

    :else
    [ctx nil]))

(defasync menu-step [ctx any?, menu-key keyword?, input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [evt (a/<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-unit-menu menu-key evt))

          [ctx cancel? err] (cond
                              (= [:on-click "esc"] evt)
                              [ctx true nil]

                              (= [:on-click "space"] evt)
                              (let [cursor1 (-> ctx :unit-menu getCursor1)
                                    selection (s/assert #{"move"} (-> ctx :unit-menu getSelect))
                                    _ (cond
                                        (= "move" selection)
                                        ctx

                                        :else
                                        ctx)]
                                [ctx false nil])

                              :else
                              [ctx false nil])
          _ (when err (throw err))]
      (if cancel?
        [ctx nil]
        (recur ctx)))))

(defnx create-unit-menu-component [ctx any?, unit any?, target-robot any?] [nil err] (s/tuple (s/nilable ::app2.gameplay-spec/menu-component) any?)
  (let [menu [["move"] ["cancel"]]
        data {:unit unit}]
    [{:menu-cursor (tool.menuCursor/model menu)
      :menu-cursor-data data}
     nil]))


(defasync unit-menu [ctx any?, unit any?, input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [[menu-component err] (create-unit-menu-component ctx unit nil)
          _ (when err (throw err))
          ctx (assoc ctx :unit-menu-component menu-component)
          [ctx err] (a/<! (menu-step ctx :unit-menu-component input-ch))
          _ (when err (throw err))]
      [(dissoc ctx :unit-menu-component) nil])))

(defasync system-menu [ctx any?, input-ch any?] [ctx false err] any?
  (loop [ctx ctx]
    (let [menu {}
          ctx (assoc ctx :system-menu-component menu)
          [ctx err] (a/<! (menu-step ctx :system-menu-component input-ch))
          _ (when err (throw err))]
      [(dissoc ctx :system-menu-component) false nil])))

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


