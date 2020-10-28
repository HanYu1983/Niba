(ns app2.phase.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]
            [app2.gameplay-spec :as gameplay-spec]
            [app2.component.cursor :refer [handle-cursor-component]]
            [tool.indexed :refer [sync-indexed]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.macros :refer [async-> defasync defnx]]
                   [app2.phase.core :refer [simple-impl]]))

; "跑test時要設為真"
(def *test true)

; get unit by position
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

; handler
(defn handle-debug [ctx evt]
  (go
    (cond
      (fn? evt)
      [(evt ctx) nil]

      (nil? evt)
      [ctx (js/Error. "chan closed")]

      (= :return evt)
      [ctx (js/Error. "return")]

      :else
      [ctx nil])))

(defasync handle-menu-component [ctx any?, menu-key keyword?, evt any?] [ctx err] any?
  (s/assert ::gameplay-spec/menu-component (get-in ctx [menu-key]))
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

; hook
(defn animate-player-turn-start [ctx]
  (go
    (if *test
      (println "animate-player-turn-start:" (:active-player-key ctx))
      (println "animate-player-turn-start:" (:active-player-key ctx)))))

(defnx create-unit-menu-component [ctx any?, unit any?, target-robot any?] [nil err] (s/tuple (s/nilable ::gameplay-spec/menu-component) any?)
  (let [menu [["move"] ["cancel"]]
        data {:unit unit}]
    [{:menu-cursor (tool.menuCursor/model menu)
      :menu-cursor-data data}
     nil]))

(defnx create-system-menu-component [ctx any?] [nil err] (s/tuple (s/nilable ::gameplay-spec/menu-component) any?)
  (let [menu [["endTurn"]]
        data {}]
    [{:menu-cursor (tool.menuCursor/model menu)
      :menu-cursor-data data}
     nil]))

; helper
(defasync menu-step [ctx any?, menu-key keyword?, input-ch any?] [ctx nil err] (s/tuple any? (s/nilable string?) any?)
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-menu-component menu-key evt))

          [ctx cancel? selection err] (s/assert
                                       (s/tuple any? boolean? (s/nilable string?) any?)
                                       (cond
                                         (= [:on-click "esc"] evt)
                                         [ctx true nil nil]

                                         (= [:on-click "space"] evt)
                                         [ctx true (-> ctx menu-key :menu-cursor getSelect) nil]

                                         :else
                                         [ctx false nil nil]))
          _ (when err (throw err))]
      (if (or cancel? selection)
        [ctx selection nil]
        (recur ctx)))))

; phase
(defasync unit-menu [ctx any?, unit any?, input-ch any?] [ctx err] any?
  (let [[menu-component err] (create-unit-menu-component ctx unit nil)
        _ (when err (throw err))
        ctx (assoc ctx :unit-menu-component menu-component)]
    (loop [ctx ctx]
      (let [[ctx selection err] (<! (menu-step ctx :unit-menu-component input-ch))
            _ (when err (throw err))
            [ctx done? err] (if selection
                              (let [cursor1 (-> ctx :unit-menu-component :menu-cursor getCursor1)
                                    {:keys [weapon-idx transform-idx]} (-> ctx :units :menu-cursor-data)
                                    [ctx done? err] (s/assert
                                                     (s/tuple any? boolean? any?)
                                                     (cond
                                                       (= weapon-idx cursor1)
                                                       [ctx false nil]

                                                       (= transform-idx cursor1)
                                                       [ctx false nil]

                                                       :else
                                                       [ctx false nil]))
                                    _ (when err (throw err))]
                                [ctx done? nil])
                              [ctx true nil])
            _ (when err (throw err))]
        (if done?
          [(dissoc ctx :unit-menu-component) nil]
          (recur ctx))))))

(defasync system-menu [ctx any?, input-ch any?] [ctx false err] (s/tuple any? boolean? any?)
  (let [[menu-component err] (create-system-menu-component ctx)
        _ (when err (throw err))
        ctx (assoc ctx :system-menu-component menu-component)]
    (loop [ctx ctx]
      (let [[ctx selection err] (<! (menu-step ctx :system-menu-component input-ch))
            _ (when err (throw err))
            [ctx done? end-turn? err] (s/assert
                                       (s/tuple any? boolean? boolean? any?)
                                       (if selection
                                         (cond
                                           (= "endTurn" selection)
                                           [ctx false true nil]

                                           :else
                                           [ctx false false nil])
                                         [ctx true false nil]))
            _ (when err (throw err))]
        (if (or done? end-turn?)
          [(dissoc ctx :system-menu-component) end-turn? nil]
          (recur ctx))))))

(defasync player-turn [ctx any?, input-ch any?] [ctx err] any?
  (<! (animate-player-turn-start ctx))
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-cursor-component evt))
          [ctx end-turn? err] (s/assert
                               (s/tuple any? boolean? any?)
                               (cond
                                 (= [:on-click "space"] evt)
                                 (let [units (:units ctx)
                                       cursor (:cursor ctx)
                                       indexed-position-units (sync-indexed-position units @atom-indexed-position-unit)
                                       _ (reset! atom-indexed-position-unit indexed-position-units)
                                       unitAtCursor (indexed-position-units cursor)
                                       [ctx end-turn? err] (s/assert
                                                            (s/tuple any? boolean? any?)
                                                            (if unitAtCursor
                                                              (let [[ctx err] (<! (unit-menu ctx unitAtCursor input-ch))]
                                                                [ctx false err])
                                                              (<! (system-menu ctx input-ch))))
                                       _ (when err (throw err))]
                                   [ctx end-turn? nil])

                                 :else
                                 [ctx false nil]))
          _ (when err (throw err))]
      (if end-turn?
        [ctx nil]
        (recur ctx)))))

(defasync enemy-trun [ctx any?, player any?, input-ch any?] [ctx err] any?
  (<! (animate-player-turn-start ctx))
  (if *test
    (loop [ctx ctx]
      (let [evt (<! input-ch)
            [ctx err] (<! (handle-debug ctx evt))]
        (if err
          [ctx nil]
          (recur ctx))))
    [ctx nil]))

(defasync gameplay-loop [ctx (s/keys :req-un [::players ::active-player-key]), input-ch any?] [ctx err] any?
  (loop [ctx ctx]
    (let [ctx (update ctx :active-player-key (constantly :player))
          [ctx err] (<! (player-turn ctx input-ch))
          _ (when err (throw err))
          [ctx end? err] (s/assert
                          (s/tuple any? boolean? any?)
                          (if (:result ctx)
                            [ctx true nil]
                            (<! (async-reduce (fn [[ctx end? err] player]
                                                (go
                                                  (try
                                                    (if (or end? err)
                                                      [ctx end? err]
                                                      (let [ctx (update ctx :active-player-key (constantly (:key player)))
                                                            [ctx err] (<! (enemy-trun ctx player input-ch))
                                                            _ (when err (throw err))
                                                            [ctx end? err] (if (:result ctx)
                                                                             [ctx true nil]
                                                                             [ctx false nil])]
                                                        [ctx end? err]))
                                                    (catch js/Error err
                                                      [ctx false err]))))
                                              [ctx false nil]
                                              (->> (:players ctx)
                                                   (filter #(not= :player (:key %))))))))
          _ (when err (throw err))]
      (if end?
        [ctx nil]
        (recur ctx)))))