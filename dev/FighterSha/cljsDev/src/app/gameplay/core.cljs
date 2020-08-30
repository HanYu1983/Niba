
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

(defn render-card-move [gameplayCtx from to cards]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (s/assert ::app.gameplay.spec/card-stack-id from)
  (s/assert ::app.gameplay.spec/card-stack-id to)
  (s/assert ::app.gameplay.spec/card-stack cards)
  (let [wait (a/chan)]
    (a/go
      (js/View.RenderCardMove (clj->js gameplayCtx)
                              (clj->js from)
                              (clj->js to)
                              (clj->js cards)
                              (fn []
                                (a/go
                                  (a/close! wait)))))
    wait))


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
                                      (let [player-hand-id (app.gameplay.spec/card-stack-id-hand player)
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

(defn ask-player [gameplayCtx player players]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (s/assert ::app.gameplay.spec/player player)
  (s/assert (s/* ::app.gameplay.spec/player) players)
  (let [wait (a/han)]
    (a/go
      (a/>! wait (s/assert (s/nilable ::app.gameplay.spec/player) player))
      (a/close! wait))
    wait))

(defn ask-one-card [gameplayCtx player card-stack-id valid-fn]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (s/assert ::app.gameplay.spec/player player)
  (s/assert ::app.gameplay.spec/card-stack-id card-stack-id)
  (s/assert fn? valid-fn)
  (let [wait (a/han)]
    (a/go
      (a/>! wait (s/assert (s/nilable ::app.gameplay.spec/card) nil))
      (a/close! wait))
    wait))

(defn next-player [gameplayCtx player]
  (s/assert ::app.gameplay.spec/gameplay gameplayCtx)
  (s/assert ::app.gameplay.spec/player player)
  (a/go
    (s/assert
     ::app.gameplay.spec/player
     player)))

(m/defasync
  move-card (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   from ::app.gameplay.spec/card-stack-id
   to ::app.gameplay.spec/card-stack-id
   next-fn fn?
   cards ::app.gameplay.spec/card-stack]
  [gameplayCtx err]
  (let [_ (when (not (every? (->> gameplayCtx :card-stacks from (into #{})) cards))
            (throw (js/Error. (str cards " not found in " from))))
        gameplayCtx (update-in gameplayCtx [:card-stacks from]
                               (fn [origin]
                                 (remove (into #{} cards) origin)))
        gameplayCtx (update-in gameplayCtx [:card-stacks to]
                               (fn [origin]
                                 (concat origin (map next-fn cards))))
        _ (a/<! (render-card-move gameplayCtx from to cards))]
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
        player-hand-id (app.gameplay.spec/card-stack-id-hand player)
        [gameplayCtx err] (a/<! (move-card gameplayCtx :home player-hand-id #(assoc % :player-id (:player-id player)) cards))
        _ (when err (throw err))]
    [gameplayCtx err]))

(m/defasync
  attack (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay
   player ::app.gameplay.spec/player
   card ::app.gameplay.spec/card]
  [gameplayCtx err]
  [(let [; 丟到卡池
         player-hand-id (app.gameplay.spec/card-stack-id-hand player)
         [gameplayCtx err] (a/<! (move-card gameplayCtx player-hand-id :gravyard #(assoc % :card-face :up) [card]))
         _ (when err (throw err))

         ; 指定一個玩家
         players (->> gameplayCtx :players vals (filter #(not= % player)))
         target-player (a/<! (ask-player gameplayCtx player players))
         
         ; 沒有指定玩家, 取消攻擊
         _ (when (nil? target-player)
             (throw (js/Error. "cancel attack")))
         target-player-hand-id (app.gameplay.spec/card-stack-id-hand target-player)
         
         ; 那個玩家出一張閃
         target-player-card (a/<! (ask-one-card gameplayCtx target-player target-player-hand-id (constantly true)))
         [gameplayCtx err] (s/assert
                            ::app.gameplay.spec/gameplay
                            (if (nil? target-player-card)
                              ; 殺中目標
                              (let [character-card-id (app.gameplay.spec/card-stack-id-character target-player)
                                    gameplayCtx (update-in gameplayCtx
                                                           [:card-stacks character-card-id 0 :card-state]
                                                           #(update (s/assert ::app.data.spec/character-card %) :life dec))]
                                [gameplayCtx nil])
                              ; 被閃過
                              (a/<! (move-card gameplayCtx target-player-hand-id :gravyard #(assoc % :card-face :up) [target-player-card]))))
         _ (when err (throw err))]
     gameplayCtx)
   nil])


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
                         (let [[_ card] cmd
                               player-hand-id (app.gameplay.spec/card-stack-id-hand player)
                               [gameplayCtx err] (a/<! (move-card gameplayCtx player-hand-id :gravyard #(assoc % :card-face :up) [card]))
                               _ (when err (throw err))

                               [card-conform] (s/conform ::app.data.spec/card-state (:card-state card))
                               [gameplayCtx err] (cond
                                                   (= :attack-card card-conform)
                                                   [gameplayCtx nil]

                                                   (= :steal-card card-conform)
                                                   [gameplayCtx nil]

                                                   (= :steal-money-card card-conform)
                                                   [gameplayCtx nil]

                                                   :else
                                                   (throw (js/Error. (str card-conform " not found"))))
                               _ (when err (throw err))]
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

(m/defasync
  start (s/tuple ::app.gameplay.spec/gameplay ::app.spec/error)
  [gameplayCtx ::app.gameplay.spec/gameplay]
  [gameplayCtx err]
  (loop [gameplayCtx gameplayCtx
         active-player (-> gameplayCtx :players :0)]
    (let [_ (a/<! (a/timeout 1000))
          _ (a/<! (render-player-trun-start gameplayCtx active-player))
          [gameplayCtx err] (a/<! (draw-card gameplayCtx active-player 2))
          _ (when err (throw err))
          [gameplayCtx err] (a/<! (menu gameplayCtx active-player))
          _ (when err (throw err))]
      (recur gameplayCtx (a/<! (next-player gameplayCtx active-player))))))


#_(println (macroexpand '(m/defasync
                           draw-card (s/tuple ::app.gameplay.spec/card-stack ::app.spec/error)
                           [gameplayCtx ::app.gameplay.spec/gameplay
                            player ::app.gameplay.spec/player
                            n number?]
                           [gameplayCtx err]
                           [gameplayCtx nil])))