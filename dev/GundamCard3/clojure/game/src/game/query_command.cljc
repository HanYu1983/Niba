(ns game.query-command
  (:require
   [clojure.edn :as edn]
   [clojure.core.match :refer [match]]
   [clojure.string :as str]
   [clojure.spec.alpha :as s]
   [game.component :refer :all])
  (:import
   (clojure.lang ExceptionInfo)))

(defmulti game-get-active-effect :env)
(defmulti game-get-active-player-id :env)
(defmulti game-get-immediate-effects :env)
(defmulti game-get-stack-effects :env)
(defmulti game-get-player-pass-cut (fn [game player-id] (:env game)))
(defmulti game-get-player-can-play-texts (fn [game player-id] (:env game)))

(s/def ::command (s/keys :req-un [::id ::player-id]
                         :opt-un [::description ::payload]))

(defn command-create [id player-id options]
  {:id id, :player-id player-id, :payload options})

(defn query-handle-active-effect-commands [ctx player-id]
  (let [eff (game-get-active-effect ctx)]
    (when eff
      (let [effect-owner-id (game-get-effect-owner-id ctx eff)]
        (if (= effect-owner-id player-id)
          [(command-create :handle-active-effect effect-owner-id {})]
          [(command-create :wait-handle-active-effect (player-get-opponent-id effect-owner-id) {})])))))

(defn query-immediate-effects-commands [ctx player-id]
  (let [[my-effs oppo-effs] ((juxt player-id (player-get-opponent-id player-id))
                             (group-by (partial game-get-effect-owner-id ctx) (game-get-immediate-effects ctx)))
        is-active-player (-> (game-get-active-player-id ctx) (= player-id))]
    (if is-active-player
      (if my-effs
        [(command-create :set-active-effect player-id {:options my-effs})]
        (when oppo-effs
          [(command-create :wait-opponent-select-effect player-id {})]))
      (if oppo-effs
        [(command-create :wait-opponent-select-effect player-id {})]
        (when my-effs
          [(command-create :set-active-effect player-id {:options my-effs})])))))

(defmulti game-get-phase :env)


(defmulti game-has-destroy-effects (fn [game] (:env game)))

(defn query-destroy-effect-commands
  "自由時間開始時先判斷破壞效果"
  [game player-id]
  (let [current-phase (-> game game-get-phase)
        is-active-player (-> (game-get-active-player-id game) (= player-id))]
    (match current-phase
      ; 自由時間
      (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
      (when (game-has-destroy-effects game)
        (if is-active-player
          [(command-create :convert-destroy-effects-to-new-cut player-id "")]
          [(command-create :wait player-id "等待系統處理階段")])))))

(defn query-cut-in-commands
  "處理讓過與切入, 執行切入時會自動讓過並將對方的讓過重設, 對方就有機會再切入, 對方切入時也相同, 雙方都主動讓過時結算"
  [game player-id]
  (let [current-phase (-> game game-get-phase)
        effs (game-get-stack-effects game)
        me-pass-cut (game-get-player-pass-cut game player-id)
        oppo-pass-cut (game-get-player-pass-cut game (player-get-opponent-id player-id))
        is-active-player (-> (game-get-active-player-id game) (= player-id))
        my-can-play-texts (game-get-player-can-play-texts game player-id)
        oppo-can-play-texts (game-get-player-can-play-texts game (player-get-opponent-id player-id))]
    (match current-phase
          ; 自由時間
      (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
      (cond
            ; 若雙方都讓過並堆疊內有效果
        (and me-pass-cut oppo-pass-cut (-> effs count pos?))
        (if is-active-player
              ; 進攻玩家設定效果
          [(command-create :set-active-effect player-id {:options (first effs)})]
              ; 防守防家等待
          [(command-create :wait player-id "wait abc")])

            ; 若我讓過並對手有招
        (and me-pass-cut (-> oppo-can-play-texts count pos?))
            ; 對待對手切入或讓過
        [(command-create :wait-player player-id {})]

            ; 若對手讓過並且我有招
        (and oppo-pass-cut (-> my-can-play-texts count pos?))
            ; 選招切入
        [(command-create :set-cut-in player-id {:options my-can-play-texts})
             ; 或讓過
         (command-create :set-pass-cut player-id {})]

            ; 若我有招
        (-> my-can-play-texts count pos?)
        (if is-active-player
              ; 選招切入
          [(command-create :set-cut-in player-id {:options my-can-play-texts})
               ; 或讓過
           (command-create :set-pass-cut player-id {})]
              ; 對手只能等主動玩家先發招
          [(command-create :wait-player player-id {})])

      ; 若我無招, 只能讓過
        :else
        (if is-active-player
          [(command-create :set-pass-cut player-id {})]
        ; 對手等我讓過
          [(command-create :wait-player-pass-cut player-id {})])))))



(defmulti game-has-handle-phase (fn [game phase] (:env game)))

(defn query-rule-effect-commands [game player-id]
  (let [current-phase (-> game game-get-phase)
        is-active-player (-> (game-get-active-player-id game) (= player-id))]
    (match current-phase
      (:or [_ :start] [_ _ :start] [_ :end] [_ _ :end] [_ :end _] [_ :rule] [_ _ :rule])
      (if (game-has-handle-phase game current-phase)
        [(command-create :next-phase player-id {:current-phase current-phase})]
        (if is-active-player
          [(command-create :handle-phase player-id {:current-phase current-phase})]
          [(command-create :wait player-id (str "等待系統處理階段" current-phase))])))))

(defn query-destory-effects-commands [ctx player-id])

(defn query-command [ctx player-id]
  (let [early-return (fn [f]
                       (fn [cmds]
                         (if cmds cmds (f ctx player-id))))
        cmds (-> nil
                 ; 處理正在執行的效果
                 ((early-return query-handle-active-effect-commands))
                 ; 處理破壞效果
                 ((early-return query-destory-effects-commands))
                 ; 處理立即效果
                 ((early-return query-immediate-effects-commands))
                 ; 依各回合的規定效果
                 ((early-return query-rule-effect-commands))
                 ; 若是自由時間
                 ; 先處理機體破壞效果
                 ((early-return query-destroy-effect-commands))
                 ; 堆疊效果存在並且雙方皆讓過, 處理堆疊效果
                 ; 若玩家可以PLAY效果, 處理切入與讓過
                 ((early-return query-cut-in-commands)))
        _ (-> (not cmds) (when (throw (ex-info "must has commands" {}))))]
    cmds))

; ================== test =======================
(defmethod game-get-active-effect :game.command [game]
  (effect-create {:id "eff-id"
                  :reason {:env :game.command, :player-id player-a}
                  :text :text})
  nil)
(defmethod game-get-active-player-id :game.command [game] player-a)
(defmethod game-get-immediate-effects :game.command [game] [])
(defmethod game-get-stack-effects :game.command [game] [])
(defmethod game-get-player-pass-cut :game.command [game player-id] false)
(defmethod game-get-player-can-play-texts :game.command [game player-id] [])

(defmethod game-get-effect-owner-id :game.command [eff]
  (-> eff :reason :player-id))

(defmethod game-get-phase :game.command [game]
  [:battle :attack :start])

(defmethod game-has-handle-phase :game.command [game phase]
  true)

(defn test-query-command []
  (let [game {:env :game.command}
        player-a-cmds (query-command game player-a)
        player-b-cmds (query-command game player-b)
        _ (println player-a-cmds)
        _ (println player-b-cmds)]
    game))