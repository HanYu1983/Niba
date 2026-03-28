(ns app1.core2
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id isFaceUp isTap])
(defrecord CardBuf [id card-id hp])
(defrecord CardState [id hp])
(defrecord Attack [id card-id damage])
(defrecord DamageCard [id card-id damage])
(defrecord DamageSound [id card-id damage])
(defrecord DeadCard [card-id])

(defrecord Pilot [id hp])
(defrecord PilotBuf [id pilot-id hp en])
(defrecord PilotState [id hp])
(defrecord SetCardPilot [card-id pilot-id])

(defrule pilot-buf
  "add pilot"
  [Pilot (= ?id id) (= ?hp hp)]
  =>
  (insert! (->PilotBuf "base" ?id ?hp 1)))

(defrule pilot-state
  [?pilot <- Pilot (= ?id id)]
  [?hp-buf <- (acc/sum :hp) :from [PilotBuf (= pilot-id ?id)]]
  ;[?en-buf <- (acc/sum :en) :from [PilotBuf (= pilot-id ?id)]]
  =>
  (let [state (->PilotState ?id ?hp-buf)
        _ (println state)
        _ (insert! state)]))

(defrule card-buf
  "Add card buf"
  [SetCardPilot (= card-id ?card-id) (= ?pilot-id pilot-id)]
  [PilotState (= id ?pilot-id) (= ?hp hp)]
  =>
  (let [cardbuf (->CardBuf "base" ?card-id ?hp)
        _ (println cardbuf)
        _ (insert! cardbuf)]))

(defrule card-state
  "Add card state"
  [Card (= ?card-id id)]
  [?hp-buf <- (acc/sum :hp) :from [CardBuf (= card-id ?card-id)]]
  [?all-damage <- (acc/sum :damage) :from [DamageCard (= card-id ?card-id)]]
  =>
  (let [state (->CardState ?card-id (+ 20 ?hp-buf (- ?all-damage)))
        _ (println state)
        _ (insert! state)]))

(defrule trigger-attack
  [?attack <- Attack (= ?id id) (= ?card-id card-id) (= ?damage damage)]
  =>
  (println "Trigger attack" ?attack)
  (insert! (->DamageSound ?id ?card-id ?damage))
  (insert! (->DamageCard ?id ?card-id ?damage)))

(defrule trigger-damage
  [?damage <- DamageCard] 
  =>
  (println "Trigger damage" ?damage))

(defrule trigger-sound
  [?damage-sound <- DamageSound]
  =>
  (println "Trigger sound" ?damage-sound))
(defrule trigger-dead
  [?card <- Card (= ?card-id id)]
  [?card-state <- CardState (= id ?card-id) (= ?hp hp)]
  [:test (<= ?hp 0)]
  =>
  (println "Trigger dead" ?card-state)
  (insert! (->DeadCard ?card-id)))

(defquery get-card-states []
  [?items <- CardState])
 
(defquery get-pilots []
  [?items <- PilotState])

(defquery get-dead-cards []
  [?items <- DeadCard])

(defn -main [args]
  (let [session (-> (mk-session 'app1.core2)
                    (insert (->Card "a" true false)
                            (->Card "b" true false)
                            (->Pilot "pilotA" 20)
                            (->SetCardPilot "a" "pilotA")
                            (->Attack (gensym) "a" 30)
                            (->Attack (gensym) "a" 20)
                            )
                    (fire-rules))
        _ (println (query session get-card-states))
        _ (println (query session get-pilots))
        _ (println (query session get-dead-cards))]
    (println "ok")
    session))