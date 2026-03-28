(ns app1.core2
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id isFaceUp isTap])
(defrecord CardState [id hp])
(defrecord Attack [id card-id damage])
(defrecord DamageCard [id card-id damage])
(defrecord DamageSound [id card-id damage])
(defrecord DeadCard [card-id])

(defrule add-card-state
  "Add card state"
  [?card <- Card]
  =>
  (println "Add card state" ?card)
  (insert! (->CardState (:id ?card) 20)))

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
  [?card-state <- CardState (= ?card-id id) (= ?hp hp)]
  [?all-damage <- (acc/sum :damage) :from [DamageCard (= card-id ?card-id)]]
  [:test (>= ?all-damage ?hp)]
  =>
  (println "Trigger dead" ?card-state)
  (insert! (->DeadCard ?card-id)))

(defn -main [args]
  (let [session (-> (mk-session 'app1.core2)
                    (insert (->Card "a" true false)
                            (->Card "b" true false)
                            (->Attack (gensym) "a" 10)
                            (->Attack (gensym) "a" 20))
                    (fire-rules))]
    (println "ok")
    session))