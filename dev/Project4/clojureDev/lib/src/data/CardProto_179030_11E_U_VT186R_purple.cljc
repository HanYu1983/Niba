(ns data.CardProto_179030_11E_U_VT186R_purple
  (:require [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.component.selection]
            [game.define.runtime]))

(def card-proto {:id :CardProto_179030_11E_U_VT186R_purple
                 :type :unit
                 :area #{:earth :space}
                 :battle-point [1 1 1]
                 :gsign []
                 :color []
                 :texts [{:id :CardProto_179030_11E_U_VT186R_purple-1-1
                          :description "『起動』：このカードが場に出た場合、このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。"
                          :type [:automatic :trigger]
                          :on-event '(fn [ctx evt runtime]
                                       (clojure.core.match/match evt
                                         [:card-enter-field enter-card-id]
                                         (if (= (.get-card-id runtime) enter-card-id)
                                           (let [effect {:id (str (.get-card-id runtime) "-effect")
                                                         :reason [:text-effect (.get-card-id runtime) :CardProto_179030_11E_U_VT186R_purple-1-1]
                                                         :is-immediate true
                                                         :text {:id :CardProto_179030_11E_U_VT186R_purple-1-2
                                                                :description "このターン中に場に出た敵軍ユニット１枚を、持ち主の手札に移す。"
                                                                :type nil
                                                                :requires '(fn [ctx runtime]
                                                                             (let [tips []]
                                                                               [{:id :CardProto_179030_11E_U_VT186R_purple-1-3
                                                                                 :description "このターン中に場に出た敵軍ユニット１枚を"
                                                                                 :type [:select-card #{1} tips]
                                                                                 :response-player :you
                                                                                 :action `(fn [~'ctx ~'runtime]
                                                                                            (game.component.selection/assert-selection ~'ctx :CardProto_179030_11E_U_VT186R_purple-1-3 [:select-card #{1} ~tips])
                                                                                            ~'ctx)}]))
                                                                :action '(fn [ctx runtime]
                                                                           (let [selection (game.component.selection/get-selection ctx :CardProto_179030_11E_U_VT186R_purple-1-3)]
                                                                             (reduce (fn [ctx card-id]
                                                                                       (game.entity.model/return-to-owner-hand ctx (.get-card-id runtime) card-id)) ctx selection)))}}
                                                 ctx (game.component.effect/cut-in ctx (:id effect) effect)]
                                             ctx)
                                           ctx)))}
                         {:id :play
                          :description "play"
                          :type [:automatic :constant]
                          :requires '(fn [ctx runtime])
                          :action '(fn [ctx runtime]
                                     ; put card to played-card zone
                                     ; add played-card effect
                                     (cond (card-type (.get-card-id runtime))
                                           #{:unit :operation} (let [_ (comment "移到プレイされたカード")
                                                                     _ (comment "push 出場效果")]
                                                                 ctx)
                                           :command (let [_ (comment "移到プレイされたカード")
                                                          _ (comment "push 內文+廢棄效果")]
                                                      ctx)
                                           :else ctx)
                                     ctx)}]})

(defn test-scrips []
  (s/assert :game.define.card-proto/spec card-proto)
  (let [text-1 (-> card-proto :texts (get 0))
        on-event-fn (eval (:on-event text-1))
        ctx {:cuts [[]]
             :effects {}
             :selection {}
             :card-proto-pool {}}
        runtime (game.define.runtime.DefaultExecuteRuntime. 0 0)
        ctx (on-event-fn ctx [:card-enter-field 0] runtime)
        effect-text (get-in ctx [:effects "0-effect" :text])
        effect-text-requires-fn (eval (:requires effect-text))
        requires (effect-text-requires-fn ctx runtime)
        require-1 (get requires 0)
        ctx (game.component.selection/set-selection ctx :CardProto_179030_11E_U_VT186R_purple-1-3 [])
        require-1-action-fn (eval (:action require-1))
        ctx (require-1-action-fn ctx runtime)
        effect-text-action-fn (eval (:action effect-text))
        ctx (effect-text-action-fn ctx runtime)
        ;_ (println ctx)
        ]))

(defn tests []
  (test-scrips))