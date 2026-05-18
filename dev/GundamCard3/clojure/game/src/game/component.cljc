(ns game.component
  (:require [clojure.spec.alpha :as s]
            [clojure.set :refer [difference]]
            [clojure.string :as str]
            [clojure.core.match :refer [match]])
  (:import
   (clojure.lang ExceptionInfo)))

; card-table
(s/def ::card-table (s/keys :req-un [::decks ::cards]))
(defn create-card-table [ctx] (merge ctx {:decks {} :cards {}}))
(defn add-card [ctx deck-id card-id card]
  (-> ctx
      (update-in [:decks deck-id] conj card-id)
      (assoc-in [:cards card-id] card)))
(defn remove-card [ctx card-id])
(defn shuffle-deck [ctx deck-id])

; coin-table
(defn create-coin-table [ctx] ctx)


; effect
(s/def ::effect-stack (s/keys :req-un [::effects ::effect-stack-ids]))
(defn create-effect-stack [ctx] ctx)

(defn cut-in [ctx id effect] ctx)

(defn add-immediate-effect [ctx id effect] ctx)

(defn add-destroy-effect [ctx id effect] ctx)

(defn get-top-effect [ctx])

(defn remove-effect [ctx id] ctx)

;
(s/def ::has-current-effect (s/keys :opt-un [::current-effect]))
(defn set-current-effect
  "設定將要處理的效果
   1. 出牌和出指令等效果直接放入這裡, 不放入堆疊
   2. 堆疊中的效果要處理前先放入這裡"
  [ctx effect]
  (assoc ctx ::current-effect effect))

(defn get-current-effect [ctx]
  (::current-effect ctx))

; ==============================
(def player-a :A)
(def player-b :B)
(def player-ids [player-a player-b])
(defn player-get-opponent-id [player-id]
  (if (= player-id player-a) player-b player-a))
;
(s/def ::has-current-player-id (s/keys :opt-un [::current-player-id]))
(defn get-attack-side [ctx]
  (s/assert ::has-current-player-id ctx)
  (-> ctx :current-player-id))

(defn get-defend-side [ctx]
  (s/assert ::has-current-player-id ctx)
  (-> ctx get-attack-side player-get-opponent-id))

(defn is-current-player [ctx player-id]
  (-> ctx get-attack-side (= player-id)))

(defn test-current-player-id []
  (let [_ (-> {:current-player-id :A} get-attack-side (= :A) (or (throw (ex-info "" {}))))
        _ (-> {:current-player-id :A} get-defend-side (= :B) (or (throw (ex-info "" {}))))
        _ (-> {:current-player-id :A} (is-current-player :A) (or (throw (ex-info "" {}))))]))

;
(s/def ::flags (s/coll-of any? :kind set?))
(s/def ::flags-component (s/keys :req-un [::flags]))

(defn create-flags-component [ctx]
  (merge ctx {:flags #{}}))

(defn set-flags [ctx fs]
  (s/assert ::flags-component ctx)
  (s/assert set? fs)
  (update ctx :flags into fs))
(defn has-flag [ctx f]
  (s/assert ::flags-component ctx)
  (-> ctx :flags (get f) nil? not))
(defn remove-flags [ctx fs]
  (s/assert set? fs)
  (s/assert ::flags-component ctx)
  (update ctx :flags difference (into #{} fs)))

(defn test-flag-component []
  (let [player-a :A
        ctx (create-flags-component {})
        has-play-g-flag [player-a :has-play-g]
        ctx (-> ctx (set-flags #{has-play-g-flag}))
        _ (-> ctx (has-flag has-play-g-flag) (or (throw (ex-info "must has-play-g" {}))))
        ctx (-> ctx (remove-flags #{has-play-g-flag}))
        _ (-> ctx (has-flag has-play-g-flag) not (or (throw (ex-info "must no has-play-g" {}))))
        ;_ (println ctx)
        ]))
;
(s/def ::phase-keyword #{:reroll
                         :draw
                         :maintenance
                         :battle})
(s/def ::step-keyword #{:attack
                        :defense
                        :damage-checking
                        :return :end})
(s/def ::timing-keyword #{:start
                          :free1
                          :rule
                          :free2
                          :end
                          :damage-reset
                          :resolve-effect
                          :adjust-hand
                          :turn-end})
(def timings [;; Reroll
              [:reroll :start]
              [:reroll :rule]
              [:reroll :free2]
              [:reroll :end]
              ;; Draw
              [:draw :start]
              [:draw :free1]
              [:draw :rule]
              [:draw :free2]
              [:draw :end]
              ;; Maintenance
              [:maintenance :start]
              [:maintenance :free1]
              [:maintenance :end]
              ;; Attack
              [:battle :attack :start]
              [:battle :attack :free1]
              [:battle :attack :rule]
              [:battle :attack :free2]
              [:battle :attack :end]
              ;; Defense
              [:battle :defense :start]
              [:battle :defense :free1]
              [:battle :defense :rule]
              [:battle :defense :free2]
              [:battle :defense :end]
              ;; DamageChecking
              [:battle :damage-checking :start]
              [:battle :damage-checking :free1]
              [:battle :damage-checking :rule]
              [:battle :damage-checking :free2]
              [:battle :damage-checking :end]
              ;; Return
              [:battle :return :start]
              [:battle :return :free1]
              [:battle :return :rule]
              [:battle :return :free2]
              [:battle :end :damage-reset]
              [:battle :end :resolve-effect]
              [:battle :end :adjust-hand]
              [:battle :end :turn-end]])

(defn next-timing [curr-timing]
  (->> timings cycle (take (inc (count timings))) (drop-while #(not (= % curr-timing))) next first))

(s/def ::timing (into #{} timings))

(defn can-play-card-or-text [timing]
  (s/assert ::timing timing)
  (->> timing (filter #{:free1 :free2}) count pos?))

(defn get-phase-keyword [timing]
  (s/assert ::timing timing)
  (->> timing first))

(defn get-step-keyword [timing]
  (s/assert ::timing timing)
  (match timing
    [:battle step-keyword _] step-keyword
    :else (throw (ex-info (str "no step:" timing) {}))))

(defn is-free [timing]
  (s/assert ::timing timing)
  (match timing
    (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
    true

    :else
    false))

(defn test-timing []
  (let [_ (-> [:battle :return :start] can-play-card-or-text (= false) (or (throw (ex-info "" {}))))
        _ (-> [:battle :return :free1] can-play-card-or-text (= true) (or (throw (ex-info "" {}))))]))
;
(s/def ::has-phase (s/keys :opt-un [::phase]))
(defn create-phase-component [ctx]
  (merge ctx {:phase nil}))

(defn get-phase [ctx]
  (s/assert ::has-phase ctx)
  (->> ctx :phase (s/assert ::timing)))

(defn set-phase [ctx timing]
  (s/assert ::has-phase ctx)
  (s/assert ::timing timing)
  (-> ctx (assoc :phase timing)))

(defn next-phase [ctx]
  (s/assert ::has-phase ctx)
  (-> ctx get-phase next-timing ((fn [timing] (set-phase ctx timing)))))

(defn test-timing-component []
  (let [_ (-> {:phase [:maintenance :start]} (set-phase [:reroll :rule]) get-phase (= [:reroll :rule]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:maintenance :start]} next-phase get-phase (= [:maintenance :free1]) (or (throw (ex-info "" {}))))
        _ (-> {:phase [:battle :end :turn-end]} next-phase get-phase (= [:reroll :start]) (or (throw (ex-info "" {}))))]))


; card
(s/def ::card (s/keys :req-un [::id ::tap? ::face-up? ::proto-id]))

;
(def ba-syou-keyword [:hon-goku
                      :sute-yama
                      :space-area
                      :earth-area
                      :maintenance-area
                      :g-zone
                      :junk-yard
                      :te-hu-ta
                      :hanger
                      :played-card
                      :removed-card])

(s/def ::ba-syou-keyword (into #{} ba-syou-keyword))

(s/def ::player-id any?)
(s/def ::basyou (s/tuple ::player-id ::ba-syou-keyword))

(defn is-battle-area? [k]
  (#{:space-area :earth-area} k))

(defn is-maintenance-area? [k]
  (#{:maintenance-area :g-zone} k))

(defn is-ba? [k]
  (or (is-battle-area? k)
      (is-maintenance-area? k)))

(defn basyou-create [player-id basyou-id]
  (s/assert ::basyou [player-id basyou-id]))

(defn get-player-id [basyou]
  (s/assert ::basyou basyou)
  (-> basyou first))

(defn get-ba-syou-keyword [basyou]
  (s/assert ::basyou basyou)
  (-> basyou second))

(defn get-basyous-by-player-id [player-id]
  (->> ba-syou-keyword (map (fn [k] (basyou-create player-id k)))))

(defn update-ba-syou-keyword [basyou kw]
  (s/assert ::basyou basyou)
  (s/assert ::ba-syou-keyword kw)
  (basyou-create (get-player-id basyou) kw))

(defn test-basyou []
  (s/assert ::basyou [:A :sute-yama])
  (when (not (is-battle-area? :space-area))
    (throw (ex-info "space-area is-battle-area?" {})))
  (when (is-battle-area? :hon-goku)
    (throw (ex-info "hon-goku is not is-battle-area?" {}))))
;

(s/def ::battle-point-value (s/or :empty #{"*"} :int int?))
(s/def ::battle-point (s/tuple ::battle-point-value ::battle-point-value ::battle-point-value))

(defn add-value [& vs]
  (doseq [v vs] (s/assert ::battle-point-value v))
  (reduce (fn [acc-a a]
            (if (or (= "*" a) (= "*" acc-a))
              "*"
              (+ a acc-a)))
          0
          vs))

(defn add [& vs]
  (doseq [v vs] (s/assert ::battle-point v))
  (->> vs (apply map vector) (mapv #(apply add-value %))))

(defn test-battle-point []
  (-> (add [1 1 1] [1 1 1] [1 1 1]) (= [3 3 3]) (or (throw (ex-info "must [3 3 3]" {}))))
  (-> (add [1 1 1] [2 "*" 1] ["*" 1 -1]) (= ["*" "*" 1]) (or (throw (ex-info "must [* * 1]" {})))))

;
; "緑" | "茶" | "青" | "白" | "紫" | "黒" | "赤";
(s/def :gsign/color #{:green :brown :blue :white :purple :black :red})
(s/def :gsign/property #{:uc :08})
(s/def ::gsign (s/tuple :gsign/color :gsign/property))

(defn can-pay-roll-cost
  "紫國力用1個紫或2個非紫的支付
   其它國力用1個相應國力支付"
  [color pay-colors]
  (when (not (vector? pay-colors))
    (throw (ex-info "pay-colors must vec" {})))
  (cond
    (= color :purple)
    (or (->> pay-colors (= [:purple]))
        (->> pay-colors (filter #(not (= :purple %))) count (= 2)))
    :else
    (->> pay-colors (= [color]))))

(defn test-gsign []
  (doseq [[color pay-colors] [[:purple [:purple]]
                              [:purple [:blue :white]]
                              [:blue [:blue]]
                              [:white [:white]]
                              [:black [:black]]
                              [:red [:red]]]]
    (when (not (can-pay-roll-cost color pay-colors))
      (throw (ex-info (str color " can not use " pay-colors " to pay") {}))))
  (doseq [[color pay-colors] [[:purple [:blue]]
                              [:purple [:blue :purple]]
                              [:blue [:white]]
                              [:white [:black]]
                              [:black [:red]]
                              [:red [:black]]
                              [:red [:red :red]]]]
    (when (can-pay-roll-cost color pay-colors)
      (throw (ex-info (str color " must can not use " pay-colors " to pay") {})))))

; ========== Tip ============

(defmulti game-is-phase :env)
(defmulti game-set-tip (fn [game card-id condition-id tip] (:env game)))
(defmulti game-get-tip (fn [game card-id condition-id] (:env game))) ; 
(defmulti game-get-tips (fn [game card-id] (:env game))) ;
(defmulti game-tip-is-ok-to-perform (fn [game tip] (:env game)))

; ========== Text =========== 

(defmulti game-get-effect-owner-id (fn [game effect] (:env game)))
(defmulti game-get-effect-card-id (fn [game effect] (:env game)))

(s/def ::condition  (s/keys :opt-un [::id ::tip-script ::action-script]))

(defn condition-create [id tip-script action-script]
  {:id id :tip-script tip-script :action-script action-script})
(defn condition-eval-tip-script [con]
  (-> con :tip-script (or `(fn [~'game ~'effect] nil)) eval))
(defn condition-eval-action-script [con]
  (-> con :action-script (or `(fn [~'game ~'effect ~'tip])) eval))

(s/def ::conditions (s/coll-of ::condition))
(s/def ::action (s/keys :opt-un [::id ::conditions ::action-script]))

(defn action-create [id conditions action-script]
  {:id id, :conditions conditions, :action-script action-script})
(defn action-get-conditions [action]
  (-> action :conditions (or [])))
(defn action-reduce-conditions [action f ctx]
  (->> action action-get-conditions (reduce f ctx)))
(defn action-set-condition-tips [action ctx effect]
  (let [ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (let [tip-script (condition-eval-tip-script con)
                                                       tip (tip-script ctx effect)
                                                       ctx (game-set-tip ctx
                                                                         (game-get-effect-card-id ctx effect)
                                                                         (:id con)
                                                                         tip)]
                                                   ctx))))]
    ctx))
(defn action-evaluate-conditions-errors [action ctx effect]
  (let [errors (atom [])
        ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (println "action-evaluate-conditions-errors" ctx)
                                                 (let [action-script (condition-eval-action-script con)
                                                       tip (game-get-tip ctx (game-get-effect-card-id ctx effect) (:id con))
                                                       _ (when (->> (game-tip-is-ok-to-perform ctx tip) not)
                                                           (swap! errors conj "error tip"))
                                                       ctx (try (action-script ctx effect tip)
                                                                (catch ExceptionInfo e
                                                                  (swap! errors conj (ex-message e))
                                                                  ctx))]
                                                   ctx))))
        tips (game-get-tips ctx (game-get-effect-card-id ctx effect))
        final-action (condition-eval-action-script action)
        ctx (try (final-action ctx effect tips)
                 (catch ExceptionInfo e
                   (swap! errors conj (ex-message e))
                   ctx))]
    [@errors ctx]))
(defn action-evaluate-conditions [action ctx effect]
  (-> action (action-evaluate-conditions-errors ctx effect) ((fn [[errors ctx]]
                                                               (when (-> errors count pos?)
                                                                 (throw (ex-info (str/join "," errors)
                                                                                 {:errors errors}))
                                                                 true)
                                                               ctx))))


(s/def ::actions (s/coll-of ::action))
(s/def ::event-script any?)
(s/def ::effect-script any?)
(s/def ::text (s/keys :opt-un [::id ::actions ::event-script ::effect-script]))

(defn text-create [{:keys [id actions event-script effect-script]}]
  {:id id, :actions actions, :event-script event-script :effect-script effect-script})
(defn text-get-actions [text]
  (-> text :actions (or [])))
(defn text-eval-event-script [text]
  (-> text :event-script (or '(fn [game effect event])) eval))
(defn text-eval-effect-script [text]
  (-> text :effect-script (or '(fn [game effect])) eval))
(defn text-get-action [text id]
  (-> text :actions (nth id)))
(defn text-get-checked-actions [text ctx effect]
  (->> (text-get-actions text)
       (group-by (comp zero? count first
                       #(action-evaluate-conditions-errors % ctx effect)))))
; cost
(s/def ::roll-cost-color (s/nilable :gsign/color))
(s/def ::roll-cost (s/or :x #{:X} :colors (s/coll-of ::roll-cost-color :kind vector?)))
(s/def ::total-cost (s/or :x #{:X} :int int?))

; card proto
(s/def ::texts (s/map-of any? ::text))
(s/def ::type #{:unit :character :command :operation :operation-unit :graphic :ace})
(s/def ::command-script list?)
(s/def ::card-proto (s/keys :req-un [::id ::gsign ::type ::texts]
                            :opt-un [::battle-point ::roll-cost ::total-cost ::pack ::char ::command-script]))

(defn card-proto-create [{:keys [texts] :as info}]
  (s/assert ::card-proto (assoc info :texts (into {} (map (fn [text] [(:id text) text]) texts)))))

;
(defn test-text []
  (defmethod game-get-effect-card-id :game.basic [game eff]
    "runtime-card-id")

  (defmethod game-set-tip :game.basic [game card-id condition-id tip]
    (println "game-set-tip " card-id condition-id tip)
    (update-in game [:tips card-id condition-id] (constantly tip)))

  (defmethod game-get-tip :game.basic [game card-id condition-id]
    (get-in game [:tips card-id condition-id]))

  (defmethod game-get-tips :game.basic [game card-id]
    (get-in game [:tips card-id]))

  (defmethod game-tip-is-ok-to-perform :game.basic [game tip]
    true)
  (let [ctx {:env :game.basic, :version 0}
        text (text-create {:id "text-1"
                           :actions [(action-create "action-1"
                                                    [(condition-create "cond1"
                                                                       `(fn [~'ctx ~'effect]
                                                                          :tip-1)
                                                                       `(fn [~'ctx ~'effect ~'tip]
                                                                          (println "condition action " ~'tip)
                                                                          #_(throw (ex-info "acc" {}))
                                                                          (update ~'ctx :version inc)))
                                                     (condition-create "cond2"
                                                                       `(fn [~'ctx ~'effect]
                                                                          :tip-2)
                                                                       `(fn [~'ctx ~'effect ~'tip]
                                                                          (println "condition action " ~'tip)
                                                                          #_(throw (ex-info "acc" {}))
                                                                          (update ~'ctx :version inc)))]
                                                    `(fn [~'ctx ~'effect ~'tips]
                                                       (println "action action" ~'tips)
                                                       (update ~'ctx :version inc)))]
                           :event-script `(fn [~'ctx ~'effect ~'event] ~'ctx)
                           :effect-script `(fn [~'ctx ~'effect] ~'ctx)})
        effect {:env :game.basic}
        ;_ (println text)
        ; 先確認玩家使用哪一個action
        action (-> text (text-get-action 0))
        ;_ (println action)
        ; 記下那個action的預設選擇, 然後給玩家選擇
        ctx (action-set-condition-tips action ctx effect)
        ; 取得某張卡的選擇
        tips (game-get-tips ctx "card-id")
        ; 檢查預設選擇是否滿足條件
        _ (doseq [tip tips]
            (-> (game-tip-is-ok-to-perform ctx tip) not (when (throw (ex-info "" {})))))
        ; 若滿足後就放入可PLAY指令列表, 玩家可以做的就只是修改選擇
        ; 執行
        ctx (->> (action-evaluate-conditions action ctx effect))
        _ (println ctx)]))

; ========== Effect

(s/def ::effect (s/keys :req-un [::id ::reason ::text]))

(defn effect-create [{:keys [id reason text]}]
  {:id id :reason reason :text text})

(defn effect-get-text [effect]
  (-> effect :text))