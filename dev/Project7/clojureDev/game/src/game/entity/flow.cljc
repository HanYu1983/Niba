(ns game.entity.flow
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [game.define.card-text :as card-text]
            [game.define.selection]
            [game.component.cuts :refer [get-top-cut]]
            [game.component.table :as table]
            [game.entity.model :as model]))


(s/def ::has-cuts (s/map-of any? any?))
(s/def ::current-pay-text :game.define.card-text/spec)
(s/def ::current-player-id any?)
(s/def ::current-selection (s/map-of any? :game.define.selection/spec))
(s/def ::flow (s/keys :req-un [::has-cuts]
                      :opt-un [::current-pay-text ::current-player-id ::current-selection]))
(s/def ::spec (s/merge :game.entity.model/spec
                       (s/keys :req-un [::flow])))

(defn has-destroy-effects [ctx player-id])
(defn has-immediate-effects [ctx player-id])
(defn has-cut-effects [ctx player-id])
(defn query-immediate-effects [ctx player-id])
(defn query-cut-effects [ctx player-id])
(defn convert-destroy-effects-to-new-cut [ctx])

(defn get-current-pay-text [ctx]
  (-> ctx :flow :current-pay-text))

(defn has-current-pay-text [ctx]
  (get-current-pay-text ctx))


(defn is-current-player [ctx player-id]
  (-> ctx :current-player-id (= player-id)))

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
        (if (is-current-player ctx player-id)
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
          top-effect (first effects)
          effect-controller (table/get-effect-controller ctx top-effect)
              ; 如果效果的擁有者是你
          cmds (if (= effect-controller player-id)
                     ; 設定將要支付的效果
                 [{:type :set-current-pay-text
                   :effect top-effect}
                  {:type :cancel-current-play-text
                   :effect top-effect}]
                 [{:type :wait :reason "對待對手處理立即效果"}])]
      cmds)
        ; 如果有堆疊效果
    (has-cut-effects ctx player-id)
    (let [top-cut (get-top-cut ctx)
          top-effect nil]
      {:type :set-current-pay-text
       :effects top-effect})

        ; 如果有破壞中的機體
    (has-destroy-effects ctx player-id)
        ; 將破壞產生的廢棄效果推到新的切入
    [{:type :convert-destroy-effects-to-new-cut}]

    :else
    (throw (ex-info "not match cmd" {}))))

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
        ctx (query-command ctx player-id)
        _ (println ctx)]))