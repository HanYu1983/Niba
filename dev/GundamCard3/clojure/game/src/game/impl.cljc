(ns game.impl
  (:require [clojure.spec.alpha :as s]
            [clojure.core.match :refer [match]]
            [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]
            [game.basic :refer :all]
            [game.data :refer :all]
            [game.query-command :refer :all]))

(defmulti game-cut-in (fn [game effect] (:env game)))
(defmulti game-set-cut-pass (fn [game player-id] (:env game)))

(defn apply-command [game {:keys [player-id payload] :as cmd}]
  (match payload
    {:id :handle-active-effect, :value effect}
    game

    {:id :set-active-effect, :values [effect]}
    (assoc game :active-effect effect)

    ; 所有破壞效果進堆疊, 這時就可以切入破壞無效
    {:id :convert-destroy-effects-to-new-cut, :values destroy-card-ids}
    game

    {:id :set-cut-in, :value effect}
    (game-cut-in game effect)

    {:id :set-pass-cut}
    (game-set-cut-pass game player-id)

    {:id :next-phase, :value phase}
    game

    {:id :handle-phase, :value phase}
    game

    :else
    (throw (ex-info "unknown command" {:command cmd}))))


(s/def ::game (s/keys :req-un [:game.basic/card-table]))

(def game {:env :impl
           :card-table {:card-map {} :card-stack-map {}}})

(defmethod game-is-phase :impl [game]
  (:phase game))
(defmethod game-set-tip :impl [game card-id condition-id tip]
  (update-in game [:tips card-id] #(assoc % condition-id tip)))
(defmethod game-get-tip :impl [game card-id condition-id]
  (get-in game [:tips card-id condition-id]))
(defmethod game-get-tips :impl [game card-id]
  (-> (get-in game [:tips card-id] vals)))
(defmethod game-tip-is-ok-to-perform :impl [game tip]
  false)
(defmethod game-get-effect-owner-id :impl [game effect]
  player-a)
(defmethod game-get-effect-card-id :impl [game effect]
  :card-a)
(defmethod game-get-active-effect :impl [game]
  (:active-effect game))
(defmethod game-get-active-player-id :impl [game]
  (:active-player-id game))
(defmethod game-get-immediate-effects :impl [game]
  (-> (:stack-system game) game-get-immediate-effects))
(defmethod game-get-stack-effects :impl [game]
  (-> (:stack-system game) game-get-stack-effects))
(defmethod game-get-player-pass-cut :impl [game player-id]
  ((:player-has-cut game) player-id))

;=================================

(comment
  (def empty-session (mk-session 'game.impl))

; level 0的內文可以被洗
  (defrule origin-card-text
    [CardBaSyou
     (= player-id ?player-id)
     (some? #{:space-area, :earth-area, :maintenance-area, :junk-yard} ba-syou-keyword)
     (= card-id ?card-id)]
    [CardText (= card-id ?card-id) (= id ?text-id) (= level 0)]
    [text-ids-cancel <- (acc/all :text-id) :from [EffectCancelText]]
    [:check (not (contains? text-ids-cancel ?text-id))]
    =>
    (insert! (map->CardTextStep1 {:player-id ?player-id, :card-id ?card-id, :text-id text-id, :reason :default})))

; level 1的內文不能被洗
  (defrule origin-card-text
    [CardBaSyou
     (= player-id ?player-id)
     (some? #{:space-area, :earth-area, :maintenance-area, :junk-yard} ba-syou-keyword)
     (= card-id ?card-id)]
    [CardText (= card-id ?card-id) (= id ?text-id) (>= level 1)]
    =>
    (insert! (map->CardTextStep1 {:player-id ?player-id, :card-id ?card-id, :text-id text-id, :reason :default})))

; level 2的內文在g-zone也不會被洗
  (defrule g-zone-card-text
    [CardBaSyou
     (= player-id ?player-id)
     (some? #{:g-zone} ba-syou-keyword)
     (= card-id ?card-id)]
    [CardText (= card-id ?card-id) (= id ?text-id) (>= level 2)]
    =>
    (insert! (map->CardTextStep1 {:player-id ?player-id, :card-id ?card-id, :text-id text-id, :reason :g-zone})))


  (defrule card-text-step2
    [texts-from-step1 <- (acc/all) :from [CardTextStep1]]
    [text-ids-cancel <- (acc/all :text-id) :from [EffectCancelText]]
    =>
    (let [text-ids (clojure.set/difference)]
      (doseq [text-id text-ids]
        (insert! (map->CardTextStep2 {})))))

  (defrule added-card-text
    [EffectAddText (= player-id ?player-id) (= text ?text)]
    =>
    (insert! (map->CardTextStep2 {:player-id ?player-id, :card-id ?card-id, :text-id text-id, :reason :added})))


  (defrule card-text-step3
    [texts-from-step2 <- (acc/all) :from [CardTextStep1]]
    [text-ids-cancel <- (acc/all :text-id) :from [EffectCancelText]]
    =>
    (let [text-ids (clojure.set/difference)]
      (doseq [text-id text-ids]
        (insert! (map->CardTextStep3 {})))))

; 從final card text的text id找出card-proto的text後叫用effect-script, 再轉成rule的record insert
  (defrule query-card-texts-step1
    [?values <- CardTextStep1])
; 再查詢一次就包含新增的內文
  (defrule query-card-texts-final
    [?values <- CardTextStepFinal])

  (defrule play-card
    [CardBaSyou (= player-id ?player-id) (= ba-syou-keyword :te-hu-ta) (= card-id ?card-id)]
    [Card (= card-id ?card-id)]
    =>
    (insert! (map->CardCanPlayByHand {:card-id ?card-id, :player-id ?player-id})))

  (defrule play-card-by-text
    [EffectCardCanPlayAsHand (= player-id ?player-id) (= card-id ?card-id)]
    =>
    (insert! (map->CardCanPlayByHand {:card-id ?card-id, :player-id player-id})))

  (defquery card-can-play-by-hand [?player-id]
    [?values <- EffectCardCanPlayAsHand (= player-id ?player-id)])
  )

;================
(defn game-query-card-texts [game card-id]
  (let [proto-id (-> (:card-table game) (card-table-get-card card-id) :proto-id)
        proto (get-card-data-memo proto-id)
        texts (:texts proto)]
    texts))

(defn game-query-card-ids [game]
  (-> (:card-table game) :card-map keys))

(defn game-query-card-battle-point [game card-id global-effects])

(defn game-query-card-text-global-effects [game text]
  (let [script (text-eval-effect-script text)
        global-effects (script game {})]
    (script game)))

#_(defn game-assoc-global-effects [game]
  (let [; 先清除快取
        game (dissoc game :global-effects)
        ; 先查原始內文
        origin-texts (mapcat #(game-query-card-texts game %) (game-query-card-ids game))
        ; 先查數值BUF
        effects (query-card-effects game origin-texts)
        ; 套用快取
        game (assoc game :global-effects effects)
        ; 再查有沒有因數值更動而產生的新效果
        effects2 (query-card-effects game origin-texts)
        ; 套用快取
        game (assoc game :global-effects (merge effects effects2))
        ; 取得新內文
        added-texts []
        ; 計算新內文的效果
        effects3 (query-card-effects game added-texts)
        game (assoc game :global-effects (merge effects effects2 effects3))]
    game))




(defn game-query-play-card-effect [game player-id]
  [])
(defn game-query-play-text-effect [game player-id]
  [])
(defn game-query-quick-play-card-effect [game player-id]
  [])
(defmethod game-get-player-can-play-texts :impl [game player-id]
  (let [play-effects (match (game-get-phase game)
                       [:maintenance :free1]
                    ; play g, unit, character, operation
                       (concat (game-query-play-card-effect game player-id)
                    ; play text
                               (game-query-play-text-effect game player-id))

                       (:or [_ :free1] [_ _ :free1] [_ :free2] [_ _ :free2])
                       ; quick
                       (concat (game-query-quick-play-card-effect game player-id)
                               (game-query-play-text-effect game player-id))

                       :else
                       [])]
    play-effects))
(defmethod game-get-effect-owner-id :impl [eff]
  (-> eff :reason :player-id))
(defmethod game-get-phase :impl [game]
  [:battle :attack :start])
(defmethod game-has-handle-phase :impl [game phase]
  true)