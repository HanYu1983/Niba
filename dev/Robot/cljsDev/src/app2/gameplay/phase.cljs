(ns app2.gameplay.phase
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]            
            [app2.component.cursor :refer [handle-cursor-component]]
            [app2.component.debug :refer [handle-debug]]
            [app2.component.menu :refer [handle-menu-component]]
            [app2.gameplay.hook.animation :refer [animate-player-turn-start]]
            [app2.gameplay.hook.alg :refer [create-system-menu-component create-unit-menu-component]]
            [app2.tool.const :refer [*test sync-indexed-position atom-indexed-position-unit]]
            [app2.tool.core-step :refer [menu-step]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

; phase
(defasync unit-menu [ctx ::gameplay-spec/gameplayCtx, unit ::gameplay-spec/unit, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
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

(defasync system-menu [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx false err] (s/tuple ::gameplay-spec/gameplayCtx boolean? any?)
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

(defasync player-turn [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
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

(defasync enemy-trun [ctx ::gameplay-spec/gameplayCtx, player ::gameplay-spec/player, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (<! (animate-player-turn-start ctx))
  (if *test
    (loop [ctx ctx]
      (let [evt (<! input-ch)
            [ctx err] (<! (handle-debug ctx evt))]
        (if err
          [ctx nil]
          (recur ctx))))
    [ctx nil]))

(defasync gameplay-loop [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (loop [ctx ctx]
    (let [ctx (update ctx :active-player-key (constantly :player))
          [ctx err] (<! (player-turn ctx input-ch))
          _ (when err (throw err))
          [ctx end? err] (s/assert
                          (s/tuple any? boolean? any?)
                          (if (:done ctx)
                            [ctx true nil]
                            (<! (async-reduce (fn [[ctx end? err] player]
                                                (go
                                                  (try
                                                    (if (or end? err)
                                                      [ctx end? err]
                                                      (let [ctx (update ctx :active-player-key (constantly (:key player)))
                                                            [ctx err] (<! (enemy-trun ctx player input-ch))
                                                            _ (when err (throw err))
                                                            [ctx end? err] (if (:done ctx)
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