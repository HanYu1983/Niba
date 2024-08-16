(ns game.model-flow.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [clojure.set :refer [difference]]
            [tool.logic-tree :as logic-tree]
            [tool.component.flags-component :as flags-component]
            [game.define.card-text :as card-text]
            [game.define.selection]
            [game.define.player :as player]
            [game.define.runtime :as runtime]
            [game.define.timing :as timing]
            [game.define.effect :as effect]
            [game.define.card :as card]
            [game.model-spec.core]
            [game.model.core :refer [create-model]]
            [game.model.effect :refer [get-top-cut cut-in]]
            [game.model.card-table :refer [add-card]]
            [game.model.table :refer [get-effect-runtime get-effect-player-id get-cards-by-ba-syou]]
            [game.model.phase :refer [get-phase next-phase set-phase]]
            [game.model.current-player :refer [is-current-player get-attack-side]]
            [game.model.selection]
            [game.flow.current-pay-component :refer [set-current-pay-effect
                                                     get-current-pay-effect
                                                     clear-current-pay-effect
                                                     has-current-pay-effect
                                                     set-current-pay-logic-id
                                                     get-current-pay-logic-id
                                                     set-current-pay-selection
                                                     get-current-pay-selection
                                                     clear-current-pay-selection]]
            [game.flow.has-cuts-component :refer [get-has-cut set-has-cut clear-has-cut]]
            [game.flow.core :refer [create-flow]]))

(s/def ::spec (s/merge :game.model-spec.core/is-model
                       (s/keys :req-un [:game.flow.core/flow])))

(defn create-model-flow []
  (assoc (create-model) :flow (create-flow)))
(defn get-flow [ctx]
  (s/assert ::spec ctx)
  (-> ctx :flow))
(defn set-flow [ctx flow]
  (s/assert ::spec ctx)
  (assoc ctx :flow flow))

(defn has-destroy-effects [ctx player-id])
(defn has-immediate-effects [ctx player-id])
; draw rule
(defn handle-draw-rule [ctx]
  (s/assert ::spec ctx)
  (let [draw-rule-effect (s/assert :game.define.effect/value
                                   {:reason [:system (get-attack-side ctx)]
                                    :text {:type :system
                                           :description "draw a card"
                                           :conditions {"draw top1card" {:tips '(fn [ctx runtime]
                                                                                  [:top-n-card-from-home 1])
                                                                         :action '(fn [ctx runtime selection]
                                                                               ; move to hand
                                                                                    ctx)}}
                                           :logic {"top1card" ['(Leaf "draw top1card")
                                                               '(fn [ctx runtime]
                                                                  ctx)]}}})]
    (-> ctx get-flow (set-current-pay-effect draw-rule-effect) (#(set-flow ctx %)))))

; reroll rule
(defn has-handle-reroll-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (flags-component/has-flag :has-handle-reroll-rule)))
(defn handle-reroll-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (flags-component/set-flags #{:has-handle-reroll-rule}) (#(set-flow ctx %))))

; handle phase
(defn has-handle-phase [ctx phase]
  (s/assert ::spec ctx)
  (-> ctx get-flow (flags-component/has-flag phase)))
(defn handle-phase [ctx phase]
  (s/assert ::spec ctx)
  (when (has-handle-phase ctx phase)
    (throw (ex-info "already has handle phase" {})))
  (let [main-handle (fn [ctx]
                      (match phase
                        [:reroll :start] ctx
                        [:reroll :rule] (handle-reroll-rule ctx)
                        [:draw :start] ctx
                        [:draw :rule] (handle-draw-rule ctx)
                        :else ctx))]
    (-> ctx
        get-flow (flags-component/set-flags #{phase}) (#(set-flow ctx %))
        main-handle)))


(defn get-cut-effects [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-top-cut))
(defn has-cut-effects [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-cut-effects count pos?))

(defn is-pass-cut [ctx player-id]
  (s/assert ::spec ctx)
  (-> ctx get-flow (get-has-cut player-id)))
(defn is-all-pass-cut [ctx]
  (s/assert ::spec ctx)
  (every? #(is-pass-cut ctx %) player/player-ids))
(defn set-pass-cut [ctx player-id]
  (s/assert ::spec ctx)
  (-> ctx get-flow (set-has-cut player-id) (#(set-flow ctx %))))

(defn query-immediate-effects [ctx player-id])
(defn query-cut-effects [ctx player-id])
(defn convert-destroy-effects-to-new-cut [ctx])

(defn handle-next-phase [ctx]
  (s/assert ::spec ctx)
  (-> ctx
      get-flow
      ; 清除切入狀態
      clear-has-cut
      ; 清除處理階段的標記
      (flags-component/remove-flags #{(-> ctx get-phase)})
      (#(set-flow ctx %))
      ; 到下一個時段
      next-phase))

(defn query-command [ctx player-id]
  (s/assert ::spec ctx)
  (cond
    ; 如果正在支付
    (-> ctx get-flow has-current-pay-effect)
    (let [effect (-> ctx get-flow get-current-pay-effect)
          text (-> effect game.define.effect/get-text)
          current-pay-logic-id (-> ctx get-flow get-current-pay-logic-id)
          current-pay-selection (-> ctx get-flow get-current-pay-selection)]
      (if (-> current-pay-logic-id nil?)
        (if (-> ctx (get-effect-player-id effect) (= player-id))
                 ; 選擇使用哪一個邏輯
          (let [logic-ids (-> text card-text/get-logics-ids)]
            (if (-> logic-ids count pos?)
              [{:type :set-logic-id :logic-ids logic-ids :selected-logic-id (-> logic-ids first)}]
              [{:type :pay-conditions}]))
          [{:type :wait :reason "等待對方選擇使用哪一個邏輯"}])
        (if (card-text/can-pass-conditions text current-pay-logic-id current-pay-selection)
                    ; 如果是主動玩家
          (if (-> ctx (get-effect-player-id effect) (= player-id))
                      ; 執行支付(支付完後將效果從堆疊移除)
            [{:type :pay-conditions}]
            [{:type :wait :reason "等待對方支付"}])
          (let [use-logic (-> text card-text/get-logics (get current-pay-logic-id)
                              (or (throw (ex-info "所使用的邏輯不存在" {}))))
                need-conditions (-> text (card-text/get-logic-conditions use-logic))
                ; TODO: 過濾出我的條件
                my-conditions need-conditions]
                ; 雙方都可以支付條件
            (if (-> my-conditions count zero?)
              [{:type :wait :reason "等待雙方都將條件完成支付"}]
              [{:type :set-selection
                :logic-id (-> ctx get-flow get-current-pay-logic-id)
                :conditions my-conditions}]))))

          ; 如果可以成功支付
      #_(if (card-text/can-pass-conditions text current-pay-logic-id current-pay-selection)
            ; 如果是主動玩家
          (if (-> ctx (get-effect-player-id effect) (= player-id))
              ; 執行支付(支付完後將效果從堆疊移除)
            [{:type :pay-conditions}]
            [{:type :wait :reason "等待對方支付"}])
            ; 不行成功支付的場合
            ; 選擇支付
          (if (-> current-pay-logic-id nil?)
            (if (-> ctx (get-effect-player-id effect) (= player-id))
           ; 選擇使用哪一個邏輯
              (let [logic-ids (-> text card-text/get-logics-ids)]
                [{:type :set-logic-id :logic-ids logic-ids :selected-logic-id (-> logic-ids first)}])
              [{:type :wait :reason "等待對方選擇使用哪一個邏輯"}])
            (let [use-logic (-> text card-text/get-logics (get current-pay-logic-id))
                  need-conditions (-> text (card-text/get-logic-conditions use-logic))
                  my-conditions need-conditions
                ;; use-logic-one (-> ctx get-flow
                ;;                   get-current-pay-logic-id
                ;;                   (#(-> text card-text/get-logics (get %)))
                ;;                   (or (throw (ex-info "use-logic-one not found" {}))))
                ;; [logic action] use-logic-one
                ;; ; 邏輯需要的條件
                ;; all-condition-ids (-> logic logic-tree/enumerateAll flatten)
                ;; _ (println all-condition-ids)
                ;; ; 我的所有條件
                ;; my-conditions (->> all-condition-ids
                ;;                    (map (-> text card-text/get-conditions))
                ;;                    (zipmap all-condition-ids)
                ;;                    (filter (fn [[condition-id condition]]
                ;;                              ; TODO 算出tips回傳
                ;;                              (card-text/is-condition-belong-to-player-id condition player-id)))
                ;;                    (into {}))
                  ]
            ; 雙方都可以支付條件
              (if (-> my-conditions count zero?)
                [{:type :wait :reason "等待對方支付條件"}]
                [{:type :set-selection
                  :logic-id (-> ctx get-flow get-current-pay-logic-id)
                  :conditions my-conditions}])))))
        ; 如果有立即效果
    (has-immediate-effects ctx player-id)
    (let [effects (query-immediate-effects ctx player-id)
          ; TODO 讓玩家選擇一個立即效果
          top-effect (first effects)
          is-my-effect (->> top-effect (get-effect-runtime ctx) runtime/get-player-id (= player-id))
              ; 如果效果的擁有者是你
          cmds (if is-my-effect
                     ; 設定將要支付的效果
                 [{:type :set-current-pay-effect
                   :effect top-effect}
                  {:type :cancel-current-play-text
                   :effect top-effect}]
                 [{:type :wait :reason "對待對手處理立即效果"}])]
      cmds)
    ; 如果有堆疊效果
    (has-cut-effects ctx)
    (let [top-effect (-> ctx get-cut-effects first)
          is-my-effect (->> top-effect (get-effect-runtime ctx) runtime/get-player-id (= player-id))
                ; 如果都讓過
          cmds (if (is-all-pass-cut ctx)
                       ; 如果是效果擁有者
                 (if is-my-effect
                         ; 執行系統指令
                   [{:type :set-current-pay-effect :effects top-effect}]
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
    #_(-> ctx get-phase timing/can-play-card-or-text)
    ; 如果有破壞中的機體
    #_(if (has-destroy-effects ctx player-id)
    ; 將破壞產生的廢棄效果推到新的切入
        [{:type :convert-destroy-effects-to-new-cut}]
      ; 指令
        [])

    :else
    (let [current-phase (-> ctx get-phase)]
      (match current-phase
        (:or [_ :start] [_ _ :start] [_ :end] [_ _ :end] [_ :end _] [_ :rule] [_ _ :rule])
        (if (has-handle-phase ctx current-phase)
          [{:type :next-phase :current-phase current-phase}]
          (if (is-current-player ctx player-id)
            [{:type :handle-phase :current-phase current-phase}]
            [{:type :wait :reason (str "等待系統處理階段" current-phase)}]))
        ; 自由時間
        (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
        ; 如果有破壞中的機體
        (if (has-destroy-effects ctx player-id)
        ; 將破壞產生的廢棄效果推到新的切入
          (if (is-current-player ctx player-id)
            [{:type :convert-destroy-effects-to-new-cut}]
            [{:type :wait :reason (str "等待系統處理階段")}])
        ; 指令
          (let [cmds (if (is-all-pass-cut ctx)
                       (if (is-current-player ctx player-id)
                         [{:type :next-phase :current-phase current-phase}
                          {:type :cut-in :card-ids []}]
                         [{:type :wait :reason "等待效果擁有者處理"}])
                                 ; 只有其中一個讓過
                       (let [; 主動者有優先權
                             is-my-cut-chance (is-current-player ctx player-id)
                                       ; 如果我有優先權
                             is-my-cut-chance (if is-my-cut-chance
                                                          ; 並且我沒有讓過
                                                (not (is-pass-cut ctx player-id))
                                                          ; 我沒有優先權但對手讓過
                                                (is-pass-cut ctx (player/get-opponent player-id)))]
                         (if is-my-cut-chance
                           [; 讓過
                            {:type :pass}
                            ; 切入
                            {:type :cut-in :card-ids []}]
                           [{:type :wait :reason "等待敵軍切入"}])))]
            cmds))

        ;; [:reroll :rule]
        ;; (if (has-handle-reroll-rule ctx)
        ;;   [{:type :next-phase :current-phase current-phase}]
        ;;   (if (is-current-player ctx player-id)
        ;;     [{:type :handle-reroll-rule}]
        ;;     [{:type :wait :reason ""}]))

        ;; [:draw :rule]
        ;; (if (has-handle-draw-rule ctx)
        ;;   [{:type :next-phase :current-phase current-phase}]
        ;;   (if (is-current-player ctx player-id)
        ;;     [{:type :handle-draw-rule}]
        ;;     [{:type :wait :reason ""}]))

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
        []))))



(defn exec-command [ctx player-id cmd]
  (s/assert ::spec ctx)
  (match cmd
    {:type :pay-conditions}
    (let [effect (-> ctx get-flow get-current-pay-effect
                     (or (throw (ex-info "正在支付的效果不存在" {}))))
          text (-> effect game.define.effect/get-text)
          logic-ids (-> text card-text/get-logics-ids)
          ctx (if (-> logic-ids count pos? not)
                ctx
                (let [current-pay-logic-id (-> ctx get-flow get-current-pay-logic-id)
                      logic (-> text card-text/get-logics (get current-pay-logic-id))
                      conditions (-> text (card-text/get-logic-conditions logic))
                      runtime (-> ctx (get-effect-runtime effect))
                      ; 支付
                      ctx (->> conditions vals (map card-text/get-condition-tips) (reduce (fn [ctx f] (f ctx)) ctx))
                      ctx (->> conditions vals (map card-text/get-condition-action) (reduce (fn [ctx f] (f ctx)) ctx))
                      ctx (-> logic (card-text/get-logic-action) (#(% ctx runtime)))]
                  ctx))
          ctx (-> ctx get-flow clear-current-pay-effect (#(set-flow ctx %)))]
      ctx)

    {:type :handle-phase :current-phase current-phase}
    (do
      (-> ctx get-phase (= current-phase) (or (throw (ex-info "current-phase not match" {}))))
      (-> ctx (is-current-player player-id) (or (throw (ex-info "must be current player" {}))))
      (handle-phase ctx current-phase))

    {:type :pass}
    (set-pass-cut ctx player-id)

    ;; {:type :handle-draw-rule}
    ;; (handle-draw-rule ctx)

    ;; {:type :handle-reroll-rule}
    ;; (handle-reroll-rule ctx)

    {:type :next-phase :current-phase current-phase}
    (do
      (-> ctx get-phase (= current-phase) (or (throw (ex-info "current-phase not match" {}))))
      (-> ctx (is-current-player player-id) (or (throw (ex-info "must be current player" {}))))
      (handle-next-phase ctx))

    {:type :set-logic-id :logic-ids logic-ids :selected-logic-id selected-logic-id}
    (-> ctx get-flow (set-current-pay-logic-id selected-logic-id) (#(set-flow ctx %)))

    [:convert-destroy-effects-to-new-cut]
    (convert-destroy-effects-to-new-cut ctx)

    :else
    (throw (ex-info (str cmd " not found") {:cmd cmd}))))

(defn test-selection []
  (let [player-id :A
        ctx (create-model-flow)
        ctx (-> ctx
                get-flow
                (set-current-pay-effect game.define.effect/effect-value)
                (set-current-pay-selection "" [[:card 0 1 2] [:count 1]])
                (#(set-flow ctx %))
                (#(s/assert ::spec %)))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :pay-conditions} & _] true
            :else (throw (ex-info "must :pay-conditions" {})))]))

(defn test-cut []
  (let [player-id :A
        ctx (-> (create-model-flow)
                (cut-in "effect-1" {:reason [:system :A] :text card-text/card-text-value})
                (#(s/assert ::spec %)))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :wait} & _] true
            :else (throw (ex-info "must wait" {})))
        cmds (query-command ctx (player/get-opponent player-id))
        _ (match cmds
            [{:type :cut-in} {:type :pass} & _] true
            :else (throw (ex-info "must cut-in" {})))]))

(defn test-next-phase []
  (let [player-id :A
        ctx (-> (create-model-flow)
                (set-phase [:reroll :rule])
                (#(s/assert ::spec %)))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :handle-phase :current-phase [:reroll :rule]}] true
            :else (throw (ex-info "must handle-phase" {})))
        ctx (exec-command ctx player-id (first cmds))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :next-phase :current-phase [:reroll :rule]}] true
            :else (throw (ex-info "must :next-phase" {})))
        ctx (exec-command ctx player-id (first cmds))
        _ (-> ctx get-phase (= [:reroll :free2])
              (or (throw (ex-info "must [:reroll :free2]" {}))))]))

(defn test-next-phase2 []
  (let [[player-a player-b] player/player-ids
        ctx (s/assert ::spec (create-model-flow))]
    (loop [i 0
           ctx ctx]
      (if (> i 70)
        (do
          ;(println ctx)
          (-> ctx get-phase (= [:reroll :start]) (or (throw (ex-info "must [:reroll :start]" {}))))
          ctx)
        (let [;_ (println "current-phase" (-> ctx get-phase))
              cmds (query-command ctx player-a)
              ;_ (println player-a "cmds" cmds)
              ctx (match cmds
                    [{:type :handle-phase} & _]
                    (exec-command ctx player-a (first cmds))

                    [{:type :handle-reroll-rule} & _]
                    (exec-command ctx player-a (first cmds))

                    [{:type :next-phase} & _]
                    (exec-command ctx player-a (first cmds))

                    [{:type :pass} & _]
                    (let [_ (-> ctx get-flow get-current-pay-logic-id nil? (or (throw (ex-info "get-current-pay-logic-id must nil before exec" {}))))
                          ctx (exec-command ctx player-a (first cmds))
                          _ (-> ctx get-flow get-current-pay-logic-id nil? not (or (throw (ex-info "get-current-pay-logic-id must exist after exec" {}))))
                          cmds (query-command ctx player-b)
                          ;_ (println player-b "cmds" cmds)
                          ctx (match cmds
                                [{:type :pass} & _]
                                (exec-command ctx player-b (first cmds)))]
                      ctx))]
          (recur (inc i) ctx))))))

(defn test-current-pay-effect []
  (let [[player-a player-b] player/player-ids
        ctx (create-model-flow)
        ctx (-> ctx get-flow (set-current-pay-effect (merge game.define.effect/effect-value
                                                            {:reason [:system (get-attack-side ctx)]
                                                             :text {:type :system
                                                                    :description "draw a card"
                                                                    :conditions {"draw top1card" {:tips '(fn [ctx runtime]
                                                                                                           [:top-n-card-from-home 1])
                                                                                                  :action '(fn [ctx runtime selection]
                                                                                                                                            ; move to hand
                                                                                                             ctx)}}
                                                                    :logic {"top1card" ['(Leaf "draw top1card")
                                                                                        '(fn [ctx runtime]
                                                                                           ctx)]}}}))
                (#(set-flow ctx %))
                (#(s/assert ::spec %)))
        cmds (query-command ctx player-a)
        ;_ (println cmds)
        _ (match cmds
            [{:type :set-logic-id :logic-ids logic-ids} & _]
            (do
              (-> logic-ids count pos? (or (throw (ex-info "logic-ids count must > 0" {}))))
              (let [ctx (exec-command ctx player-a (first cmds))
                    ;_ (println ctx)
                    cmds (query-command ctx player-a)
                    ;_ (println cmds)
                    ])))]))

(defn test-current-pay-effect-play-g []
  (let [[player-a _player-b] player/player-ids
        play-g-text {:type :system
                     :logics {"出牌到G-zone"
                              {:action `(fn [~'ctx ~'runtime]
                                          (let [~'card-id (-> ~'runtime game.define.runtime/get-card-id)
                                                ~'to-ba-syou-id [~player-a :maintenance-area]
                                                ~'ctx (-> ~'ctx
                                                          (game.model.card-table/move-card [~player-a :te-hu-ta] ~'to-ba-syou-id ~'card-id)
                                                          (game.model.card-table/set-card-is-roll ~'to-ba-syou-id ~'card-id true))]
                                            ~'ctx))}}}
        ctx (create-model-flow)
        ctx (-> ctx
                get-flow
                (set-current-pay-effect (->> {:reason (game.define.effect/value-of-play-card-reason player-a "0")
                                              :text play-g-text}
                                             (merge game.define.effect/effect-value)))
                (#(set-flow ctx %))
                (add-card [:A :te-hu-ta] "0" (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"}))
                (#(s/assert ::spec %)))
        _ (-> ctx (get-cards-by-ba-syou [player-a :te-hu-ta]) count (= 1) (or (throw (ex-info "player-a te-hu-ta must 1" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :maintenance-area]) count zero? (or (throw (ex-info "player-a maintenance-area must 0" {}))))
        cmds (query-command ctx player-a)
        ctx (match cmds
              [{:type :set-logic-id} & _] (exec-command ctx player-a (first cmds))
              :else (throw (ex-info "must set-logic-id" {})))
        cmds (query-command ctx player-a)
        ;; _ (println cmds)
        ;; ctx (match cmds
        ;;       [{:type :wait} & _] ctx
        ;;       :else (throw (ex-info "must wait" {})))
        ;; cmds (query-command ctx player-b)
        ;; _ (println cmds)
        ctx (match cmds
              [{:type :pay-conditions} & _] (exec-command ctx player-a (first cmds))
              :else (throw (ex-info "must pay-conditions" {})))
        cmds (query-command ctx player-a)
        ctx (match cmds
              [{:type :handle-phase} & _] ctx
              :else (throw (ex-info "must handle-phase" {})))
        _ (-> ctx (get-cards-by-ba-syou [player-a :te-hu-ta]) count zero? (or (throw (ex-info "player-a te-hu-ta must 0" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :maintenance-area]) count (= 1) (or (throw (ex-info "player-a maintenance-area must 1" {}))))]))

(defn tests []
  (test-selection)
  (test-cut)
  (test-next-phase)
  (test-current-pay-effect-play-g)
  #_(test-next-phase2)
  #_(test-current-pay-effect))