(ns app1.core
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id isFaceUp isTap])
(defrecord CardStack [id card-ids])
(defrecord CardState [id damage])

(defrecord Attack [id damage])

(defrecord HasAttack [id damage])
(defrecord HasAttackSound [id damage])

(defrule add-card-state
  "Add card state"
  [?card <- Card]
  =>
  (println "Add card state" ?card)
  (insert-unconditional! (->CardState (:id ?card) 0)))

(defrule attack-card
  "attack card"
  {:salience -10}
  [?attack <- Attack (= ?id id) (= ?damage damage)]
  =>
  (println "Attack card" ?attack)
  (insert-unconditional! (->HasAttack ?id ?damage))
  (insert-unconditional! (->HasAttackSound ?id ?damage))
  (retract! ?attack))

(defrule has-attack 
  "has attack"
  [?has-attack <- HasAttack (= ?id id) (= ?damage damage)]
  [?card-state <- CardState (= id ?id)]
  =>
  (println "Has attack" ?has-attack)
  (retract! ?has-attack)
  (retract! ?card-state) 
  (insert-unconditional! (assoc ?card-state :damage (+ (:damage ?has-attack) (:damage ?card-state)))))

(defrule has-attack-sound
  "attack sound card"
  [?attack-sound <- HasAttackSound]
  =>
  (println "has attack sound" ?attack-sound)
  (retract! ?attack-sound))


(defquery get-card-states []
  [?card-state <- CardState])

(defquery get-card-by-id [?id]
  [?card <- Card (= id ?id)])

(defquery get-cards []
  [?card <- Card])

(defquery get-all []
  [?item <- :any])

(defn -main [args]
  (let [session (-> (mk-session 'app1.core)
                    (insert (->Card "a" true false)
                            (->Card "b" true false))
                    (fire-rules))
        _ (println (query session get-card-states))
        session (-> session
                    (insert (->Attack "b" 10))
                    (insert (->Attack "b" 20))
                    (fire-rules))
        _ (println (query session get-card-states))
        card-a (-> (query session get-card-by-id :?id "a") first :?card)
        ;_ (println card-a)
        session (-> session
                    (retract card-a)
                    (fire-rules))
        _ (println (query session get-card-states))]
    (println "Hello, World!")))