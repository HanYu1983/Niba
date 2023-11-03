(ns app.card-proto
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.string]
            [app.dynamic]
            [lib.logic-tree]
            [lib.util :refer [return->]]))


(s/def ::condition  (s/keys :req-un [::action]
                            :opt-un [::tips ::count ::options]))
(s/def ::conditions (s/map-of any? ::condition))
(s/def ::text (s/keys :req-un [::type]
                      :opt-un [::events ::game-effects ::conditions ::logic ::action]))
(s/def ::texts (s/map-of any? ::text))
(s/def ::card-proto (s/keys :req-un [::type ::gsign ::char ::texts]
                            :opt-un [::battle-point ::cost ::pack]))

(def card-proto-example ["gundam"
                         {:texts {"gundam-text-1"
                                  {:type [:abi1 3]
                                   :events ['(fn [ctx runtime evt])]
                                   :game-effects []
                                   :conditions {"1"
                                                {:tips '()
                                                 :count 1
                                                 :options {}
                                                 :action '(fn [ctx runtime])}
                                                "in-battle-phase"
                                                {:action '(fn [ctx runtime]
                                                            (assert-in-battle-phase ctx))}}
                                   :logic '(And (Leaf "1")
                                                (Leaf "in-battle-phase"))
                                   :action '(fn [ctx runtime])}
                                  "gundam-text-2"
                                  {:type [:abi1 4]}}
                          :type :G
                          :gsign [:blue :UC]
                          :battle-point [2 1 2]
                          :char "gundam xx ee"
                          :cost [:normal [:blue :blue nil nil nil]]
                          :pack :gundam}])

(s/def ::effect (s/keys :req-un [::id ::reason ::is-immediate ::clear-cutin-status ::text]))

(def card-proto-example-2 [""
                           {:texts {"text-1"
                                    {:description "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                     :phase :trigger
                                     :events ['(fn [ctx runtime evt]
                                                 (clojure.core.match/match evt
                                                   [:on-gain {:battle-point battle-point}]
                                                   (let [this-card-id (-> runtime :card-id)
                                                         option-ids ["zaku" "gundam"]
                                                         ctx (if (-> option-ids count pos?)
                                                               (app.dynamic/cut-in ctx ["effect-id1" {:reason [:trigger-by-card-id this-card-id]
                                                                                                      :is-immediate true
                                                                                                      :clear-cutin-status false
                                                                                                      :text ["text-2"
                                                                                                             {:description "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                                                              :conditions {"condition-1"
                                                                                                                           {:tips `(fn [~'ctx ~'runtime]
                                                                                                                                     ~option-ids)
                                                                                                                            :count 1
                                                                                                                            :options nil
                                                                                                                            :action `(fn [~'ctx ~'runtime ~'selection]
                                                                                                                                       (app.dynamic/add-text ~'ctx ["text-id" {:events [(read-string (str "(fn [ctx runtime evt] 
                                                                                                                                                                                             (match evt
                                                                                                                                                                                             [:on-end-turn info]
                                                                                                                                                                                             (app.dynamic/delete-text ctx \"text-id\")
                                                                                                                                                                                             :else
                                                                                                                                                                                             ctx))"))]
                                                                                                                                                                               :game-effects [(read-string (str "(fn [ctx runtime] 
                                                                                                                                                                                                   (for [card-id " ~'selection "] [:add-battle-point card-id " ~battle-point " '(fn [ctx])]))"))
                                                                                                                                                                                              `(fn [~~''ctx ~~''runtime]
                                                                                                                                                                                                 (for [~~''card-id ~~'selection]
                                                                                                                                                                                                   [:add-battle-point ~~''card-id ~~battle-point `(fn [~~~'''ctx])]))
                                                                                                                                                                                              (list ~''fn [~''ctx ~''runtime]
                                                                                                                                                                                                    (list ~''for [~''card-id ~'selection]
                                                                                                                                                                                                          [:add-battle-point ~''card-id ~battle-point]))]}]))}}}]}])
                                                               ctx)]
                                                     ctx)
                                                   :else
                                                   ctx))]}}}])


(defn test-script-eval []
  (let [effect (atom nil)
        added-text (atom nil)
        _ (binding [app.dynamic/cut-in (fn [ctx eff]
                                         (reset! effect eff)
                                         ctx)
                    app.dynamic/add-text (fn [ctx text]
                                           (reset! added-text text)
                                           ctx)
                    ;app.dynamic/set-selection (fn [ctx k v])
                    ]
            (let [ctx {}
                  runtime {:card-id "gundam"}
                  script (-> card-proto-example-2 str read-string second :texts (get "text-1") :events first)
                  _ (println script)
                  eventF (eval script)
                  _ (eventF ctx runtime [:on-gain {:battle-point [1 1 0]}])
                  {option-ids-script :tips action-script :action} (-> @effect second :text second :conditions (get "condition-1"))
                  _ (println "=============================")
                  _ (println (macroexpand option-ids-script))
                  _ (println "=============================")
                  _ (println (macroexpand action-script))
                  option-ids-fn (eval option-ids-script)
                  option-ids (option-ids-fn ctx runtime)
                  action-fn (eval action-script)
                  ;_ (app.dynamic/set-selection ctx "condition-1" option-ids)
                  _ (action-fn ctx runtime option-ids)
                  [effect-script & _] (-> @added-text :effects)
                  _ (println "=============================")
                  _ (println effect-script)
                  _ (println (macroexpand effect-script))
                  effect-fn (eval effect-script)
                  _ (println (effect-fn ctx runtime))]))]))



(defn do-logic [ctx runtime card-proto text-id logic selections]
  (let [text (-> card-proto second :texts (get text-id))
        conditions (-> text :conditions)
        key-list (keys selections)
        has-logic (lib.logic-tree/has logic key-list)
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


(defn test-all []
  (let [_ (s/explain ::card-proto (second card-proto-example))])
  (let [ctx {}
        runtime {}
        card-proto ["gundam"
                    {:texts {"gundam-text-1"
                             {:type [:abi1 3]
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
                             {:type [:abi1 4]}}
                     :type :G
                     :gsign [:blue :UC]
                     :battle-point [2 1 2]
                     :char "gundam xx ee"
                     :cost [:normal [:blue :blue nil nil nil]]
                     :pack :gundam}]
        _ (do-logic ctx runtime card-proto "gundam-text-1"
                    '(And (Leaf "1")
                          (Leaf "in-battle-phase"))
                    {"1" [:card "1"]
                     "in-battle-phase" [:player-yes "ok"]})]))