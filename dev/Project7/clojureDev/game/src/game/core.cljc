(ns game.core
  (:require [clojure.core.match]
            [clojure.spec.alpha :as s]
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
                                                                                                [:card ~@option-ids])
                                                                                       :count 1
                                                                                       :options nil
                                                                                       :action `(fn [~'ctx ~'runtime ~'selection]
                                                                                                  (game.common.dynamic/add-text ~'ctx "text-id"
                                                                                                                                {:type :system
                                                                                                                                 :events [(read-string (str "(fn [ctx runtime evt] (match evt [:on-end-turn info] (app.dynamic/delete-text ctx \"text-id\") :else ctx))"))]
                                                                                                                                 :game-effects [`(fn [~~''ctx ~~''runtime]
                                                                                                                                                   (for [~~''card-id (rest ~~'selection)]
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
                  _ (when (not (= option-ids [:card "zaku" "gundam"]))
                      (throw (ex-info "option-ids not right" {})))
                  ;_ (println option-ids)
                  action-fn (eval action-script)
                  _ (action-fn ctx runtime option-ids)
                  effect-script (-> @added-text :game-effects first)
                  effect-fn (eval effect-script)
                  game-effects (effect-fn ctx runtime)
                  ;_ (println game-effects)
                  _ (when (not (= game-effects (list [:add-battle-point "zaku" [1 1 0]] [:add-battle-point "gundam" [1 1 0]])))
                      (throw (ex-info "effects not right" {})))]))]))

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