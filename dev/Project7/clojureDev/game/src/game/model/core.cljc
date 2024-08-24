(ns game.model.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core :refer [read-string]]
            [clojure.core.match :refer [match]]
            [tool.card.table :as table]
            [tool.component.table :refer [get-table]]
            [tool.component.item-group :refer [create-item-group]]
            [game.data.core]
            [game.data.dynamic]
            [game.define.runtime :as runtime]
            [game.define.card :as card]
            [game.define.card-text :as card-text]
            [game.define.timing]
            [game.define.card-proto :as card-proto]
            [game.define.game-effect]
            [game.define.effect :as effect]
            [game.define.selection :as selection]
            [game.define.tip :as tip]
            [game.model.effect :refer [get-top-cut]]
            [game.model.phase]
            [game.model.current-player]
            [game.model.card-table :refer [get-card get-card-protos-by-ids add-card]]
            [game.model.table :refer [create-table
                                      get-item-controller
                                      get-item-ids-by-ba-syou-keyword
                                      get-card-controller
                                      get-cards-by-ba-syou
                                      get-card-ids-by-player-id
                                      get-effect-runtime
                                      get-reason-runtime]]
            [game.model.setgroup :refer [get-setgroup set-setgroup-character]]
            [game.model.selection :refer [create-selections get-selection set-selection]]))

(defn create-model []
  (->> {:cuts []
        :effects {}
        :table-items {}
        :phase [:reroll :start]
        :current-player-id :A
        :card-proto-pool {}}
       (merge (create-table)
              (create-item-group)
              (create-selections))
       (s/assert :game.model-spec.core/is-model)))

(defn get-runtime-card-id [_ctx runtime]
  (runtime/get-card-id runtime))

(defn get-runtime-player-id [_ctx runtime]
  (runtime/get-player-id runtime))

(defn get-card-proto [ctx card-id]
  (-> ctx (get-card card-id) card/get-proto-id game.data.core/get-card-data))

(defn get-card-basyou [ctx card-id]
  (-> ctx get-table (table/get-deck-id-by-card-id card-id)))

(defn get-card-type [ctx card-id]
  (-> ctx (get-card-proto card-id) card-proto/get-type))

(defn get-card-runtime-type [ctx card-id]
  (-> ctx
      (get-card-basyou card-id)
      (match [_ :g-zone] :graphic :else (get-card-type ctx card-id))
      (#(s/assert :game.define.card-proto/type %))))

(defn perform-text-logic [ctx text logic-id runtime]
  (let [logic (-> text card-text/get-logics (get logic-id))
        conditions (-> text (card-text/get-logic-conditions logic))
        #__ #_(->> conditions (map (fn [[condition-id condition]]
                                     (let [tips-fn (card-text/get-condition-tips condition)
                                           tips (->> (tips-fn ctx runtime) (s/assert :game.model-spec.core/tips))
                                           tip-ids (->> tips (map tip/get-id))
                                           tip-selections (->> tip-ids (map #(get-selection ctx %)) (zipmap tip-ids))
                                           action-fn (card-text/get-condition-action condition)
                                           ctx (action-fn ctx runtime)]
                                       ctx)))
                   doall)
        ; 支付
        _ (->> conditions vals (map card-text/get-condition-tips)
               (map (fn [f] (or f identity)))
               (map (fn [f] (f ctx runtime))) doall)
        ctx (->> conditions vals (map card-text/get-condition-action)
                 (map (fn [f] (or f identity)))
                 (reduce (fn [ctx f] (f ctx runtime)) ctx))
        ; 效果發生
        ctx (-> logic (card-text/get-logic-action) (#(% ctx runtime)))]
    ctx))

(defn get-unit-character-count [ctx card-id]
  (-> ctx (get-card-runtime-type card-id) (= :unit)
      (or (throw (ex-info "must be unit" {:card-id card-id :runtime-type (get-card-runtime-type ctx card-id)}))))
  (-> ctx (get-setgroup card-id) (->> (remove #{card-id})
                                      (map #(get-card-runtime-type ctx %))
                                      (filter #{:character})
                                      count)))

(defn get-unit-max-character-count [ctx card-id] 1)

(defn get-unit-can-set-character [ctx card-id]
  (-> ctx (get-unit-character-count card-id) (< (get-unit-max-character-count ctx card-id))))

(defn get-my-units [ctx player-id]
  (->> (get-card-ids-by-player-id ctx player-id)
       (filter (fn [card-id]
                 (->> (get-card-runtime-type ctx card-id) (= :unit))))))

(defn get-my-units-can-set-character [ctx player-id]
  (->> (get-my-units ctx player-id)
       (filter (fn [card-id]
                 (< (get-unit-character-count ctx card-id) (get-unit-max-character-count ctx card-id))))))

; card-text helper
(defn get-play-g-text [ctx runtime])

(defn get-play-card-text [ctx _player-id card-id]
  (let [card-runtime-type (get-card-runtime-type ctx card-id)
        common-conditions {"合計國力6"
                           {:tips '(fn [ctx runtime] [])
                            :action '(fn [ctx runtime]
                                       (println "合計國力6")
                                       #_(-> ctx game.data.dynamic/get-my-g count (> 6))
                                       ctx)}
                           "横置3個藍G"
                           {:tips '(fn [ctx runtime]
                                     #_(-> ctx game.data.dynamic/get-my-g-can-tap)
                                     [])
                            :action '(fn [ctx runtime]
                                       (println "横置3個藍G")
                                       ctx)}
                           "在手牌或hanger"
                           {:tips '(fn [ctx runtime] []) :action '(fn [ctx runtime] ctx)}
                           "在配備階段"
                           {:tips '(fn [ctx runtime] []) :action '(fn [ctx runtime] ctx)}
                           "放到play-card-zone"
                           {:tips '(fn [ctx runtime] [])
                            :action '(fn [ctx runtime]
                                       (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                             player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                             ctx (-> ctx (game.data.dynamic/move-card [player-id :te-hu-ta] [player-id :played-card] card-id))]
                                         ctx))}}
        text (condp = card-runtime-type
               :graphic
               {:type :system
                :conditions {"是否沒出過G"
                             {:action '(fn [ctx runtime])}}
                :logics {"放到g-zone"
                         {:logic-tree '(And (Leaf "是否沒出過G"))
                          :action '(fn [ctx runtime]
                                     (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                           player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                           ctx (-> ctx (game.data.dynamic/move-card [player-id :te-hu-ta] [player-id :g-zone] card-id))]
                                       ctx))}}}


               :unit
               {:type :system
                :conditions common-conditions
                :logics {"出機體"
                         {:logic-tree '(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "在手牌或hanger") (Leaf "在配備階段") (Leaf "放到play-card-zone"))
                          :action '(fn [ctx runtime]
                                     (game.data.dynamic/cut-in ctx "出機體"
                                                               (->> {:reason [:play-card "" ""]
                                                                     :text (->> {:type :system
                                                                                 :logics {"移到場上"
                                                                                          {:action '(fn [ctx runtime]
                                                                                                      (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                                                                                            player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                                                                            ctx (-> ctx (game.data.dynamic/move-card [player-id :played-card] [player-id :maintenance-area] card-id))]
                                                                                                        ctx))}}}
                                                                                (merge game.define.card-text/card-text-value)
                                                                                (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                    (merge game.define.effect/effect-value)
                                                                    (clojure.spec.alpha/assert :game.define.effect/value))))}}}

               :command
               {:type :system
                :conditions common-conditions
                :logics {"出指令"
                         {:logic-tree '(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "在手牌或hanger") (Leaf "在配備階段") (Leaf "放到play-card-zone"))
                          :action `(fn [~'ctx ~'runtime]
                                     (let [~'card-id (game.data.dynamic/get-runtime-card-id ~'ctx ~'runtime)
                                           ~'player-id (game.data.dynamic/get-runtime-player-id ~'ctx ~'runtime)]
                                       (game.data.dynamic/cut-in ~'ctx "出指令"
                                                                 (->> {:reason [:play-card ~'player-id ~'card-id]
                                                                       :text (->> {:type :system
                                                                                   :logics {"移到墓地並發動指令效果"
                                                                                            {:action `(fn [~~''ctx ~~''runtime]
                                                                                                        (let [~~''card-id (game.data.dynamic/get-runtime-card-id ~~''ctx ~~''runtime)
                                                                                                              ~~''player-id (game.data.dynamic/get-runtime-player-id ~~''ctx ~~''runtime)
                                                                                                              ~~''ctx (-> ~~''ctx (game.data.dynamic/move-card [~~''player-id :played-card] [~~''player-id :junk-yard] ~~''card-id))
                                                                                                              ~~''command-action (-> ~~''ctx (get-card-proto ~~''card-id) card-proto/get-command-action-script eval)
                                                                                                              ~~''ctx (~~''command-action ~~''ctx ~~''runtime)]
                                                                                                          ~~''ctx))}}}
                                                                                  (merge game.define.card-text/card-text-value)
                                                                                  (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                      (merge game.define.effect/effect-value)
                                                                      (clojure.spec.alpha/assert :game.define.effect/value)))))}}}

               :character
               {:type :system
                :conditions (->> {"選一個機體"
                                  {:tips '(fn [ctx runtime]
                                            (let [player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                  card-ids (game.data.dynamic/get-my-units-can-set-character ctx player-id)
                                                  card-ids-with-basyou (->> card-ids (map #(game.data.dynamic/get-card-basyou ctx %)) (zipmap card-ids))]
                                              [[:select-one-unit `[:unit ~@card-ids-with-basyou] [:count 1]]]))
                                   :action '(fn [ctx runtime]
                                              ctx)}}
                                 (merge common-conditions))
                :logics {"出角色"
                         {:logic-tree '(And (Leaf "選一個機體") (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "在手牌或hanger") (Leaf "在配備階段") (Leaf "放到play-card-zone"))
                          :action
                          '(fn [ctx runtime]
                             (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                   player-id (game.data.dynamic/get-runtime-player-id ctx runtime)]
                               (game.data.dynamic/cut-in ctx "出角色"
                                                         (->> {:reason [:play-card player-id card-id]
                                                               :text (->> {:type :system
                                                                           :logics {"出角色"
                                                                                    {:action '(fn [ctx runtime]
                                                                                                (let [card-id (game.data.dynamic/get-runtime-card-id ctx runtime)
                                                                                                      player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                                                                      selection (game.data.dynamic/get-selection ctx :select-one-unit)
                                                                                                      options (game.define.tip/get-tip-selection-items selection)
                                                                                                      _ (-> options count pos? (or (throw (ex-info "options must has 1" {}))))
                                                                                                      [[target-unit target-basyou]] options
                                                                                                      from-basyou (game.data.dynamic/get-card-basyou ctx card-id)
                                                                                                      ctx (-> ctx
                                                                                                              (game.data.dynamic/move-card from-basyou target-basyou card-id)
                                                                                                              (game.data.dynamic/set-setgroup-character target-unit card-id))]
                                                                                                  ctx))}}}
                                                                          (merge game.define.card-text/card-text-value)
                                                                          (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                              (merge game.define.effect/effect-value)
                                                              (clojure.spec.alpha/assert :game.define.effect/value)))))

                          #_`(fn [~'ctx ~'runtime]
                               (let [~'card-id (game.data.dynamic/get-runtime-card-id ~'ctx ~'runtime)
                                     ~'player-id (game.data.dynamic/get-runtime-player-id ~'ctx ~'runtime)]
                                 (game.data.dynamic/cut-in ~'ctx "出角色"
                                                           (->> {:reason [:play-card ~'player-id ~'card-id]
                                                                 :text (->> {:type :system
                                                                             :logics {"出角色"
                                                                                      {:action `(fn [~~''ctx ~~''runtime]
                                                                                                  (let [~~''card-id (game.data.dynamic/get-runtime-card-id ~~''ctx ~~''runtime)
                                                                                                        ~~''player-id (game.data.dynamic/get-runtime-player-id ~~''ctx ~~''runtime)
                                                                                                        ~~''selection (game.data.dynamic/get-selection ~~''ctx :select-one-unit)
                                                                                                        ~~''_ (println ~~''selection)
                                                                                                                                        ;~~''ctx (-> ~~''ctx (game.data.dynamic/move-card [~~''player-id :played-card] [~~''player-id :junk-yard] ~~''card-id))
                                                                                                        ]
                                                                                                    ~~''ctx))}}}
                                                                            (merge game.define.card-text/card-text-value)
                                                                            (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                (merge game.define.effect/effect-value)
                                                                (clojure.spec.alpha/assert :game.define.effect/value)))))}}}

               (throw (ex-info "not impl yet" {:card-runtime-type card-runtime-type})))
        _ (s/assert :game.define.card-text/value text)]
    text))

(defn test-play-card-text []
  (let [player-a :A
        card-id "0"
        ctx (create-model)
        ctx (-> ctx (add-card [player-a :te-hu-ta] card-id (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})))
        play-card-text (-> ctx (get-play-card-text player-a card-id))
        runtime (get-reason-runtime ctx [:play-card player-a card-id])
        logic-id (-> play-card-text card-text/get-logics-ids first)
        ctx (perform-text-logic ctx play-card-text logic-id runtime)
        _ (-> ctx (get-cards-by-ba-syou [player-a :te-hu-ta]) count zero? (or (throw (ex-info "player-a te-hu-ta must 0" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :played-card]) count (= 1) (or (throw (ex-info "player-a played-card must 1" {}))))]))

(defn test-play-card-text-2 []
  (let [player-a :A
        card-id "0"
        ctx (create-model)
        ctx (-> ctx (add-card [player-a :te-hu-ta] card-id (merge (card/create) {:proto-id "test_command"})))
        text (-> ctx (get-play-card-text player-a card-id))
        logic-id (-> text card-text/get-logics-ids first)
        runtime (get-reason-runtime ctx [:play-card player-a card-id])
        ctx (perform-text-logic ctx text logic-id runtime)
        _ (-> ctx (get-cards-by-ba-syou [player-a :te-hu-ta]) count zero? (or (throw (ex-info "player-a te-hu-ta must 0" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :played-card]) count (= 1) (or (throw (ex-info "player-a played-card must 1" {}))))
        _ (-> ctx get-top-cut count (= 1) (or (throw (ex-info "must has cut 1" {}))))
        ctx (-> ctx str read-string)
        top-effect (-> ctx get-top-cut first)
        text (effect/get-text top-effect)
        logic-id (-> text card-text/get-logics-ids first)
        runtime (get-effect-runtime ctx top-effect)
        ctx (perform-text-logic ctx text logic-id runtime)
        _ (-> ctx (get-cards-by-ba-syou [player-a :played-card]) count zero? (or (throw (ex-info "player-a played-card must 0" {}))))
        _ (-> ctx (get-cards-by-ba-syou [player-a :junk-yard]) count (= 1) (or (throw (ex-info "player-a junk-yard must 1" {}))))]))

(defn test-play-card-text-empty-character []
  (let [player-a :A
        player-b :B
        character-card-id "0"
        player-a-unit-0 "player-a-unit-0"
        player-a-unit-1 "player-a-unit-1"
        player-b-unit-1 "player-b-unit-1"
        character-card-id2 "character-card-id2"
        ctx (create-model)
        ctx (-> ctx
                (add-card [player-a :te-hu-ta] character-card-id (merge (card/create) {:proto-id "empty_character"}))
                (add-card [player-a :maintenance-area] player-a-unit-0 (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"}))
                (add-card [player-a :maintenance-area] player-a-unit-1 (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"}))
                (add-card [player-b :maintenance-area] player-b-unit-1 (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})))
        text (-> ctx (get-play-card-text player-a character-card-id))
        condition (-> text card-text/get-conditions (get "選一個機體") (or (throw (ex-info "選一個機體 condition must exist" {}))))
        ; player-a
        runtime (get-reason-runtime ctx [:play-card player-a character-card-id])
        tips (-> condition card-text/get-condition-tips (#(% ctx runtime))
                 (->> (s/assert :game.model-spec.core/tips)))
        _ (-> tips first tip/get-tip-selection tip/get-tip-selection-items-unit-id (= [player-a-unit-0 player-a-unit-1]) (or (throw (ex-info "must be player-a-unit-0 player-a-unit-1" {}))))
        ctx (-> ctx
                (add-card [player-a :maintenance-area] character-card-id2 (merge (card/create) {:proto-id "empty_character"}))
                (set-setgroup-character player-a-unit-0 character-card-id2))
        tips (-> condition card-text/get-condition-tips (#(% ctx runtime))
                 (->> (s/assert :game.model-spec.core/tips)))
        tip (-> tips first)
        _ (-> tip tip/get-tip-selection tip/get-tip-selection-items-unit-id (= [player-a-unit-1]) (or (throw (ex-info "must be player-a-unit-1" {}))))
        ; will set character
        [selection-id selection] (-> tip ((juxt tip/get-id tip/get-tip-selection)))
        ctx (-> ctx (set-selection selection-id selection))
        logic (-> text card-text/get-logics (get "出角色") (or (throw (ex-info "出角色 logic must exist" {}))))
        logic-action-fn (-> logic card-text/get-logic-action)
        ; cut-in
        ctx (logic-action-fn ctx runtime)
        _ (-> ctx get-top-cut count (= 1) (or (throw (ex-info "must has cut 1" {}))))
        ctx (-> ctx str read-string)
        ; handle cut effect
        _ (-> (get-setgroup ctx character-card-id) (= #{character-card-id}) (or (throw (ex-info "setgroup must have character-card-id" {}))))
        top-effect (-> ctx get-top-cut first)
        top-text (effect/get-text top-effect)
        top-logic (-> top-text card-text/get-logics (get "出角色") (or (throw (ex-info "出角色 logic must exist" {}))))
        top-logic-action-fn (-> top-logic card-text/get-logic-action)
        ctx (top-logic-action-fn ctx (get-effect-runtime ctx top-effect))
        ; 確認設定了駕駛
        _ (-> (get-setgroup ctx character-card-id) (= #{character-card-id player-a-unit-1}) (or (throw (ex-info "setgroup must have character-card-id player-a-unit-1" {}))))
        ; player-b
        runtime (get-reason-runtime ctx [:play-card player-b character-card-id])
        tips (-> condition card-text/get-condition-tips (#(% ctx runtime))
                 (->> (s/assert :game.model-spec.core/tips)))
        tip (-> tips first)
        _ (-> tip tip/get-tip-selection tip/get-tip-selection-items-unit-id (= [player-b-unit-1]) (or (throw (ex-info "must be player-b-unit-1" {}))))]))


(defn get-attack-phase-rule-effect [player-id]
  (let [effect {:reason [:system player-id]
                :text {:type :system
                       :conditions {"選擇機體出擊到地球"
                                    {:tips '(fn [ctx runtime]
                                              (let [player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                    card-ids (game.data.dynamic/get-my-units-can-go-earth ctx player-id)
                                                    card-ids-with-basyou (->> card-ids (map #(game.data.dynamic/get-card-basyou ctx %)) (zipmap card-ids))])
                                              [[:go-earth `[:unit ~@card-ids-with-basyou] [:count 0]]])
                                     :action '(fn [ctx runtime])}
                                    "選擇機體出擊到宇宙"
                                    {:tips '(fn [ctx runtime]
                                              (let [player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                    card-ids (game.data.dynamic/get-my-units-can-go-space ctx player-id)
                                                    card-ids-with-basyou (->> card-ids (map #(game.data.dynamic/get-card-basyou ctx %)) (zipmap card-ids))])
                                              [[:go-universe `[:unit ~@card-ids-with-basyou] [:count 0]]])
                                     :action '(fn [ctx runtime])}}
                       :logics {:logic-tree '(And (Leaf "選擇機體出擊到地球") (Leaf "選擇機體出擊到宇宙"))
                                :action '(fn [ctx runtime]
                                           (let [player-id (game.data.dynamic/get-runtime-player-id ctx runtime)
                                                 go-earth-card-ids-with-basyou (game.data.dynamic/get-selection ctx :go-earth)
                                                 go-universe-card-ids-with-basyou (game.data.dynamic/get-selection ctx :go-universe)
                                                 ctx (-> ctx
                                                         (game.data.dynamic/move-setgroup go-earth-card-ids-with-basyou [player-id :earth-area])
                                                         (game.data.dynamic/move-setgroup go-universe-card-ids-with-basyou [player-id :space-area]))]
                                             ctx))}}}
        _ (s/assert :game.define.effect/value effect)]
    effect))

(def get-deffence-phase-rule-effect get-attack-phase-rule-effect)

(defn get-return-phase-rule-effect []
  (let [effect {:reason [:system nil]
                :text {:type :system
                       :logics {:action '(fn [ctx runtime]
                                           (let [ctx (->> game.define.player/player-ids
                                                          (mapcat (fn [player-id] [(game.define.basyou/value-of player-id :earth-area)
                                                                                   (game.define.basyou/value-of player-id :space-area)]))
                                                          (map (fn [basyou]
                                                                 (fn [ctx]
                                                                   (let [card-ids (game.data.dynamic/get-setgroup-ids-by-basyou ctx basyou)
                                                                         card-ids-with-basyou (map #([% basyou]) card-ids)
                                                                         ctx (game.data.dynamic/move-setgroup ctx card-ids-with-basyou (game.define.basyou/update-ba-syou-keyword basyou :maintenance-area))]
                                                                     ctx))))
                                                          (reduce (fn [ctx f] (f ctx)) ctx))
                                                ;;  card-ids (->> [:earth-area :space-area]
                                                ;;                (mapcat #(game.data.dynamic/get-card-ids-by-basyou-keyword ctx %)))
                                                ;;  player-card-ids-pairs (->> (game.data.dynamic/get-card-controler ctx card-ids)
                                                ;;                             (zipmap card-ids)
                                                ;;                             (group-by (fn [[card-id controller]] controller))
                                                ;;                             ((apply juxt game.define.player/player-ids))
                                                ;;                             (clojure.spec.alpha/assert (clojure.spec.alpha/coll-of (clojure.spec.alpha/coll-of string?)))
                                                ;;                             (map (fn [card-id-controller-pairs]
                                                ;;                                    (map (fn [[card-id controller]]
                                                ;;                                           card-id)
                                                ;;                                         card-id-controller-pairs)))
                                                ;;                             (zipmap game.define.player/player-ids)
                                                ;;                             (clojure.spec.alpha/assert (clojure.spec.alpha/map-of :game.define.player/id (clojure.spec.alpha/coll-of string?))))
                                                ;;  ctx (->> player-card-ids-pairs
                                                ;;           (reduce (fn [ctx [player-id card-ids]]
                                                ;;                     (let [card-ids-with-basyou (->> (game.data.dynamic/get-card-basyou ctx card-ids)
                                                ;;                                                     (zipmap card-ids))
                                                ;;                           ctx (-> ctx (game.data.dynamic/move-setgroup card-ids-with-basyou [player-id :maintenance-area]))]
                                                ;;                       ctx))))
                                                 ]
                                             ctx))}}}
        _ (s/assert :game.define.effect/value effect)]
    effect))

(defn get-damage-checking-step-rule-effect [])


(defn test-179030_11E_U_BL209R_blue []
  (let [player-a :A
        card-id "0"
        ctx (create-model)
        card-proto (-> "179030_11E_U_BL209R_blue" game.data.core/get-card-data)
        [text-id text] (-> card-proto card-proto/get-texts first)
        game-effects-fns (-> text card-text/get-game-effects)
        runtime (get-reason-runtime ctx [:play-text player-a card-id text-id])
        game-effects (->> game-effects-fns (map (fn [f] (f ctx runtime))) (filter identity))
        _ (println game-effects)]))




(defn gen-game-effects-1 [ctx]
  (let [; g
        game-effects-1 (for [card-id (get-item-ids-by-ba-syou-keyword ctx :g-zone)]
                         (let [[card-proto] (get-card-protos-by-ids ctx [card-id])
                               texts (-> card-proto
                                         game.define.card-proto/get-texts
                                         (#(filter (fn [[name text]] (-> text game.define.card-text/is-surrounded-by-arrows)) %)))
                               game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                               runtime (game.define.runtime/value-of (get-card-controller ctx card-id) card-id)
                               game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                           game-effects))
        ; maintenance-area
        game-effects-2 (->> (for [card-id (get-item-ids-by-ba-syou-keyword ctx :maintenance-area)]
                              (let [[card-proto] (get-card-protos-by-ids ctx [card-id])
                                    texts (-> card-proto game.define.card-proto/get-texts)
                                    game-effects-fns (->> texts (mapcat (fn [[name text]] (game.define.card-text/get-game-effects text))))
                                    runtime (game.define.runtime/value-of (get-card-controller ctx card-id) card-id)
                                    game-effects (->> game-effects-fns (map #(% ctx runtime)))]
                                game-effects))
                            (mapcat identity)
                            (filter identity)
                            (s/assert (s/coll-of :game.define.game-effect/spec)))]
    game-effects-2))

(defn gen-game-effects-2 [ctx]
  (gen-game-effects-1 ctx))

(def gen-game-effects-memo (memoize gen-game-effects-2))


(defn get-card-item-type
  "取得卡片類型, 比如機體或指令"
  [ctx card-id])

(defn get-effect-card-item-type
  "取得效果的卡片類型, 比如機體效果或指令效果"
  [ctx effect]
  (s/assert ::spec ctx)
  (match (-> ctx game.define.effect/get-reason)
    [:system player-id] (throw (ex-info "" {} :abc))
    [:play-card player-id card-id] (-> ctx (get-card-item-type card-id))
    [:play-text player-id card-id text-id] (-> ctx (get-card-item-type card-id))
    [:text-effect card-id text-id] (-> ctx (get-card-item-type card-id))))

(defn can-not-be-moved-cards-ids [ctx effect])

;; 殺牌程移動牌在tips就要篩選掉
;; 自軍効果以外では破壊されずダメージを受けない
;; 敵軍ユニットの効果では破壊されずダメージを受けない
;; 敵軍コマンドの効果では破壊されず移動しない
;; DOTO: effect改為effect-controller
(defn can-not-be-destroyed-card-ids [ctx effect]
  (s/assert ::spec ctx)
  (->> ctx
       gen-game-effects-memo
       (filter (fn [game-effect]
                 (match game-effect
                   (:or ["敵軍効果では破壊されずダメージを受けない" card-ids & _]
                        ["自軍効果以外では破壊されずダメージを受けない" card-ids & _])
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         can-not-destroyed-card-ids (->> card-ids
                                                         (map #(get-item-controller ctx %))
                                                         (zipmap card-ids)
                                                         (filter (fn [[card-id player-b]]
                                                                   (not= player-a player-b)))
                                                         (map first))]
                     can-not-destroyed-card-ids)

                   ["敵軍ユニットの効果では破壊されずダメージを受けない" card-ids & _]
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         effect-card-item-type (->> effect (get-effect-card-item-type ctx))
                         can-not-destroyed-card-ids (condp = effect-card-item-type
                                                      :unit
                                                      (->> card-ids
                                                           (map #(get-item-controller ctx %))
                                                           (zipmap card-ids)
                                                           (filter (fn [[card-id player-b]]
                                                                     (not= player-a player-b)))
                                                           (map first))
                                                      [])]
                     can-not-destroyed-card-ids)

                   ["敵軍コマンドの効果では破壊されず移動しない" card-ids & _]
                   (let [player-a (-> effect game.define.effect/get-player-id)
                         effect-card-item-type (->> effect (get-effect-card-item-type ctx))
                         can-not-destroyed-card-ids (condp = effect-card-item-type
                                                      :command
                                                      (->> card-ids
                                                           (map #(get-item-controller ctx %))
                                                           (zipmap card-ids)
                                                           (filter (fn [[card-id player-b]]
                                                                     (not= player-a player-b)))
                                                           (map first))
                                                      [])]
                     can-not-destroyed-card-ids)

                   :else [])))
       (mapcat identity)
       (into {})))

(def can-not-be-destroyed-card-ids-memo (memoize can-not-be-destroyed-card-ids))



(defn tests []
  (test-play-card-text)
  (test-play-card-text-2)
  (test-play-card-text-empty-character)
  (test-179030_11E_U_BL209R_blue)
  (let [model (create-model)]
  ; test gen-game-effects
    (let [card (merge (card/create) {:proto-id "179030_11E_U_BL209R_blue"})
          ctx (-> model
                  (add-card [:A :maintenance-area] "0" card)
                  (add-card [:B :maintenance-area] "1" card))
          game-effects (gen-game-effects-memo ctx)
        ;_ (println game-effects)
          ])))