(ns game.entity.flow
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.define.card-text :as card-text]
            [game.define.selection]
            [game.define.player :as player]
            [game.define.runtime :as runtime]
            [game.define.timing :as timing]
            [game.component.effect :as effect]
            [game.component.table :as table]
            [game.component.phase :as phase]
            [game.component.current-player :as current-player]
            [game.entity.model :as model]))


(s/def ::pass-cut (s/map-of any? any?))
(s/def ::current-pay-text :game.define.card-text/spec)
(s/def ::current-selection (s/map-of any? :game.define.selection/spec))
(s/def ::flags (s/coll-of #{:has-handle-draw-rule :has-handle-reroll-rule} :kind set?))
(s/def ::flow (s/keys :req-un [::has-cuts]
                      :opt-un [::current-pay-text ::current-selection ::flags]))
(s/def ::spec (s/merge :game.entity.model/spec
                       (s/keys :req-un [::flow])))

(def default-flow {:has-cuts {}})

(defn has-destroy-effects [ctx player-id])
(defn has-immediate-effects [ctx player-id])
(defn has-handle-draw-rule [ctx]
  (-> ctx :flow :flags :has-handle-draw-rule))
(defn has-handle-reroll-rule [ctx]
  (-> ctx :flow :flags :has-handle-reroll-rule))
(defn get-cut-effects [ctx]
  (-> ctx effect/get-top-cut))
(defn has-cut-effects [ctx]
  (-> ctx get-cut-effects count pos?))
(defn is-pass-cut [ctx player-id])
(defn is-all-pass-cut [ctx])
(defn query-immediate-effects [ctx player-id])
(defn query-cut-effects [ctx player-id])
(defn convert-destroy-effects-to-new-cut [ctx])

(defn get-current-pay-text [ctx]
  (-> ctx :flow :current-pay-text))

(defn has-current-pay-text [ctx]
  (get-current-pay-text ctx))

(defn query-command [ctx player-id]
  (cond
    ; 如果正在支付
    (has-current-pay-text ctx)
    (let [text (get-current-pay-text ctx)
          conditions (card-text/get-conditions text)
          logic (card-text/get-logic text)
          my-conditions (->> conditions (filter (partial card-text/filter-player-condition player-id)))
          current-selection (-> ctx :flow :current-selection)]
          ; 如果可以成功支付
      (if (card-text/can-pass-conditions text current-selection)
            ; 如果是主動玩家
        (if (current-player/is-current-player ctx player-id)
              ; 執行支付(支付完後將效果從堆疊移除)
          [{:type :pay-conditions}]
          [{:type :wait :reason "等待對方支付"}])
            ; 不行成功支付的場合
            ; 選擇支付
        [{:type :set-selection
          :logic logic
              ; 所有條件
          :conditions my-conditions
              ; 已經選擇的支付內容
          :current-selection current-selection}]))
        ; 如果有立即效果
    (has-immediate-effects ctx player-id)
    (let [effects (query-immediate-effects ctx player-id)
          ; TODO 讓玩家選擇一個立即效果
          top-effect (first effects)
          is-my-effect (->> top-effect (table/get-effect-runtime ctx) runtime/get-player-id (= player-id))
              ; 如果效果的擁有者是你
          cmds (if is-my-effect
                     ; 設定將要支付的效果
                 [{:type :set-current-pay-text
                   :effect top-effect}
                  {:type :cancel-current-play-text
                   :effect top-effect}]
                 [{:type :wait :reason "對待對手處理立即效果"}])]
      cmds)
        ; 如果有堆疊效果
    (has-cut-effects ctx)
    (let [top-effect (-> ctx get-cut-effects first)
          is-my-effect (->> top-effect (table/get-effect-runtime ctx) runtime/get-player-id (= player-id))
          ; 如果都讓過
          cmds (if (is-all-pass-cut ctx)
                 ; 如果是效果擁有者
                 (if is-my-effect
                   ; 執行系統指令
                   [{:type :set-current-pay-text :effects top-effect}]
                   [{:type :wait :reason "等待效果擁有者處理"}])
                 ; 只有其中一個讓過
                 (let [; 效果擁有者沒有優先權
                       is-my-cut-chance (if is-my-effect false true)
                       ; 如果我有優先權
                       is-my-cut-chance (if is-my-cut-chance
                                          ; 並且我沒有讓過
                                          (not (is-pass-cut ctx player-id))
                                          ; 我沒有優先權但對手讓過
                                          (is-pass-cut ctx (player/get-opponent player-id)))]
                   (if is-my-cut-chance
                     [; 切入
                      {:type :cut-in :card-ids []}
                      ; 讓過
                      {:type :pass}]
                     [{:type :wait :reason "等待敵軍切入"}])))]
      cmds)
    ; 自由時間
    (-> ctx phase/get-phase timing/can-play-card-or-text)
    ; 如果有破壞中的機體
    (if (has-destroy-effects ctx player-id)
    ; 將破壞產生的廢棄效果推到新的切入
      [{:type :convert-destroy-effects-to-new-cut}]
      ; 指令
      [])

    :else
    (match (-> ctx phase/get-phase)
      (:or [:reroll :start])
      []

      [:reroll :rule]
      (if (has-handle-reroll-rule ctx)
        [{:type :next-phase}]
        (if (current-player/is-current-player ctx player-id)
          [{:type :handle-reroll-rule}]
          [{:type :wait :reason ""}]))

      [:draw :rule]
      (if (has-handle-draw-rule ctx)
        [{:type :next-phase}]
        (if (current-player/is-current-player ctx player-id)
          [{:type :handle-draw-rule}]
          [{:type :wait :reason ""}]))

      [:battle :attack :rule]
      []

      [:battle :defense :rule]
      []

      [:battle :damage-checking :rule]
      []

      [:battle :return :rule]
      []

      [:battle :end :damage-reset]
      []

      [:battle :end :resolve-effect]
      []

      [:battle :end :adjust-hand]
      []

      [:battle :end :turn-end]
      [])))

(defn exec-command [ctx player-id cmd]
  (match cmd
    [:convert-destroy-effects-to-new-cut]
    (convert-destroy-effects-to-new-cut ctx)

    [:set-selection condition-id selection]))

(defn tests []
  (let [player-id :A
        ctx (s/assert ::spec (merge model/model {:flow {:current-pay-text ["" card-text/card-text-value]
                                                        :has-cuts {}
                                                        :current-selection {"" [:card 0 1 2]}}}))
        cmds (query-command ctx player-id)
        ;_ (println cmds)
        ])

  (let [player-id :A
        ctx (s/assert ::spec (-> model/model
                                 (effect/cut-in ["effect-1" {:reason [:system :A] :text ["text-1" card-text/card-text-value]}])
                                 (merge {:flow default-flow})))
        ;_ (println ctx)
        cmds (query-command ctx player-id)
        _ (println cmds)
        ])
  
  (let [player-id :A
        ctx (s/assert ::spec (-> model/model (merge {:flow default-flow
                                                     :phase [:reroll :rule]})))
        cmds (query-command ctx player-id)
        _ (println cmds)]))