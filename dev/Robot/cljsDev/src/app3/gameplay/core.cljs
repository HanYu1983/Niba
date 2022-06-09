(ns app3.gameplay.core
  (:require [clojure.spec.alpha :as s]
            ["async" :as async]
            [clojure.core.async :refer [go <! >!]]
            [app3.tool.const :refer [*test *test-ch]]))

(s/def ::card (s/keys :req-un []))
(s/def ::cost (s/or :pick-one-of (s/tuple #{"從{0}選{1}張丟到{2}"} (s/* ::card) int? string?)
                    :pick-xx (s/tuple #{"從{0}選{1}張横置"} (s/* ::card) int?)))


(s/def ::zone any?)
(s/def ::costs (s/* ::cost))
(s/def ::effect (s/or :set (s/tuple #{"出場到{0}"} ::zone)))
(s/def ::declare (s/keys :req-un [::costs ::effect]))

(s/def ::gameplay any?)


#_(async/reduce (array 1 2 3)
                0
                (fn [acc c cb]
                  (println acc c)
                  (cb nil (+ acc c)))
                (fn [err result]
                  (println err result)))

#_(async/waterfall (array (fn [cb]
                            (cb nil "1" "2"))
                          (fn [a b cb]
                            (println a b)
                            (cb nil "3"))
                          (fn [a cb]
                            (println a)
                            (cb nil "4")))
                   (fn [err result]
                     (println err result)))

#_(async/forever (fn [next]
                   (js/setTimeout (fn []
                                    (next nil 10))
                                  1000))
                 (fn [err]
                   (println err)))




(defn attack-unit [ctx unit cb]
  (println "attack-unit" ctx unit)
  (js/setTimeout (fn []
                   (cb nil ctx))
                 1000))

(defn timeout [time cb]
  (js/setTimeout cb time))

(defn player-turn [ctx cb]
  (let [atom-ctx (atom ctx)]
    ; waterfall == ->
    (async/doUntil (partial async/waterfall (array (fn [cb]
                                                     (cb nil @atom-ctx))
                                                   (fn [ctx cb]
                                                     (async/reduce (array :a :b :c)
                                                                   ctx
                                                                   attack-unit
                                                                   cb))
                                                   (fn [ctx cb]
                                                     (cb nil (inc ctx)))
                                                   (fn [ctx cb]
                                                     (reset! atom-ctx ctx)
                                                     (cb nil ctx))))
                   (fn [ctx cb]
                     (cb nil (zero? (mod ctx 3))))
                   (fn [err ctx]
                     (cb err ctx)))))

(defn basic-loop [iteratee test ctx cb]
  (let [atom-ctx (atom ctx)]
    (async/doUntil (fn [cb]
                     (iteratee @atom-ctx (fn [err ctx]
                                           (when (not err)
                                             (reset! atom-ctx ctx))
                                           (cb err ctx))))
                   test
                   cb)))


(defn listen-event [cb]
  (if *test
    (go
      (cb nil (<! *test-ch)))
    (cb nil [:on-click "esc"])))

(defn handle-cursor [ctx evt cb]
  (cb nil ctx))

(defn menu-phase [ctx menu cb]
  (cb nil ctx))

(defn turn [ctx player cb]
  (if (:done ctx)
    (cb nil ctx)
    (basic-loop (fn [ctx cb]
                  (async/waterfall (array (partial timeout 1000)
                                          listen-event
                                          (fn [evt cb]
                                            (async/waterfall (array (async/constant ctx)
                                                                    (fn [ctx cb]
                                                                      (handle-cursor ctx evt cb))
                                                                    (fn [ctx cb]
                                                                      (handle-cursor ctx evt cb))
                                                                    (fn [ctx cb]
                                                                      (println "turn")
                                                                      (cond
                                                                        (= [:on-click "space"] evt)
                                                                        (menu-phase ctx nil cb)

                                                                        (= [:on-click "esc"] evt)
                                                                        (cb nil (assoc ctx :done {:reason "cancel"}))

                                                                        :else
                                                                        (cb nil ctx))))
                                                             cb)))
                                   cb))
                (fn [ctx cb]
                  (cb nil (:done ctx)))
                ctx
                cb)))

(def gameplay-loop (partial basic-loop
                            (fn [ctx cb]
                              (async/waterfall (array (async/constant ctx)
                                                      (fn [ctx cb]
                                                        (async/reduce (array :player :ai :ai2)
                                                                      ctx
                                                                      turn
                                                                      cb)))
                                               cb))
                            (fn [ctx cb]
                              (cb nil (:done ctx)))))


#_(player-turn 0 println)

#_(async/waterfall (array (async/constant 0)
                          player-turn
                          player-turn)
                   println)


#_(let [queue (async/queue (fn [evt cb]
                             (println evt)
                             (async/series (array (partial timeout 1000))
                                           cb))
                           1)
        _ (.error queue (fn [err evt]
                          (println "err" err evt)))
        _ (.drain queue (fn []
                          (println "done")))
        _ (.push queue (array [:tick 0] [:tick 1]))
        _ (.push queue (array [:tick 3]))])


#_(async/autoInject (js-obj "get_data" (fn [cb]
                                         (cb nil ["data" "wow"]))
                            "make_folder" (fn [cb]
                                            (cb nil "folder"))
                            "write_file" (fn [get_data make_folder cb]
                                           (println get_data make_folder)
                                           (cb nil "filename")))
                    (fn [err result]
                      (js/console.log err result)))




(comment
  (s/def ::unit (s/keys :req-un [::position ::view-position]))
  (s/def ::unit-menu (s/keys :req-un [::unit ::options ::view-options ::cursor]))
  (s/def ::state (s/or :unit-menu (s/and (s/keys :req-un [::unit-menu])
                                         #(not (contains? % ::battle-menu)))
                       :battle-menu (s/keys :req-un [::unit-menu ::battle-menu])))

  (s/def ::action (s/or :on-key-down (s/tuple keyword? keyword?)))

  (defmulti on-event (fn [ctx evt]
                       (cond
                         (not (s/valid? ::state ctx))
                         (s/explan ::state ctx)

                         (not (s/valid? ::action evt))
                         (s/explan ::action evt)

                         :else
                         [(first (s/confirm ::state ctx))
                          (first (s/confirm ::action evt))])))

  (defmulti observe identity)

  (defmethod observe :unit-menu
    [ctx]
    ctx)

  (defn render [ctx] ctx)

  (defmethod on-event [:start-page :on-key-down]
    [ctx evt cb]
    (let [ctx (render (observe :start-page ctx))]
      (cb nil (merge ctx {:unit-menu {:unit 0 :options [] :cursor 0}}))))

  (defn on-tick [ctx cb]
    ; check custom state
    (cb nil ctx))

  (defn reset-ctx [atom-ctx cb]
    (fn [err ctx]
      (if err
        (cb err)
        (do (reset! atom-ctx ctx)
            (cb)))))

  (let [atom-ctx (atom nil)
        q (async/queue (fn [evt cb]
                         (cond
                           ; on-tick不要使用spec
                           (= evt :tick)
                           (on-tick @atom-ctx (reset-ctx atom-ctx cb))

                           ; 重覆的事件可以使用rx過濾掉，減少spec的次數(比如[:on-key-down "s"])
                           ; 按鍵的狀態存在state中，在tick中查詢
                           :else
                           (on-event @atom-ctx evt (reset-ctx atom-ctx cb)))))
        _ (set! js/model (clj->js {:on-next (fn [evt]
                                              (.push q evt))}))]))