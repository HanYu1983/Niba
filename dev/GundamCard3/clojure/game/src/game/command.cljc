(ns game.command
  (:require
   [clojure.edn :as edn]
   [clojure.core.match :refer [match]]
   [clojure.string :as str]
   [game.basic :refer :all])
  (:import
   (clojure.lang ExceptionInfo)))

(defmulti game-get-active-effect :env)
(defmulti game-get-active-player-id :env)
(defmulti game-get-immediate-effects :env)
(defmulti game-get-stack-effects :env)
(defmulti game-get-player-pass-cut (fn [game player-id] (:env game)))
(defmulti game-get-player-can-play-texts (fn [game player-id] (:env game)))

(defn command-create [id player-id options]
  {:id id, :player-id player-id, :options options})

(defn query-handle-active-effect-commands [ctx player-id]
  (let [eff (game-get-active-effect ctx)
        effect-owner-id (effect-get-owner-id eff)]
    (when eff
      (if (= effect-owner-id player-id)
        [(command-create :handle-active-effect effect-owner-id {})]
        [(command-create :wait-handle-active-effect (player-get-opponent-id effect-owner-id) {})]))))

(defn query-immediate-effects-commands [ctx player-id]
  (let [[my-effs oppo-effs] ((juxt player-id (player-get-opponent-id player-id))
                             (group-by effect-get-owner-id (game-get-immediate-effects ctx)))
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


(defn query-cut-in-commands
  "處理讓過與切入, 執行切入時會自動讓過並將對方的讓過重設, 對方就有機會再切入, 對方切入時也相同, 雙方都主動讓過時結算"
  [ctx player-id]
  (let [effs (game-get-stack-effects ctx)
        me-pass-cut (game-get-player-pass-cut ctx player-id)
        oppo-pass-cut (game-get-player-pass-cut ctx (player-get-opponent-id player-id))
        is-active-player (-> (game-get-active-player-id ctx) (= player-id))
        my-can-play-texts (game-get-player-can-play-texts ctx player-id)
        oppo-can-play-texts (game-get-player-can-play-texts ctx (player-get-opponent-id player-id))]
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
        [(command-create :wait-player-pass-cut player-id {})]))))

(defn query-rule-effect-commands [ctx player-id])

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
                 ; 堆疊效果存在並且雙方皆讓過, 處理堆疊效果
                 ; 若玩家可以PLAY效果, 處理切入與讓過
                 ((early-return query-cut-in-commands)))
        _ (-> (not cmds) (when (throw (ex-info "must has commands" {}))))]
    cmds))

(defn apply-commands [ctx player-id command]
  ctx)

(defn test-query-command [ctx]
  (let [player-a-cmds (query-command ctx player-a)
        player-b-cmds (query-command ctx player-b)
        _ (println player-a-cmds)
        _ (println player-b-cmds)]
    ctx))