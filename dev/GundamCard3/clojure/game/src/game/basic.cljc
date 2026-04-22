(ns game.basic
  (:require
   [clojure.edn :as edn]
   [clojure.core.match :refer [match]]
   [clara.rules :refer :all]
   [clojure.string :as str])
  (:import
   (clojure.lang ExceptionInfo)))


; ============== CardTable ============


(defn card-stack-create [id card-ids]
  {:id id, :card-ids card-ids})

(defn card-stack-shuffle [card-stack]
  (update card-stack :card-ids shuffle))

(defn card-stack-remove-card-ids [card-stack card-ids]
  (update card-stack :card-ids (partial filter (fn [card-id]
                                                 (every? #(not= % card-id) card-ids)))))

(defn card-stack-add-card-ids [card-stack options card-ids]
  (update card-stack :card-ids #(concat % card-ids)))

(defn card-table-create [card-map card-stack-map]
  {:card-map card-map :card-stack-map card-stack-map})

(defn card-table-add-card [table card-stack-id card-id card]
  (-> table :card-stack-map (get card-stack-id) not
      (when (throw (ex-info (str "card-stack not found" card-stack-id) {}))))
  (-> table
      (update :card-map #(assoc % card-id card))
      (update-in [:card-stack-map card-stack-id] #(card-stack-add-card-ids % {} [card-id]))))

(defn card-table-get-card [table card-id]
  (-> table :card-map (get card-id)))

(defn card-table-map-card [table card-id f]
  (-> table (update-in [:card-map card-id] f)))

(defn card-table-move-cards [table from to options card-ids]
  (-> table
      (update-in [:card-stack-map from] (fn [card-stack]
                                          (card-stack-remove-card-ids card-stack card-ids)))
      (update-in [:card-stack-map to] (fn [card-stack]
                                        (card-stack-add-card-ids card-stack options card-ids)))))

(defn card-table-map-card-stack-map [table f]
  (-> table (update :card-stack-map (fn [card-stack-map]
                                      (->> card-stack-map
                                           (map (fn [[card-stack-id card-stack]]
                                                  [card-stack-id (f card-stack)]))
                                           (into {}))))))
(defn card-table-remove-card [table card-id]
  (-> table
      (update :card-map dissoc card-id)
      (card-table-map-card-stack-map (fn [card-stack]
                                       (card-stack-remove-card-ids card-stack [card-id])))))


(defn test-table []
  (let [table (card-table-create {:a :card-a, :b :card-b}
                                 (->> [(card-stack-create :cs-a [:a, :b]),
                                       (card-stack-create :cs-b [])]
                                      (map (juxt :id identity))
                                      (into {})))
        ;_ (println table)
        table (card-table-add-card table :cs-a :c :card-c)
        ; _ (println table)
        _ (-> table :card-map vals (not= '(:card-a, :card-b, :card-c))
              (when (throw (ex-info "" {}))))
        _ (-> table :card-stack-map :cs-a :card-ids (not= '(:a :b :c))
              (when (throw (ex-info "" {}))))
        table (card-table-remove-card table :b)
        _ (-> table :card-map vals (not= '(:card-a, :card-c))
              (when (throw (ex-info "" {}))))
        _ (-> table :card-stack-map :cs-a :card-ids (not= '(:a :c))
              (when (throw (ex-info "" {}))))
        table (card-table-move-cards table :cs-a :cs-b {} [:a :c])
        _ (println table)
        _ (-> table :card-stack-map :cs-a :card-ids (not= '())
              (when (throw (ex-info "" {}))))
        _ (-> table :card-stack-map :cs-b :card-ids (not= '(:a :c))
              (when (throw (ex-info "" {}))))
        _ (-> table (card-table-get-card :a) (not= :card-a)
              (when (throw (ex-info "" {}))))]))

; ============= CoinTable ==============
(defn coin-table-create [coin-map coin-assoc-map]
  {:coin-map coin-map :coin-assoc-map coin-assoc-map})
(defn coin-table-add-coin [table assoc-id id coin]
  (-> table
      (update :coin-map #(assoc % id coin))
      (update :coin-assoc-map #(assoc % id assoc-id))))
(defn coin-table-get-coin [table id]
  (get-in table [:coin-map id]))
(defn coin-table-get-assoc-coins [table coin-assoc-id]
  (->> table :coin-assoc-map
       (filter (fn [[coin-id assoc-id]] (= assoc-id coin-assoc-id)))
       (map first)
       (map #(coin-table-get-coin table %))))

; =========== stack system ==============

(defn stack-system-create [effect-map stack-effects immediate-effects destroy-effects]
  {:effect-map effect-map, :stack-effects stack-effects, :immediate-effects immediate-effects, :destroy-effects destroy-effects})
(defn stack-system-cut-in [stack-system id effect]
  (-> stack-system
      (update :effect-map #(assoc % id effect))
      (update :stack-effects #(cons id %))))
(defn stack-system-append-immediate-effect [stack-system id effect]
  (-> stack-system
      (update :effect-map #(assoc % id effect))
      ; 使用vec才能在conj(後方推入)中保持順序性
      (update :immediate-effects #(conj (vec %) id))))
(defn stack-system-append-destroy-effect [stack-system id effect]
  (-> stack-system
      (update :effect-map #(assoc % id effect))
      ; 使用vec才能在conj(後方推入)中保持順序性
      (update :destroy-effects #(conj (vec %) id))))
(defn stack-system-remove-effect [stack-system id]
  (-> stack-system
      (update :effect-map #(dissoc % id))
      (update :stack-effects (partial remove (fn [card-id]
                                               (= id card-id))))
      (update :immediate-effects (partial remove (fn [card-id]
                                                   (= id card-id))))
      (update :destroy-effects (partial remove (fn [card-id]
                                                 (= id card-id))))))
(defn stack-system-map-effect [stack-system id f]
  (update-in stack-system [:effect-map id] f))
(defn stack-system-get-top-effect [stack-system]
  (-> stack-system :stack-effects first ((:effect-map stack-system))))
(defn stack-system-get-effect [stack-system id]
  (-> stack-system :effect-map (get id)))

; ========== Tip ============

(defmulti game-is-phase :env)
(defmulti game-set-tip (fn [game card-id condition-id tip] (:env game)))
(defmulti game-get-tip (fn [game card-id condition-id] (:env game))) ; 
(defmulti game-get-tips (fn [game card-id] (:env game))) ;
(defmulti game-get-card-position :env)
(defmulti game-get-card-from-card-position :env)
(defmulti game-tip-create :env)
(defmulti game-tip-is-ok-to-perform (fn [game tip] (:env game)))

; ========== Text =========== 

(defmulti effect-get-owner-id :env)
(defmulti effect-get-card-id :env)

(defn condition-create [id tip-script action-script]
  {:id id :tip-script tip-script :action-script action-script})
(defn condition-eval-tip-script [con]
  (-> con :tip-script eval))
(defn condition-eval-action-script [con]
  (-> con :action-script eval))

(defn action-create [id conditions action-script]
  {:id id, :conditions conditions, :action-script action-script})
(defn action-get-conditions [action]
  (-> action :conditions))
(defn action-reduce-conditions [action f ctx]
  (->> action action-get-conditions (reduce f ctx)))
(defn action-set-condition-tips [action ctx effect]
  (let [ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (let [tip-script (condition-eval-tip-script con)
                                                       tip (tip-script ctx effect)
                                                       ctx (game-set-tip ctx
                                                                         (effect-get-card-id effect)
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
                                                       tip (game-get-tip ctx (effect-get-card-id effect) (:id con))
                                                       _ (when (->> (game-tip-is-ok-to-perform ctx tip) not)
                                                           (swap! errors conj "error tip"))
                                                       ctx (try (action-script ctx effect tip)
                                                                (catch ExceptionInfo e
                                                                  (swap! errors conj (ex-message e))
                                                                  ctx))]
                                                   ctx))))
        tips (game-get-tips ctx (effect-get-card-id effect))
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

(defn text-create [{:keys [id actions event-script effect-script]}]
  {:id id, :actions actions, :event-script event-script :effect-script effect-script})
(defn text-get-actions [text]
  (-> text :actions))
(defn text-eval-event-script [text]
  (-> text :event-script eval))
(defn text-get-action [text id]
  (-> text :actions (nth id)))

; ========== Effect

(defn effect-create [{:keys [id reason text]}]
  {:id id :reason reason :text text})



; ===================================


; =================== tip ===============
(defn tip-search-create [ctx {:keys [card-type card-category card-position side]}]
  {:env :search})

; ==============================

(def player-a :A)
(def player-b :B)
(def player-ids [player-a player-b])
(defn player-get-opponent-id [player-id]
  (if (= player-id player-a) player-b player-a))

; =========================

(defmethod effect-get-card-id :game.basic [eff]
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

(defn test-text []
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

; ====================
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

(defn can-play-card-or-text [timing]
  (->> timing (filter #{:free1 :free2}) count pos?))

(defn get-phase-keyword [timing]
  (->> timing first))

(defn get-step-keyword [timing]
  (match timing
    [:battle step-keyword _] step-keyword
    :else (throw (ex-info (str "no step:" timing) {}))))

(defn test-timing []
  (let [_ (-> [:battle :return :start] can-play-card-or-text (= false) (or (throw (ex-info "" {}))))
        _ (-> [:battle :return :free1] can-play-card-or-text (= true) (or (throw (ex-info "" {}))))]))

; ==========================

; "緑" | "茶" | "青" | "白" | "紫" | "黒" | "赤";
(def gsign-colors #{:green :brown :blue :white :purple :black :red})
(def gsign-properties #{:uc :08})

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

; =====================

(defn add-value [& vs]
  (reduce (fn [acc-a a]
            (if (or (= "*" a) (= "*" acc-a))
              "*"
              (+ a acc-a)))
          0
          vs))

(defn add [& vs]
  (->> vs (apply map vector) (mapv #(apply add-value %))))

(defn test-battle-point []
  (-> (add [1 1 1] [1 1 1] [1 1 1]) (= [3 3 3]) (or (throw (ex-info "must [3 3 3]" {}))))
  (-> (add [1 1 1] [2 "*" 1] ["*" 1 -1]) (= ["*" "*" 1]) (or (throw (ex-info "must [* * 1]" {})))))

; ================
(defn card-proto-create [{:keys [id gsign type texts]}]
  {:id id, :gsign gsign, :type type, :texts texts})