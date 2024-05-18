(ns game.core
  (:require [clojure.core.match]
            [clojure.spec.alpha :as s]
            [clojure.core :refer [read-string]]
            [game.common.dynamic]
            [game.define.card-proto]
            [game.define.basyou]
            [game.define.card-text]
            [game.define.effect]
            [game.define.gsign]
            [game.define.selection]
            [game.define.timing]
            [game.component.card-proto]
            [game.component.cuts]
            [game.component.effect]
            [game.component.table]
            [game.component.phase]
            [game.component.current-player]
            [game.component.selection]
            [game.entity.model]
            [game.entity.model-flow]
            [game.tool.return-let]
            [game.tool.waterfall]
            [game.tool.callback]
            [game.tool.either]))

(defn test-script-eval []
  (let [card-proto-example
        [""
         {:gsign [:blue :uc]
          :type :unit
          :texts {"text-1"
                  {:description "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                   :phase :trigger
                   :type [:automatic :trigger]
                   :events
                   ['(fn [ctx runtime evt]
                       (clojure.core.match/match evt
                         [:on-gain {:battle-point battle-point}]
                         (let [this-card-id (-> runtime :card-id)
                               option-ids ["zaku" "gundam"]
                               ctx (if (-> option-ids count pos?)
                                     (game.common.dynamic/cut-in ctx "effect-id1"
                                                                 {:reason [:play-text "player-id" this-card-id "text-1"]
                                                                  :is-immediate true
                                                                  :clear-cutin-status false
                                                                  :text {:description "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                         :type :system
                                                                         :conditions {"condition-1"
                                                                                      {:tips `(fn [~'ctx ~'runtime]
                                                                                                [[:card ~@option-ids] [:count 1]])
                                                                                       :action `(fn [~'ctx ~'runtime ~'selection]
                                                                                                  (game.common.dynamic/add-text ~'ctx "text-id"
                                                                                                                                {:type :system
                                                                                                                                 :events [(read-string (str "(fn [ctx runtime evt] (match evt [:on-end-turn info] (app.dynamic/delete-text ctx \"text-id\") :else ctx))"))]
                                                                                                                                 :game-effects [`(fn [~~''ctx ~~''runtime]
                                                                                                                                                   (for [~~''card-id ~~'selection]
                                                                                                                                                     [:add-battle-point ~~''card-id ~~battle-point]))
                                                                                                                                                (read-string (str "(fn [ctx runtime] (for [card-id " ~'selection "] [:add-battle-point card-id " ~battle-point "]))"))
                                                                                                                                                (list ~''fn [~''ctx ~''runtime]
                                                                                                                                                      (list ~''for [~''card-id ~'selection]
                                                                                                                                                            [:add-battle-point ~''card-id ~battle-point]))]}))}}}})
                                     ctx)]
                           ctx)
                         :else
                         ctx))]}}}]
        _ (s/assert :game.define.card-proto/value (second card-proto-example))
        effect (atom nil)
        added-text (atom nil)
        _ (binding [game.common.dynamic/cut-in (fn [ctx id eff]
                                                 (s/assert :game.define.effect/value eff)
                                                 (reset! effect eff)
                                                 ctx)
                    game.common.dynamic/add-text (fn [ctx id text]
                                                   (s/assert :game.define.card-text/value text)
                                                   (reset! added-text text)
                                                   ctx)]
            (let [ctx {}
                  runtime {:card-id "gundam"}
                  script (-> card-proto-example str read-string second :texts (get "text-1") :events first)
                  eventF (eval script)
                  _ (eventF ctx runtime [:on-gain {:battle-point [1 1 0]}])
                  {option-ids-script :tips action-script :action} (-> @effect :text :conditions (get "condition-1"))
                  option-ids-fn (eval option-ids-script)
                  option-ids (s/assert :game.define.selection/spec (option-ids-fn ctx runtime))
                  _ (when (not (= option-ids [[:card "zaku" "gundam"] [:count 1]]))
                      (throw (ex-info "option-ids not right" {})))
                  user-selection-ids (game.define.selection/get-options option-ids)
                  action-fn (eval action-script)
                  _ (action-fn ctx runtime (into [] user-selection-ids))
                  effect-script (-> @added-text :game-effects first)
                  effect-fn (eval effect-script)
                  game-effects (effect-fn ctx runtime)
                  _ (when (not (= game-effects (list [:add-battle-point "zaku" [1 1 0]] [:add-battle-point "gundam" [1 1 0]])))
                      (throw (ex-info "effects not right" {})))]))]))



(defn test-target []
  ;; 179030_11E_U_BL212N_blue
;; N
;; CCA
;; ジェガン重装型
;; ジェガン系　MS
;; 『起動』：このカードが場に出た場合、本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。 
  (let [card-proto-179030_11E_U_BL212N_blue
        (merge game.define.card-proto/default-card-proto-value
               {:gsign [:blue :uc]
                :type :unit
                :texts {"『起動』：このカードが場に出た場合、本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。"
                        {:type [:automatic :trigger]
                         :events
                         ['(fn [ctx runtime evt]
                             (clojure.core.match/match evt
                               [:on-enter-field {:card-id on-enter-card-id}]
                               (let [this-card-id (-> runtime game.define.runtime/get-card-id)]
                                 (if (-> this-card-id (= on-enter-card-id))
                                   (add-immediate-effect ctx (merge game.define.effect/effect-value
                                                                    {:reason [:card-text this-card-id]
                                                                     :text (merge game.define.card-text/card-text-value
                                                                                  {:type :system
                                                                                   :conditions {"本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。"
                                                                                                {:tips '(fn [ctx runtime]
                                                                                                          (let [card-tips (-> ctx get-g-cards (has-origin-char "装弾"))
                                                                                                                card-basyou-tips (-> card-tips (map get-basyou) (zipmap card-tips) vec)]
                                                                                                            card-basyou-tips))
                                                                                                 :type :card
                                                                                                 :count 1
                                                                                                 :options {:can-cancel true}
                                                                                                 :action '(fn [ctx runtime]
                                                                                                            ; 自軍ハンガーに移す事ができる。
                                                                                                            (let [[sel-card-id basyou] (-> ctx
                                                                                                                                           (get-selection "本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。"))
                                                                                                                  ctx (-> ctx (move-card sel-card-id basyou [:A :hanger]))]
                                                                                                              ctx))}}
                                                                                   :logic {"その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。"
                                                                                           ['(Leaf "本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。")
                                                                                            '(fn [ctx runtime]
                                                                                               ; その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。
                                                                                               ctx)]
                                                                                           "do nothing"
                                                                                           ['(And) '(fn [ctx runtime] ctx)]}})}))))
                               :else ctx))]}}})
;; 179030_11E_U_BL209R_blue
;; R
;; CCA
;; νガンダム［†］
;; νガンダム系　MS　専用「アムロ・レイ」
;; 戦闘配備　〔１〕：サイコミュ（３）　〔１〕：改装［νガンダム系］
;; 『恒常』：本来の記述に「特徴：装弾」を持つ自軍Gがある場合、このカードは、合計国力ー１してプレイできる。
;; 『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。
        card-proto-179030_11E_U_BL209R_blue
        (merge game.define.card-proto/default-card-proto-value
               {:gsign [:blue :uc]
                :type :unit
                :texts {"『恒常』：play card"
                        {:type [:automatic :constant]
                         :conditions {"合計國力6"
                                      {:tips '(fn [ctx runtime] ctx)
                                       :count 0
                                       :options {}
                                       :action '(fn [ctx runtime]
                                                  (-> ctx get-my-g count (> 6)))}
                                      "横置3個藍G"
                                      {:tips '(fn [ctx runtime] ctx
                                                (-> ctx get-my-g-can-tap))
                                       :count 3
                                       :options {}
                                       :action '(fn [ctx runtime]
                                                  ctx)}
                                      "在手牌或hanger"
                                      {:action '(fn [ctx] ctx)}
                                      "在配備階段"
                                      {:action '(fn [ctx] ctx)}
                                      "放到play-card-zone"
                                      {:tips '(fn [ctx runtime]
                                                ctx)
                                       :action '(fn [ctx runtime]
                                                  ctx)}}
                         :logic {"出機體"
                                 ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                                  '(fn [ctx runtime]
                                     (game.common.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                                           :text (->> {:type :system
                                                                                       :logic {"移到場上"
                                                                                               [nil
                                                                                                '(fn [ctx runtime]
                                                                                                   ctx)]}}
                                                                                      (merge game.define.card-text/card-text-value)
                                                                                      (s/assert :game.define.card-text/value))}
                                                                          (merge game.define.effect/effect-value)
                                                                          (s/assert :game.define.effect/value))))]}}

                        "『恒常』：本来の記述に「特徴：装弾」を持つ自軍Gがある場合、このカードは、合計国力ー１してプレイできる。"
                        {:type [:automatic :constant]
                         :game-effects ['(fn [ctx runtime]
                                           (let [enabled (-> ctx get-my-g (#(mapcat get-chars %)) (contains? "装弾"))]
                                             (when enabled
                                               {:description "このカードは、合計国力ー１してプレイできる。"})))]}
                        "『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。"
                        {:type [:automatic :residents]
                         :game-effects ['(fn [ctx runtime]
                                           (let [is-every-blue-g (-> ctx get-my-g (#(map get-color)) (#(map is-blue?)) every?)
                                                 is-my-g-more-then-5 (-> ctx get-my-g count (> 5))
                                                 enabled (and is-every-blue-g is-my-g-more-then-5)]
                                             (when enabled
                                               {:description "このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。"})))]}}})
        ;; 179030_11E_U_BL213S_blue
        ;; S
        ;; 閃光のハサウェイ
        ;; ペーネロペー［†］
        ;; ペーネロペー系　MS　専用「レーン・エイム」
        ;; 戦闘配備　高機動　〔１〕：改装［ペーネロペー系］
        ;; 『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。
        ;; 『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。
        card-proto-179030_11E_U_BL213S_blue
        (merge game.define.card-proto/default-card-proto-value
               {:gsign [:blue :uc]
                :type :unit
                :texts {"『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。"
                        {:type [:automatic :residents]
                         :game-effects ['(fn [ctx runtime]
                                           (let [x (-> ctx get-my-hand count)]
                                             {:description "このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。"
                                              :battle-point [x x x]}))]}
                        "『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。"
                        {:type [:automatic :trigger]
                         :events
                         ['(fn [ctx runtime evt]
                             (clojure.core.match/match evt
                               [:on-end-turn {:player-id player-id}]
                               (-> ctx
                                   (get-card-state this-card-id)
                                   (dissoc "このカードが場に出た場合、カード３枚を引く")
                                   (#(set-card-state ctx this-card-id %)))
                               [:on-enter-field {:card-id on-enter-card-id}]
                               (let [this-card-id (-> runtime game.define.runtime/get-card-id)
                                     not-yet (-> ctx
                                                 (get-card-state this-card-id)
                                                 (get "このカードが場に出た場合、カード３枚を引く")
                                                 nil?)]
                                 (if (-> this-card-id (= on-enter-card-id) (and not-yet))
                                   (add-immediate-effect ctx (merge game.define.effect/effect-value
                                                                    {:reason [:card-text this-card-id]
                                                                     :text (merge game.define.card-text/card-text-value
                                                                                  {:type :system
                                                                                   :logic {"このカードが場に出た場合、カード３枚を引く"
                                                                                           ['(And)
                                                                                            '(fn [ctx runtime]
                                                                                               (let [ctx (-> ctx
                                                                                                             (get-card-state this-card-id)
                                                                                                             (assoc "このカードが場に出た場合、カード３枚を引く")
                                                                                                             (#(set-card-state ctx this-card-id %))
                                                                                                             (draw-card 3))]
                                                                                                 ctx))]}})}))

                                   ctx))))]}}})

        play-card-effect
        (merge game.define.effect/effect-value
               {:reason [:play-card ""]
                :text (merge game.define.card-text/card-text-value
                             {:type :system
                              :conditions {"合計國力6"
                                           {:tips '(fn [ctx runtime] ctx)
                                            :count 0
                                            :options {}
                                            :action '(fn [ctx runtime]
                                                       (-> ctx get-my-g count (> 6)))}
                                           "横置3個藍G"
                                           {:tips '(fn [ctx runtime] ctx
                                                     (-> ctx get-my-g-can-tap))
                                            :count 3
                                            :options {}
                                            :action '(fn [ctx runtime]
                                                       ; tap
                                                       ctx)}
                                           "放到play-card-zone"
                                           {:tips '(fn [ctx runtime]
                                                     ctx)
                                            :action '(fn [ctx runtime]
                                                       ctx)}}
                              :logic {"出機體"
                                      ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                                       '(fn [ctx runtime]
                                          (game.common.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                                                :text (->> {:type :system
                                                                                            :logic {"移到場上"
                                                                                                    [nil
                                                                                                     '(fn [ctx runtime]
                                                                                                        ctx)]}}
                                                                                           (merge game.define.card-text/card-text-value)
                                                                                           (s/assert :game.define.card-text/value))}
                                                                               (merge game.define.effect/effect-value)
                                                                               (s/assert :game.define.effect/value))))]}})})]))

(defn -main [args]
  (s/check-asserts true)
  (game.define.card-text/tests)
  (game.define.basyou/tests)
  (game.define.card-proto/tests)
  (game.define.effect/tests)
  (game.define.gsign/tests)
  (game.define.selection/tests)
  (game.define.timing/tests)
  (game.component.card-proto/tests)
  (game.component.cuts/tests)
  (game.component.effect/tests)
  (game.component.table/tests)
  (game.component.phase/tests)
  (game.component.current-player/tests)
  (game.entity.model/tests)
  (game.entity.model-flow/tests)
  (test-script-eval)
   ;; (game.tool.return-let/test-all)
  ;; (game.tool.waterfall/test-all)
  ;; (game.tool.callback/test-all)
  ;; (game.tool.either/test-all)
  )