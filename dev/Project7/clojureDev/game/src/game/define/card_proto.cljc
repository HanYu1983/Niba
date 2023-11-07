(ns game.define.card-proto
  (:require [clojure.spec.alpha :as s]
            [game.tool.logic-tree]
            [game.define.card-text]
            [game.define.gsign]
            [game.define.dynamic]))
(s/def ::text :game.define.card-text/spec)
(s/def ::texts (s/map-of any? :game.define.card-text/value))
(s/def ::type #{:unit :character :command :operation :operation-unit :graphic :ace})
(s/def ::gsign :game.define.gsign/spec)
(s/def ::value (s/keys :req-un [::type ::gsign ::texts]
                      :opt-un [::battle-point ::cost ::pack ::char]))
(s/def ::spec (s/tuple any? ::value))
(s/def ::effect (s/tuple any? (s/keys :req-un [::reason ::is-immediate ::clear-cutin-status ::text])))

(defn do-logic [ctx runtime card-proto text-id logic selections]
  (let [text (-> card-proto second :texts (get text-id))
        conditions (-> text :conditions)
        key-list (keys selections)
        has-logic (game.tool.logic-tree/has logic key-list)
        _ (when (not has-logic)
            (throw (ex-info "not in" {})))
        errs (->> key-list
                  (map (comp eval :action conditions))
                  (zipmap key-list)
                  (map (fn [[key action-fn]]
                         (try [nil (action-fn ctx runtime (selections key))]
                              (catch Throwable e [e nil]))))
                  (filter first)
                  (map first))
        _ (when (-> errs count pos?)
            (throw (ex-info (->> errs
                                 (map #(.getMessage %))
                                 (clojure.string/join ","))
                            {})))
        ctx (->> key-list
                 (map (comp eval :action conditions))
                 (zipmap key-list)
                 (reduce (fn [ctx [key action-fn]]
                           (action-fn ctx runtime (selections key)))
                         ctx))
        action-fn (-> text :action eval)
        ctx (if (not action-fn)
              ctx
              (action-fn ctx runtime))]
    ctx))

(defn test-script-eval []
  (let [card-proto-example
        [""
         {:gsign [:blue :UC]
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
                                     (game.define.dynamic/cut-in ctx ["effect-id1"
                                                                      {:reason [:trigger-by-card-id this-card-id]
                                                                       :is-immediate true
                                                                       :clear-cutin-status false
                                                                       :text ["text-2"
                                                                              {:description "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                               :type :system 
                                                                               :conditions {"condition-1"
                                                                                            {:tips `(fn [~'ctx ~'runtime]
                                                                                                      ~option-ids)
                                                                                             :count 1
                                                                                             :options nil
                                                                                             :action `(fn [~'ctx ~'runtime ~'selection]
                                                                                                        (game.define.dynamic/add-text ~'ctx ["text-id"
                                                                                                                                             {:type :system
                                                                                                                                              :events [(read-string (str "(fn [ctx runtime evt] (match evt [:on-end-turn info] (app.dynamic/delete-text ctx \"text-id\") :else ctx))"))]
                                                                                                                                              :game-effects [`(fn [~~''ctx ~~''runtime]
                                                                                                                                                                (for [~~''card-id ~~'selection]
                                                                                                                                                                  [:add-battle-point ~~''card-id ~~battle-point]))
                                                                                                                                                             (read-string (str "(fn [ctx runtime] (for [card-id " ~'selection "] [:add-battle-point card-id " ~battle-point "]))"))
                                                                                                                                                             (list ~''fn [~''ctx ~''runtime]
                                                                                                                                                                   (list ~''for [~''card-id ~'selection]
                                                                                                                                                                         [:add-battle-point ~''card-id ~battle-point]))]}]))}}}]}])
                                     ctx)]
                           ctx)
                         :else
                         ctx))]}}}]
        _ (s/assert ::value (second card-proto-example))
        effect (atom nil)
        added-text (atom nil)
        _ (binding [game.define.dynamic/cut-in (fn [ctx eff]
                                                 (s/assert ::effect eff)
                                                 (reset! effect eff)
                                                 ctx)
                    game.define.dynamic/add-text (fn [ctx text]
                                                   (s/assert ::text text)
                                                   (reset! added-text text)
                                                   ctx)]
            (let [ctx {}
                  runtime {:card-id "gundam"}
                  script (-> card-proto-example str read-string second :texts (get "text-1") :events first)
                  eventF (eval script)
                  _ (eventF ctx runtime [:on-gain {:battle-point [1 1 0]}])
                  {option-ids-script :tips action-script :action} (-> @effect second :text second :conditions (get "condition-1"))
                  option-ids-fn (eval option-ids-script)
                  option-ids (option-ids-fn ctx runtime)
                  action-fn (eval action-script)
                  _ (action-fn ctx runtime option-ids)
                  effect-script (-> @added-text second :game-effects first)
                  effect-fn (eval effect-script)
                  game-effects (effect-fn ctx runtime)
                  _ (when (not (= game-effects (list [:add-battle-point "zaku" [1 1 0]] [:add-battle-point "gundam" [1 1 0]])))
                      (throw (ex-info "effects not right" {})))]))]))


(defn test-do-logic []
  (let [ctx {}
        runtime {}
        card-proto ["gundam"
                    {:texts {"gundam-text-1"
                             {:type [:special [:psycommu 3]]
                              :events ['(fn [ctx runtime evt])]
                              :game-effects []
                              :conditions {"1"
                                           {:tips '(fn [ctx runtime]
                                                     [:card "0" "1"])
                                            :count 1
                                            :options {:player :own}
                                            :action '(fn [ctx runtime selection]
                                                       #_(throw (ex-info "not in 2" {}))
                                                       ctx)}
                                           "in-battle-phase"
                                           {:options {:player :enemy}
                                            :action '(fn [ctx runtime selection]
                                                       #_(throw (ex-info "not in" {}))
                                                       ctx)}}
                              :logic '(And (Leaf "1")
                                           (Leaf "in-battle-phase"))
                              :action '(fn [ctx runtime])}
                             "gundam-text-2"
                             {:type [:special [:psycommu 3]]}}
                     :type :graphic
                     :gsign [:blue :UC]
                     :battle-point [2 1 2]
                     :char "gundam xx ee"
                     :cost [:normal [:blue :blue nil nil nil]]
                     :pack :gundam}]
        _ (s/assert ::value (second card-proto))
        _ (do-logic ctx runtime card-proto "gundam-text-1"
                    '(And (Leaf "1")
                          (Leaf "in-battle-phase"))
                    {"1" [:card "1"]
                     "in-battle-phase" [:player-yes "ok"]})]))

(defn tests []
  (test-do-logic)
  (test-script-eval))
