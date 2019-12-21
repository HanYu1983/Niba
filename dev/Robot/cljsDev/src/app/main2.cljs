(ns app.main
  (:require [clojure.core.async :as a])
  (:require [app.map :as map])
  (:require-macros [app.macros :as m]))

(println (map/findPath 0 5 (fn [i] [(inc i)]) (constantly 1) (constantly 1)))
(println (map/findPath
          [0 0]
          [100 100]
          (fn [[x y]]
            [[x (inc y)] [x (max 0 (dec y))] [(inc x) y] [(max 0 (dec x)) y]])
          (constantly 1)
          (fn [curr end]
            (->> (map - curr end)
                 (repeat 2)
                 (apply map *)
                 (apply +)))))


(def keymap {:up "KeyW"
             :down "KeyS"
             :left "KeyA"
             :right "KeyD"
             :ok "Space"})

(def defaultModel {:page :title
                   :pageState {:title nil
                               :gameplay {:map nil
                                          :cursor [0 0]
                                          :players {:player {}
                                                    :ai1 {:friendly false}
                                                    :ai2 {:friendly true}}
                                          :units [{:key (gensym)
                                                   :player :player
                                                   :robot {}
                                                   :position [0 0]}
                                                  {:key (gensym)
                                                   :player :a1
                                                   :robot {}
                                                   :position [5 5]}]
                                          :focusUnitKey nil}}})

(defmulti updatePage (fn [ctx] (:page ctx)))
(defmethod updatePage :default [ctx inputCh outputCh]
  (let [worker (a/chan)]
    (a/go
      (a/>! outputCh [:on-change-page (:page ctx)]))
    (a/go
      (a/<! (a/timeout 1000))
      (a/>! worker ctx)
      (a/close! worker))
    worker))

(defmethod updatePage :title [ctx inputCh outputCh]
  (a/go
    (a/>! outputCh [:on-change-page (:page ctx)]))
  (let [worker (a/chan)]
    (a/go-loop [pageCtx (get-in ctx [:pageState (:page ctx)])]
      (let [[cmd args] (a/<! inputCh)]
        (condp = [cmd args]
          [:click :gameplay]
          (let [ctx (-> ctx
                        (update-in [:pageState (:page ctx)] (constantly pageCtx))
                        (merge {:page :gameplay}))]
            (a/>! worker ctx)
            (a/close! worker))

          (recur pageCtx))))
    worker))

(m/defstate moveAttackMenu [:on-show-popup :moveAttackMenu]
  (condp = cmd
    :click
    (let [menu args]
      (a/>! worker args)
      (a/close! worker))

    (recur ctx)))

(m/defstate attackMenu [:on-show-popup :attackMenu]
  (recur ctx))

(m/defstate systemMenu [:on-show-popup :systemMenu]
  (recur ctx))

(defn playerTurn [ctx inputCh outputCh]
  (a/go
    (a/>! outputCh [:on-change-turn :player]))
  (let [worker (a/chan)]
    (a/go-loop [ctx ctx]
      (let [[cmd args :as evt] (a/<! inputCh)]
        (condp = evt
          [:keydown (:up keymap)]
          (recur (update ctx :cursor (fn [[x y]]
                                       [x (max 0 (dec y))])))
          [:keydown (:down keymap)]
          (recur (update ctx :cursor (fn [[x y]]
                                       [x (min 10 (inc y))])))
          [:keydown (:left keymap)]
          (recur (update ctx :cursor (fn [[x y]]
                                       [(max 0 (dec x)) y])))
          [:keydown (:right keymap)]
          (recur (update ctx :cursor (fn [[x y]]
                                       [(min 10 (inc x)) y])))

          [:keydown (:ok keymap)]
          (do
            (a/>! worker ctx)
            (a/close! worker))

          (condp = cmd
            :click-pos
            (let [pos args
                  units (:units ctx)
                  unitsAtPos (-> (filter #(= pos (:position %)) units)
                                 first)]
              (if unitsAtPos
                (let [action (a/<! (moveAttackMenu nil inputCh outputCh))]
                  (condp = action
                    :attack
                    (let [xx (a/<! (attackMenu nil inputCh outputCh))]
                      (println action))
                    (recur ctx)))
                (let [action (a/<! (systemMenu nil inputCh outputCh))]
                  (recur ctx))))

            (recur ctx)))))
    worker))

(defn enemyTurn [enemy ctx inputCh outputCh]
  (a/go
    (a/>! outputCh [:on-change-turn enemy]))
  (let [worker (a/chan)]
    (a/go
      (a/>! worker ctx)
      (a/close! worker))
    worker))

(defmethod updatePage :gameplay [ctx inputCh outputCh]
  (a/go
    (a/>! outputCh [:on-change-page (:page ctx)]))
  (let [worker (a/chan)]
    (a/go-loop [pageCtx (get-in ctx [:pageState (:page ctx)])]
      (let [pageCtx (a/<! (playerTurn pageCtx inputCh outputCh))
            enemies (->> (:players pageCtx)
                         keys
                         (filter #(not= :player %)))
            enemyWorkers (let [enemyWorker (a/chan)]
                           (a/go-loop [pageCtx pageCtx
                                       enemies enemies]
                             (if (= (count enemies) 0)
                               (do
                                 (a/>! enemyWorker pageCtx)
                                 (a/close! enemyWorker))
                               (let [enemy (first enemies)
                                     pageCtx (a/<! (enemyTurn enemy pageCtx inputCh outputCh))]
                                 (recur pageCtx (rest enemies)))))
                           enemyWorker)
            pageCtx (a/<! enemyWorkers)]
        (recur pageCtx)))
    worker))

(defn modelLoop [inputCh outputCh]
  (a/go-loop [ctx defaultModel]
    (println ctx)
    (let [ctx (a/<! (updatePage ctx inputCh outputCh))]
      (recur ctx))))


(defn viewLoop [inputCh outputCh]
  (.subscribe (.-viewNotifyOb js/window)
              (fn [e]
                (a/go
                  (a/>! outputCh (js->clj e)))))
  (a/go-loop []
    (let [evt (a/<! inputCh)]
      (.next (.-viewOb js/window) (clj->js evt))
      (recur))))

(defn controller []
  (let [modelCh (a/chan)
        modelNotifyCh (a/chan)
        viewCh (a/chan)
        viewNotifyCh (a/chan)
        inputCh (a/chan)]
    (js/window.addEventListener "keydown" (fn [e]
                                            (a/go
                                              (a/>! inputCh [:keydown (.-code e)]))))
    (js/window.addEventListener "keyup" (fn [e]
                                          (a/go
                                            (a/>! inputCh [:keyup (.-code e)]))))
    (modelLoop modelCh modelNotifyCh)
    (viewLoop viewCh viewNotifyCh)
    (a/go
      (a/>! viewCh [:hello {:name "han"}]))

    (a/go-loop []
      (let [[cmd args] (a/<! viewNotifyCh)]
        (println "view" cmd args)
        (condp = cmd
          :on-select
          (recur)
          
          (recur))))

    (a/go-loop []
      (let [[cmd args :as evt] (a/<! modelNotifyCh)]
        (println cmd args)
        (condp = evt
          [:on-show-popup :moveAttackMenu]
          (let []
            (a/>! modelCh [:click :attack])
            (recur))
          
          (condp = cmd
            :on-change-turn
            (let [turn args]
              (condp = turn
                :player
                (a/>! modelCh [:click-pos [0 0]])

                nil)
              (recur))

            :on-change-page
            (let [page args]
              (condp = page
                :title
                (a/>! modelCh [:click :gameplay])

                nil)
              (recur))

            :on-show-popup
            (recur)

            :model-sync
            (let [model args]
              (comment "draw model")
              (recur))

            (recur)))))))

(println "ver 1.0")
(defn main []
  (let [viewOb (js/rxjs.Subject.)
        viewNotifyOb (js/rxjs.Subject.)]
    (.subscribe viewOb
                (fn [e]
                  (js/console.log "hello " e)))
    (set! (.-viewOb js/window)
          viewOb)
    (set! (.-viewNotifyOb js/window)
          viewNotifyOb))
  (controller))

(set! (.-startApp js/window) main)