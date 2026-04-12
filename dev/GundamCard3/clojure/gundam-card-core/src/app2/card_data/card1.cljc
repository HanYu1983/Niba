(ns app2.card-data.card1
  (:require
   [app2.common.domain :as domain :refer :all])
  (:require
   [clara.rules :refer :all]
   [clara.rules.accumulators :as acc]))


(map->Event {})

(Event)

(defrule query-require
  "（ダメージ判定ステップ）〔２〕：このセットグループのユニットは、ターン終了時まで、「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１を得る。"
  [QueryRequire (= text-id ?text-id)]
  [CardText (= id ?text-id) (= card-id ?this-card) (= text :abc-1)]
  [SetGroup (contains? card-ids ?this-card) (= unit-id ?unit-id)]
  =>
  [SelectToPayColor ?card-text-id colors 2]
  [SelectFromOptions ?card-text-id ["〔０〕：範囲兵器（３）" "または「範囲兵器」＋１"]])

(defrule query-execute-script
  [QueryScript (= text-id ?text-id)]
  =>
  [Script `(fn [ctx]
             (let [session (-> ctx :session)
                   session (-> session (insert! (->AddText "範囲兵器（３）")))
                   ctx (-> ctx (assoc :session session))]
               ctx))])

(comment
  (let [current-tokens []
        session (-> session
                    remove-tokens
                    (insert-all current-tokens))
        requires (-> session
                     (inesrt (->QueryRequire "text-id"))
                     (fire-rule)
                     (query get-selection)
                     :items)
        exe-requires (-> (exe-requiers ctx session))
        ; set requires from user
        session (-> session
                    (insert (->QueryScript "text-id"))
                    (fire-rule))
        ; sync token
        next-tokens (-> session (query token) :items)

        script (-> session (query script))]))


(defrule skill1
  "（ダメージ判定ステップ）〔２〕：このセットグループのユニットは、ターン終了時まで、「〔０〕：範囲兵器（３）」、または「範囲兵器」＋１を得る。"
  [Timing [[phase step substep]]  (= phase :battle) (= step :damage) (= substep :free)]
  [Turn (= turn ?this-turn)]
  [CardOwner (= player-id ?owner-id) (= proto-id :abc) (= card-id ?this-card)]
  [colors <- (acc/all) :from [GenColor (= player-id ?owner-id)]]
  [:test (=> colors count (<= 2))]
  =>
  (insert! (map->AddText {:text "〔０〕：範囲兵器（３）" :turn ?this-turn :card-id ?this-card})))

(defrule default-skill
  [Card (= id ?this-card) (= proto-id :abc)]
  =>
  (insert! (map->CardText {:card-id ?this-card :text "〔1〕：範囲兵器（３）"}))
  (insert! (map->CardText {:card-id ?this-card :text "〔０〕：範囲兵器（2）"})))

(defrule card-text
  [Card (= id ?this-card)]
  [AddText (= card-id ?this-card) (= text ?text)]
  =>
  (insert! (map->CardText {:card-id ?this-card :text ?text})))

(defrule card-texts
  [?texts <- (acc/all :text) :from [CardText (= card-id ?this-card)]]
  [?add-texts <- (acc/all :text) :from [AddText (= card-id ?this-card)]]
  =>
  (insert! (map->CardTexts {:texts (concat ?add-texts ?texts) :card-id ?this-card})))

(defrule xxx
  [EventPlayCardToStage (= card-id ?this-card)]
  [FactHasQuick (= card-id ?this-card)]
  =>
  [FactRerollPlayToStage card-id])

(defrule ps-armor1
  ;[EventHistory (= turn ?event-turn) (= event-id ?event-id)]
  ;[Event]
  [CardText (= text :psarmor) (= card-id ?this-card)]
  [CardPosition (= card-id ?this-card) (= position ?battle-area)]
  [?bgs <- (acc/all) :from [BattleGroup [{card-ids :card-ids}] (contains card-id ?this-card)]]
  [:not [PSArmorState (= card-id ?this-card)]]
  =>
  (insert (map->PSArmorState {:card-id ?this-card, :enabled (-> ?bgs count pos?)})))

(defrule)

(defrule ps-armor
  [CardText (= text :psarmor) (= card-id ?this-card)]
  [EventTurnStart (= turn ?this-turn)]
  [Turn (= turn ?this-turn)]
  [BattleGroup [{card-ids :card-ids}] (contains card-id ?this-card) (= turn ?battle-turn)]
  =>
  (retract!))
