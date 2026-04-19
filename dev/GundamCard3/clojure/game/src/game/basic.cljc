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

(defn stack-system-create [effect-map effect-stack immediate-effects destory-effects])
(defn stack-system-cut-in [stack-system id effect])
(defn stack-system-append-immediate-effect [stack-system id effect])
(defn stack-system-append-destory-effect [stack-system id effect])
(defn stack-system-remove-effect [stack-system id])
(defn stack-system-map-effect [stack-system id f])
(defn stack-system-get-top-effect [stack-system])
(defn stack-system-get-effect [stack-system id])

; ========== Tip ============






(defmulti runtime-get-card-id :env)
(defmulti runtime-get-player-id :env)

(defmulti game-is-phase :env)
(defmulti game-set-tip (fn [game card-id condition-id tip] (:env game)))
(defmulti game-get-tip (fn [game card-id condition-id] (:env game))) ; 
(defmulti game-get-tips (fn [game card-id] (:env game))) ;
(defmulti game-get-card-position :env)
(defmulti game-get-card-from-card-position :env)
(defmulti game-tip-create :env)
(defmulti game-tip-is-ok-to-perform (fn [game tip] (:env game)))

; ========== Text =========== 

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
(defn action-set-condition-tips [action ctx runtime]
  (let [ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (let [tip-script (condition-eval-tip-script con)
                                                       tip (tip-script ctx runtime)
                                                       ctx (game-set-tip ctx
                                                                         (runtime-get-card-id runtime)
                                                                         (:id con)
                                                                         tip)]
                                                   ctx))))]
    ctx))
(defn action-evaluate-conditions-errors [action ctx runtime]
  (let [errors (atom [])
        ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (println "action-evaluate-conditions-errors" ctx)
                                                 (let [action-script (condition-eval-action-script con)
                                                       tip (game-get-tip ctx (runtime-get-card-id runtime) (:id con))
                                                       _ (when (->> (game-tip-is-ok-to-perform ctx tip) not)
                                                           (swap! errors conj "error tip"))
                                                       ctx (try (action-script ctx runtime tip)
                                                                (catch ExceptionInfo e
                                                                  (swap! errors conj (ex-message e))
                                                                  ctx))]
                                                   ctx))))
        tips (game-get-tips ctx (runtime-get-card-id runtime))
        final-action (condition-eval-action-script action)
        ctx (try (final-action ctx runtime tips)
                 (catch ExceptionInfo e
                   (swap! errors conj (ex-message e))
                   ctx))]
    [@errors ctx]))
(defn action-evaluate-conditions [action ctx runtime]
  (-> action (action-evaluate-conditions-errors ctx runtime) ((fn [[errors ctx]]
                                                                (when (-> errors count pos?)
                                                                  (throw (ex-info (str/join "," errors)
                                                                                  {:errors errors}))
                                                                  true)
                                                                ctx))))

(defn text-create [id actions event-script effect-script]
  {:id id, :actions actions, :event-script event-script :effect-script effect-script})
(defn text-get-actions [text]
  (-> text :actions))
(defn text-eval-event-script [text]
  (-> text :event-script eval))
(defn text-get-action [text id]
  (-> text :actions (nth id)))

; ========== Effect

(defmulti effect-reason-get-owner-id :env)

(defn effect-create [id reason text]
  {:id id :reason reason :text text})

(defn effect-get-owner-id [effect]
  (-> effect :reason effect-reason-get-owner-id))


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

(defmethod runtime-get-card-id :game.basic [runtime]
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
        runtime {:env :game.basic}
        text (text-create "text-1"
                          [(action-create "action-1"
                                          [(condition-create "cond1"
                                                             `(fn [~'ctx ~'runtime]
                                                                :tip-1)
                                                             `(fn [~'ctx ~'runtime ~'tip]
                                                                (println "condition action " ~'tip)
                                                                #_(throw (ex-info "acc" {}))
                                                                (update ~'ctx :version inc)))
                                           (condition-create "cond2"
                                                             `(fn [~'ctx ~'runtime]
                                                                :tip-2)
                                                             `(fn [~'ctx ~'runtime ~'tip]
                                                                (println "condition action " ~'tip)
                                                                #_(throw (ex-info "acc" {}))
                                                                (update ~'ctx :version inc)))]
                                          `(fn [~'ctx ~'runtime ~'tips]
                                             (println "action action" ~'tips)
                                             (update ~'ctx :version inc)))]
                          `(fn [~'ctx ~'runtime ~'event] ~'ctx)
                          `(fn [~'ctx ~'runtime] ~'ctx))

        ;_ (println text)
        ; 先確認玩家使用哪一個action
        action (-> text (text-get-action 0))
        ;_ (println action)
        ; 記下那個action的預設選擇, 然後給玩家選擇
        ctx (action-set-condition-tips action ctx runtime)
        ; 取得某張卡的選擇
        tips (game-get-tips ctx "card-id")
        ; 檢查預設選擇是否滿足條件
        _ (doseq [tip tips]
            (-> (game-tip-is-ok-to-perform ctx tip) not (when (throw (ex-info "" {})))))
        ; 若滿足後就放入可PLAY指令列表, 玩家可以做的就只是修改選擇
        ; 執行
        ctx (->> (action-evaluate-conditions action ctx runtime))
        _ (println ctx)]))