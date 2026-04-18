(ns app3.core3
  (:require
   [clojure.edn :as edn]
   [clojure.core.match :refer [match]]
   [clara.rules :refer :all]
   [clojure.string :as str])
  (:import
   (clojure.lang ExceptionInfo)))

(defrecord ActiveEffect [id owner-id])
(defrecord ImmediateEffect [id owner-id])
(defrecord StackLength [length])
(defrecord Command [player-id option])
(defrecord ActivePlayer [player-id])
(defrecord Player [id])

(defrule handle-active-effect
  [Player (= id ?player-id)]
  [?eff <- ActiveEffect]
  =>
  (if (= ?player-id (:player-id ?eff))
    (insert! (->Command ?player-id :handle-effect))
    (insert! (->Command ?player-id :wait-handle-effect))))

(defn query-handle-active-effect-command [ctx player-id]
  (let [eff (game-get-active-effect ctx)]
    (when eff
      (if (-> (effect-get-owner-id eff) (= (game-get-active-player-id ctx)))
        (create-handle-active-command "")
        (create-wait-command "")))))

(defn query-abc-command [ctx player-id])

(defn query-flow [ctx player-id]
  (let [early-return (fn [f]
                       (fn [cmds]
                         (if cmds cmds (f ctx player-id))))
        cmds (-> nil
                 ((early-return query-handle-active-effect-command))
                 ((early-return query-abc-command)))]
    cmds))

(defrule active-player-immediate-command
  "主動玩家立即效果指令"
  [Player (= id ?player-id)]
  [ActivePlayer (= player-id ?player-id)]
  [?my-effects <- (acc/all) :from [ImmediateEffect (= owner-id ?player-id)]]
  [?oppo-effects <- (acc/all) :from [ImmediateEffect (not= owner-id ?player-id)]]
  =>
  ; 若存在我的效果
  (if (-> ?my-effects count pos?)
    ; 選一個效果
    (insert! (->Command ?player-id {:type :select-immediate-effect ?my-effects}))
    ; 若存在對手的效果
    (if (-> ?oppo-effects count pos?)
      ; 等待對手處理
      (insert! (->Command ?player-id :wait-active-player))
      ; 下一個階段
      (insert! (->Command :next-phase)))))


(defrule oppo-player-immediate-command
  "防禦玩家立即指令"
  [Player (= id ?player-id)]
  [ActivePlayer (not= player-id ?player-id)]
  [?my-effects <- (acc/all) :from [ImmediateEffect (= owner-id ?player-id)]]
  [?oppo-effects <- (acc/all) :from [ImmediateEffect (not= owner-id ?player-id)]]
  =>
  ; 若對方存在效果
  (if (-> ?oppo-effects count pos?)
    ; 等待對手處理
    (insert! (->Command ?player-id :wait-active-player))
    ; 若我方存在效果
    (if (-> ?my-effects count pos?)
      ; 選擇效果
      (insert! (->Command ?player-id {:type :select-immediate-effect ?active-player-effects}))
      ; 等待主動玩家
      (insert! (->Command ?player-id :wait-active-player)))))


#_(defrule active-player-immediate-command
    "主動玩家立即效果指令"
    [Player (= id ?player-id)]
    [ActivePlayer (= player-id ?player-id)]
    [?my-effects <- (acc/all) :from [ImmediateEffect (= owner-id ?player-id)]]
    [?oppo-effects <- (acc/all) :from [ImmediateEffect (not= owner-id ?player-id)]]
    =>
  ; 若存在我的效果
    (if (-> ?my-effects count pos?)
    ; 選一個效果
      (insert! (->Command ?player-id {:type :select-immediate-effect ?my-effects}))
    ; 若存在對手的效果
      (if (-> ?oppo-effects count pos?)
      ; 等待對手處理
        (insert! (->Command ?player-id :wait-active-player))
      ; 下一個階段
        (insert! (->Command :next-phase)))))