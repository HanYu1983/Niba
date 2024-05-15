(ns game.entity.model-flow
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
            [game.component.selection]
            [game.entity.model :as model]))
; current-pay-component
(s/def ::current-pay-text :game.define.card-text/value)
(s/def ::current-pay-selection (s/map-of any? :game.define.selection/spec))
(s/def ::current-pay-component (s/keys :req-un [::current-pay-selection]
                                       :opt-un [::current-pay-text]))
(defn set-current-pay-text [ctx text]
  (s/assert ::current-pay-component ctx)
  (assoc ctx :current-pay-text text))
(defn get-current-pay-text [ctx]
  (s/assert ::current-pay-component ctx)
  (-> ctx :current-pay-text))
(defn has-current-pay-text [ctx]
  (s/assert ::current-pay-component ctx)
  (get-current-pay-text ctx))
(defn clear-current-pay-text [ctx]
  (s/assert ::current-pay-component ctx)
  (dissoc ctx :current-pay-text))
(defn set-current-pay-selection [ctx k v]
  (s/assert ::current-pay-component ctx)
  (update ctx :current-pay-selection assoc k v))
(defn get-current-pay-selection [ctx]
  (s/assert ::current-pay-component ctx)
  (-> ctx :current-pay-selection))
(defn clear-current-pay-selection [ctx]
  (s/assert ::current-pay-component ctx)
  (assoc ctx :current-pay-selection {}))
; flags-component
(s/def ::flags (s/coll-of (into #{:has-handle-draw-rule :has-handle-reroll-rule} timing/timings) :kind set?))
(s/def ::flags-component (s/keys :req-un [::flags]))
(defn set-flags [ctx fs]
  (s/assert ::flags-component ctx)
  (update ctx :flags into fs))
(defn has-flag [ctx f]
  (s/assert ::flags-component ctx)
  (-> ctx :flags (get f) nil? not))
; has-cuts-component
(s/def ::has-cuts (s/coll-of :game.define.player/id :kind set?))
(s/def ::has-cuts-component (s/keys :req-un [::has-cuts]))
(defn get-has-cut [ctx id]
  (s/assert ::has-cuts-component ctx)
  (s/assert :game.define.player/id id)
  (-> ctx :has-cuts id nil? not))
(defn set-has-cut [ctx id]
  (s/assert ::has-cuts-component ctx)
  (s/assert :game.define.player/id id)
  (update ctx :has-cuts into [id]))
(defn clear-has-cut [ctx]
  (s/assert ::has-cuts-component ctx)
  (assoc ctx :has-cuts #{}))
; flow
(s/def ::flow (s/merge ::current-pay-component
                       ::flags-component
                       ::has-cuts-component))
(s/def ::spec (s/merge :game.entity.model/spec
                       (s/keys :req-un [::flow])))
(defn get-flow [ctx]
  (s/assert ::spec ctx)
  (-> ctx :flow))
(defn set-flow [ctx flow]
  (s/assert ::spec ctx)
  (assoc ctx :flow flow))
(def flow {:has-cuts #{}
           :flags #{}
           :current-pay-selection {}})
(def model-flow (assoc model/model
                       :flow flow))

(defn has-destroy-effects [ctx player-id])
(defn has-immediate-effects [ctx player-id])
; draw rule
(defn has-handle-draw-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (has-flag :has-handle-draw-rule)))
(defn handle-draw-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (set-flags [:has-handle-draw-rule]) (#(set-flow ctx %))))

; reroll rule
(defn has-handle-reroll-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (has-flag :has-handle-reroll-rule)))
(defn handle-reroll-rule [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-flow (set-flags [:has-handle-reroll-rule]) (#(set-flow ctx %))))

; handle phase
(defn has-handle-phase [ctx phase]
  (s/assert ::spec ctx)
  (-> ctx get-flow (has-flag phase)))
(defn handle-phase [ctx phase]
  (s/assert ::spec ctx)
  (when (has-handle-phase ctx phase)
    (throw (ex-info "already has handle phase" {})))
  (-> ctx get-flow (set-flags [phase]) (#(set-flow ctx %))))


(defn get-cut-effects [ctx]
  (s/assert ::spec ctx)
  (-> ctx effect/get-top-cut))
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
      get-flow clear-has-cut (#(set-flow ctx %))
      phase/next-phase))

(defn query-command [ctx player-id]
  (s/assert ::spec ctx)
  (cond
    ; 如果正在支付
    (-> ctx get-flow has-current-pay-text)
    (let [text (-> ctx get-flow get-current-pay-text)
          conditions (card-text/get-conditions text)
          logic (card-text/get-logic text)
          my-conditions (->> conditions (filter (partial card-text/filter-player-condition player-id)))
          current-pay-selection (-> ctx get-flow get-current-pay-selection)]
          ; 如果可以成功支付
      (if (card-text/can-pass-conditions text current-pay-selection)
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
          :current-pay-selection current-pay-selection}]))
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
    #_(-> ctx phase/get-phase timing/can-play-card-or-text)
    ; 如果有破壞中的機體
    #_(if (has-destroy-effects ctx player-id)
    ; 將破壞產生的廢棄效果推到新的切入
      [{:type :convert-destroy-effects-to-new-cut}]
      ; 指令
      [])

    :else
    (let [current-phase (-> ctx phase/get-phase)]
      (match current-phase
        (:or [_ :start] [_ _ :start] [_ :end] [_ _ :end] [_ :end _] [_ :rule] [_ _ :rule])
        (if (has-handle-phase ctx current-phase)
          [{:type :next-phase :current-phase current-phase}]
          (if (current-player/is-current-player ctx player-id)
            [{:type :handle-phase :current-phase current-phase}]
            [{:type :wait :reason (str "等待系統處理階段" current-phase)}]))
        ; 自由時間
        (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
        ; 如果有破壞中的機體
        (if (has-destroy-effects ctx player-id)
        ; 將破壞產生的廢棄效果推到新的切入
          (if (current-player/is-current-player ctx player-id)
            [{:type :convert-destroy-effects-to-new-cut}]
            [{:type :wait :reason (str "等待系統處理階段")}])
        ; 指令
          (let [cmds (if (is-all-pass-cut ctx)
                       (if (current-player/is-current-player ctx player-id)
                         [{:type :next-phase :current-phase current-phase}
                          {:type :cut-in :card-ids []}]
                         [{:type :wait :reason "等待效果擁有者處理"}])
                                 ; 只有其中一個讓過
                       (let [; 主動者有優先權
                             is-my-cut-chance (current-player/is-current-player ctx player-id)
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

        [:reroll :rule]
        (if (has-handle-reroll-rule ctx)
          [{:type :next-phase :current-phase current-phase}]
          (if (current-player/is-current-player ctx player-id)
            [{:type :handle-reroll-rule}]
            [{:type :wait :reason ""}]))

        [:draw :rule]
        (if (has-handle-draw-rule ctx)
          [{:type :next-phase :current-phase current-phase}]
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
        []))))



(defn exec-command [ctx player-id cmd]
  (s/assert ::spec ctx)
  (match cmd
    {:type :handle-phase :current-phase current-phase}
    (do
      (-> ctx phase/get-phase (= current-phase) (or (throw (ex-info "current-phase not match" {}))))
      (-> ctx (current-player/is-current-player player-id) (or (throw (ex-info "must be current player" {}))))
      (handle-next-phase ctx)) 
    
    {:type :pass}
    (set-pass-cut ctx player-id)

    {:type :handle-draw-rule}
    (handle-draw-rule ctx)

    {:type :handle-reroll-rule}
    (handle-reroll-rule ctx)

    {:type :next-phase :current-phase current-phase}
    (do
      (-> ctx phase/get-phase (= current-phase) (or (throw (ex-info "current-phase not match" {}))))
      (-> ctx (current-player/is-current-player player-id) (or (throw (ex-info "must be current player" {}))))
      (handle-next-phase ctx))

    [:convert-destroy-effects-to-new-cut]
    (convert-destroy-effects-to-new-cut ctx)

    :else
    (throw (ex-info (str cmd " not found") {:cmd cmd}))))

(defn test-selection []
  (let [player-id :A
        ctx (s/assert ::spec (update model-flow :flow merge {:current-pay-text card-text/card-text-value
                                                             :current-pay-selection {"" [[:card 0 1 2] [:count 1]]}}))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :set-selection} & _] true
            :else (throw (ex-info "must set-selection" {})))]))

(defn test-cut []
  (let [player-id :A
        ctx (s/assert ::spec (-> model-flow (effect/cut-in "effect-1" {:reason [:system :A] :text card-text/card-text-value})))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :wait} & _] true
            :else (throw (ex-info "must wait" {})))
        cmds (query-command ctx (player/get-opponent player-id))
        _ (match cmds
            [{:type :cut-in} {:type :pass} & _] true
            :else (throw (ex-info "must cut-in" {})))]))

#_(defn test-next-phase []
  (let [player-id :A
        ctx (s/assert ::spec (assoc model-flow :phase [:reroll :rule]))
        cmds (query-command ctx player-id)
        _ (println cmds)
        _ (match cmds
            [{:type :handle-reroll-rule}] true
            :else (throw (ex-info "must handle-reroll-rule" {})))
        ctx (exec-command ctx player-id (first cmds))
        cmds (query-command ctx player-id)
        _ (match cmds
            [{:type :next-phase :current-phase [:reroll :rule]}] true
            :else (throw (ex-info "must :next-phase" {})))
        ctx (exec-command ctx player-id (first cmds))
        _ (-> ctx phase/get-phase (= [:reroll :free2])
              (or (throw (ex-info "must [:reroll :free2]" {}))))]))

(defn test-next-phase2 []
  (let [[player-a player-b] player/player-ids
        ctx (s/assert ::spec model-flow)]
    (loop [i 0
           ctx ctx]
      (if (> i 50)
        (do
          (-> ctx phase/get-phase (= [:reroll :end]) (or (throw (ex-info "must [:reroll :end]" {}))))
          ctx)
        (let [;_ (println "current-phase" (-> ctx phase/get-phase))
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
                    (let [ctx (exec-command ctx player-a (first cmds))
                          cmds (query-command ctx player-b)
                          ;_ (println player-b "cmds" cmds)
                          ctx (match cmds
                                [{:type :pass} & _]
                                (exec-command ctx player-b (first cmds)))]
                      ctx))]
          (recur (inc i) ctx))))))

(defn tests []
  (test-selection)
  (test-cut)
  #_(test-next-phase)
  (test-next-phase2))