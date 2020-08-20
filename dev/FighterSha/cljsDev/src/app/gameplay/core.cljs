
(ns app.gameplay.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a])
  (:require [app.spec]
            [app.data.spec]
            [app.gameplay.spec])
  (:require-macros [app.gameplay.macros :as m]))


(defn render [gameplayCtx]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (js/View.Render (clj->js gameplayCtx)))

(defn render-player-trun-start [gameplayCtx player]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (s/assert ::app.gameplay.spec/player player)
  (let [wait (a/chan)]
    (a/go
      (js/View.RenderPlayerTurnStart (clj->js gameplayCtx)
                                     (clj->js player)
                                     (fn []
                                       (a/go
                                         (a/close! wait)))))
    wait))

(m/defasync
  attack (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player
   card ::app.gameplay.spec/card]
  [gameplayCtx err]
  [(let [player-hand-id (keyword (str (clj->js (:player-id player)) "-hand"))
         player-hand (s/assert
                      ::app.gameplay.spec/card-stack
                      (-> gameplayCtx :card-stacks player-hand-id))
         gravyard (s/assert
                   ::app.gameplay.spec/card-stack
                   (-> gameplayCtx :card-stacks :gravyard))
         _ (when (not (some #{card} player-hand))
             (throw (js/Error. (str card " not found in " player-hand))))
         player-hand (remove #{card} player-hand)
         card (assoc card :card-face :up)
         gravyard (cons card gravyard)
         gameplayCtx (update gameplayCtx :card-stacks (fn [cs]
                                                        (assoc cs
                                                               player-hand-id player-hand
                                                               :gravyard gravyard)))]
     gameplayCtx)
   nil])





(s/def ::gameplay-cmd-end-turn #{:gameplay-cmd-end-turn})
(s/def ::gameplay-cmd-use-card (s/tuple #{:gameplay-cmd-use-card}
                                        (s/nilable ::app.gameplay.spec/card)))
(s/def ::gameplay-cmd (s/or :gameplay-cmd-use-card ::gameplay-cmd-use-card
                            :gameplay-cmd-end-turn ::gameplay-cmd-end-turn))

(defn ask-command [gameplayCtx player]
  (let [wait (a/chan)]
    (a/go
      (js/View.AskCommand (clj->js player)
                          (js-obj "CmdUseCard"
                                  (fn [card-id]
                                    (a/go
                                      (let [player-hand-id (keyword (str (clj->js (:player-id player)) "-hand"))
                                            card (s/assert
                                                  (s/nilable ::app.gameplay.spec/card)
                                                  (->> gameplayCtx :card-stacks player-hand-id
                                                       (filter #(= (:card-id %) (keyword card-id)))
                                                       first))
                                            cmd (s/assert
                                                 (s/tuple ::gameplay-cmd ::app.spec/error)
                                                 (if (nil? card)
                                                   [[:gameplay-cmd-use-card nil] (js/Error. (str card-id " not found"))]
                                                   [[:gameplay-cmd-use-card card] nil]))
                                            _ (a/>! wait cmd)
                                            _ (a/close! wait)])))
                                  "CmdEndTurn"
                                  (fn []
                                    (a/go
                                      (a/>! wait (s/assert
                                                  (s/tuple ::gameplay-cmd ::app.spec/error)
                                                  [:gameplay-cmd-end-turn nil]))
                                      (a/close! wait))))))
    wait))


(m/defasync
  menu (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player]
  [gameplayCtx err]
  (loop [gameplayCtx gameplayCtx]
    (a/<! (a/timeout 1000))
    (let [[gameplayCtx end-turn? err]
          (s/assert
           (s/tuple ::app.gameplay.spec/gameplay boolean? ::app.spec/error)
           (try
             (let [_ (render gameplayCtx)
                   [cmd err] (a/<! (ask-command gameplayCtx player))
                   _ (when err (throw err))

                   [cmd-conform] (s/conform ::gameplay-cmd cmd)
                   _ (println "cmd " cmd-conform)

                   ret (condp = cmd-conform
                         ; 結束回合
                         :gameplay-cmd-end-turn
                         [gameplayCtx true nil]

                         ; 使用一張卡
                         :gameplay-cmd-use-card
                         (let [[_ card] cmd]
                           [gameplayCtx false nil])

                         (throw (js/Error. (str "cmd not define " cmd-conform))))]

               ret)
             (catch js/Error err
               (js/console.warn err)
               ; can not recur here
               [gameplayCtx false err])))
          _ (when err 
              (js/console.warn err))]
      (if end-turn?
        [gameplayCtx nil]
        (recur gameplayCtx)))))

(defn next-player [gameplayCtx player]
  (a/go
    (s/assert
     ::app.gameplay.spec/player
     player)))

(m/defasync
  move-card (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   from ::app.gameplay.spec/card-stack-id
   to ::app.gameplay.spec/card-stack-id
   cards ::app.gameplay.spec/card-stack]
  [gameplayCtx err]
  (let [gameplayCtx (update-in gameplayCtx [:card-stacks from]
                               (fn [origin]
                                 (remove (into #{} cards) origin)))
        gameplayCtx (update-in gameplayCtx [:card-stacks to]
                               (fn [origin]
                                 (concat origin cards)))]
    [gameplayCtx nil]))

(m/defasync
  draw-card (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player
   n number?]
  [gameplayCtx err]
  (let [cards (s/assert
               ::app.gameplay.spec/card-stack
               (->> gameplayCtx :card-stacks :home
                    (take n)))
        player-hand-id (keyword (str (clj->js (:player-id player)) "-hand"))
        [gameplayCtx err] (a/<! (move-card gameplayCtx :home player-hand-id cards))
        gameplayCtx (update-in gameplayCtx [:card-stacks player-hand-id]
                               (fn [origin]
                                 (replace (zipmap cards (map #(assoc % :player-id (:player-id player)) cards))
                                          origin)))]
    [gameplayCtx err]))

(m/defasync
  start (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay]
  [gameplayCtx err]
  (loop [gameplayCtx gameplayCtx
         active-player (-> gameplayCtx :players :0)]
    (a/<! (a/timeout 1000))
    (a/<! (render-player-trun-start gameplayCtx active-player))
    (let [[gameplayCtx err] (try
                              (let [[gameplayCtx err] (a/<! (draw-card gameplayCtx active-player 2))
                                    _ (when err (throw err))

                                    [gameplayCtx err] (a/<! (menu gameplayCtx active-player))
                                    _ (when err (throw err))]
                                [gameplayCtx nil])
                              (catch js/Error err
                                [gameplayCtx err]))
          _ (when err (throw err))]
      (recur gameplayCtx (a/<! (next-player gameplayCtx active-player))))))


#_(println (macroexpand '(m/defasync
                           draw-card (s/tuple ::app.gameplay.spec/card-stack ::app.spec/error)
                           [gameplayCtx ::app.gameplay.spec/gameplay
                            player ::app.gameplay.spec/player
                            n number?]
                           [gameplayCtx err]
                           [gameplayCtx nil])))