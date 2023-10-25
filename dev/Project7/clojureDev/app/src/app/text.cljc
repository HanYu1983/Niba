(ns app.text
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]))





;  （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
(def test-script-1 [{:id "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
                     :description "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
                     :phase :battle-phase
                     :payment {"〔２〕" ['(fn [ctx] []) 2 {:player :you} '(fn [ctx selection] (rollG ctx selection))]}
                     :condition {"このセットグループのユニットは、"
                                 [[:and ["〔２〕"]]
                                  '(fn [ctx]
                                     (cut-in ctx {:id "effect-id"
                                                  :text {:id "ターン終了時まで「速攻」を得る。"
                                                         :description nil
                                                         :actions ['(fn [ctx]
                                                                      (update-memory ctx (runtime/get-card-id ctx) #(assoc % :activate-speed-attack 1)))
                                                                   '(fn [ctx]
                                                                      (add-text ctx {:id "ターン終了時まで"
                                                                                     :description nil
                                                                                     :events ['(fn [ctx]
                                                                                                 ; dissoc activate-speed-attack
                                                                                                 ctx)]}))]}}))]}
                     :effects ['(fn [ctx]
                                  (when (-> ctx (get-memory (runtime/get-card-id ctx)) :activate-speed-attack)
                                    [:speed-attack (runtime/get-card-id ctx)]))]}])

(def test-script-2 [{:id :ps-armor
                     :description "PS Armor"
                     :phase nil
                     :replace [{:id "出場時直立"
                                :events ['(fn [ctx runtime evt]
                                            (let [this-card-id (-> runtime :card-id option/get)
                                                  ctx (match evt
                                                        [:on-play-to-position (_ :guard #(= % this-card-id))] (reroll ctx this-card-id)
                                                        :else ctx)]
                                              ctx))]}
                               {:id "到戰區時下回合開始時回手, 但如果有和補給或供給組成部隊時不必回手"
                                :events ['(fn [ctx runtime evt]
                                            (let [this-card-id (-> runtime :card-id option/get)
                                                  ctx (match evt
                                                        [:on-enter-battle-area (_ :guard #(= % this-card-id))]
                                                        (update-memory ctx this-card-id #(assoc % :return-to-hand-by-psArmor 1))
                                                        :else ctx)]
                                              ctx))
                                         '(fn [ctx runtime evt]
                                            (match evt
                                              [:on-battle-group group-id]
                                              (let [this-card-id (-> runtime :card-id option/get)
                                                    group (-> ctx (get-group group-id))
                                                    ctx (if (and (-> group (contains? this-card-id))
                                                                 (-> group (contains-supply)))
                                                          (update-memory ctx this-card-id (dissoc % :return-to-hand-by-psArmor))
                                                          ctx)])
                                              :else ctx))
                                         '(fn [ctx runtime evt]
                                            (match evt
                                              [:on-turn-start]
                                              (let [this-card-id (-> runtime :card-id option/get)
                                                    ctx (if (-> ctx (get-memory this-card-id) :return-to-hand-by-psArmor nil? not)
                                                          (return-to-hand ctx this-card-id)
                                                          ctx)])
                                              :else ctx))]}]}])

(s/def ::ctx-runtime-script (fn [[f [a1 a2 & _] & _]]
                              (or (= ['fn 'ctx 'runtime] [f a1 a2])
                                  (= ['clojure.core/fn 'ctx 'runtime] [f a1 a2]))))
(s/def ::payments (s/map-of string? (s/coll-of (s/tuple ::ctx-runtime-script (s/nilable int?) any? ::ctx-runtime-script))))
(s/def ::events (s/coll-of ::ctx-runtime-script))
(s/def ::replace (s/coll-of ::text))
(s/def ::text (s/keys :req-un [::id]
                      :opt-un [::description ::phase ::payments ::events ::condition ::effects ::replace]))
(s/def ::texts (s/coll-of ::text))


; 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。
(def test-script-3 [{:id "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                     :description nil
                     :phase nil
                     :events ['(fn [ctx runtime evt]
                                 (clojure.core.match/match evt
                                   [:on-gain {:battle-point battle-point}]
                                   (let [this-card-id (-> runtime :card-id)
                                         option-ids ["zaku" "gundam"]
                                         ctx (if (-> option-ids count pos?)
                                               (app.dynamic/cut-in ctx {:id "effect-id"
                                                                        :reason [:trigger-by-card-id this-card-id]
                                                                        :is-immediate true
                                                                        :clear-cut-in-status false
                                                                        :text {:id "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                               :description nil
                                                                               :payments {"そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                                          [`(fn [~'ctx ~'runtime]
                                                                                              ~option-ids)
                                                                                           1 nil
                                                                                           `(fn [~'ctx ~'runtime ~'selection]
                                                                                              (app.dynamic/add-text ~'ctx "text-id" {:events [(read-string (str "(fn [ctx runtime evt] 
                                                                                                                                                                        (match evt
                                                                                                                                                                        [:on-end-turn info]
                                                                                                                                                                        (app.dynamic/delete-text ctx \"text-id\")

                                                                                                                                                                        :else
                                                                                                                                                                        ctx))"))]
                                                                                                                                     :effects [(read-string (str "(fn [ctx runtime] 
                                                                                                                                                                         (for [card-id " ~'selection "] [:add-battle-point card-id " ~battle-point " '(fn [ctx])]))"))
                                                                                                                                               `(fn [~~''ctx ~~''runtime]
                                                                                                                                                  (for [~~''card-id ~~'selection]
                                                                                                                                                    [:add-battle-point ~~''card-id ~~battle-point `(fn [~~~'''ctx])]))
                                                                                                                                               (list ~''fn [~''ctx ~''runtime]
                                                                                                                                                     (list ~''for [~''card-id ~'selection]
                                                                                                                                                           [:add-battle-point ~''card-id ~battle-point]))]}))]}}})
                                               ctx)]
                                     ctx)
                                   :else
                                   ctx))]}])

(defn test-script-eval []
  (let [effect (atom nil)
        added-text (atom nil)
        _ (binding [app.dynamic/cut-in (fn [ctx eff]
                                         (reset! effect eff)
                                         ctx)
                    app.dynamic/add-text (fn [ctx text-id text]
                                           (reset! added-text text)
                                           ctx)]
            (let [ctx {}
                  runtime {:card-id "gundam"}
                  script (-> test-script-3 str read-string first :events first)
                  ;_ (println script)
                  eventF (eval script)
                  _ (eventF ctx runtime [:on-gain {:battle-point [1 1 0]}])
                  [option-ids-script _ _ action-script] (-> @effect :text :payments first second)
                  _ (println "=============================")
                  _ (println (macroexpand option-ids-script))
                  _ (println "=============================")
                  _ (println (macroexpand action-script))
                  option-ids-fn (eval option-ids-script)
                  option-ids (option-ids-fn ctx runtime)
                  action-fn (eval action-script)
                  _ (action-fn ctx runtime option-ids)
                  [effect-script & _] (-> @added-text :effects)
                  _ (println "=============================")
                  _ (println effect-script)
                  _ (println (macroexpand effect-script))
                  effect-fn (eval effect-script)
                  _ (println (effect-fn ctx runtime))]))]))


(defn test-spec []
  (s/explain ::ctx-runtime-script `(fn [~'ctx ~'runtime]))
  (s/explain ::ctx-runtime-script '(fn [ctx runtime]))
  (s/explain ::texts test-script-2)
  (s/explain ::texts test-script-3))

(defn test []
  (test-spec)
  #_(test-script-eval))