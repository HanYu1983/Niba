(ns app2.phase.player-turn
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [clojure.set]
            [app2.gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]]
            [tool.indexed :refer [sync-indexed]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.macros :refer [async-> defasync defnx]]
                   [app2.phase.core :refer [simple-impl]]))

(def *test true)

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
      
      (= :return evt)
      [ctx (js/Error. "return")]

      :else
      [ctx nil])))

(defn animate-player-turn-start [ctx]
  (a/go
   (if *test
     (println "animate-player-turn-start:" (:active-player-key ctx))
     (println "animate-player-turn-start:" (:active-player-key ctx)))))

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

(defasync menu-step [ctx any?, menu-key keyword?, input-ch any?] [ctx nil err] (s/tuple any? (s/nilable string?) any?)
  (loop [ctx ctx]
    (let [evt (a/<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-unit-menu menu-key evt))

          [ctx cancel? selection err] (cond
                                        (= [:on-click "esc"] evt)
                                        [ctx true nil nil]

                                        (= [:on-click "space"] evt)
                                        [ctx true (-> ctx menu-key :menu-cursor getSelect) nil]

                                        :else
                                        [ctx false nil nil])
          _ (when err (throw err))]
      (if (or cancel? selection)
        [ctx selection nil]
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
          [ctx selection err] (a/<! (menu-step ctx :unit-menu-component input-ch))
          _ (when err (throw err))]
      [(dissoc ctx :unit-menu-component) nil])))

(defasync system-menu [ctx any?, input-ch any?] [ctx false err] (s/tuple any? boolean? any?)
  (loop [ctx ctx]
    (let [menu {}
          ctx (assoc ctx :system-menu-component menu)
          [ctx selection err] (a/<! (menu-step ctx :system-menu-component input-ch))
          _ (when err (throw err))
          [ctx end-turn? err] (cond
                                (= "endTurn" selection)
                                [ctx true nil]

                                :else
                                [ctx false nil])
          _ (when err (throw err))]
      [(dissoc ctx :system-menu-component) end-turn? nil])))

(defasync player-turn [ctx any?, input-ch any?] [ctx err] any?
  (a/<! (animate-player-turn-start ctx))
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


(defasync enemy-trun [ctx any?, player any?, input-ch any?] [ctx err] any?
  (a/<! (animate-player-turn-start ctx))
  (if *test
    (loop [ctx ctx]
      (let [evt (a/<! input-ch)
            [ctx err] (a/<! (handle-debug ctx evt))]
        (if err
          [ctx nil]
          (recur ctx))))
    [ctx nil]))

(defasync gameplay-loop [ctx (s/keys :req-un [::players ::active-player-key]), input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [ctx (update ctx :active-player-key (constantly :player))
          [ctx err] (a/<! (player-turn ctx input-ch))
          _ (when err (throw err))
          [ctx end? err] (if (:result ctx)
                           [ctx true nil]
                           (a/<! (async-reduce (fn [[ctx end? err] player]
                                                 (a/go
                                                   (try
                                                     (if (or end? err)
                                                       [ctx end? err]
                                                       (let [ctx (update ctx :active-player-key (constantly (:key player)))
                                                             [ctx err] (a/<! (enemy-trun ctx player input-ch))
                                                             _ (when err (throw err))
                                                             [ctx end? err] (if (:result ctx)
                                                                              [ctx true nil]
                                                                              [ctx false nil])]
                                                         [ctx end? err]))
                                                     (catch js/Error err
                                                       [ctx false err]))))
                                               [ctx false nil]
                                               (->> (:players ctx)
                                                    (filter #(not= :player (:key %)))))))
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


