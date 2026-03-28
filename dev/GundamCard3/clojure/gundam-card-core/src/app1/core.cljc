(ns app1.core
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

(defrecord Card [id isFaceUp isTap])
(defrecord CardStack [id card-ids])
(defrecord CardState [id damage])

(defrecord Attack [id damage])

(defrecord HasAttack [id])
(defrecord HasAttackSound [id])

(defrule add-card-state
  "Add card state"
  [?card <- Card]
  =>
  (println "Add card state" ?card)
  (insert-unconditional! (->CardState (:id ?card) 0)))

(defrule attack-card
  "attack card"
  {:salience -10}
  [?attack <- Attack (= ?id id)]
  [?card-state <- CardState (= id ?id)]
  [:not (HasAttack (= id ?id))]
  =>
  (println "Attack card" ?attack ?card-state) 
  (retract! ?card-state) 
  (insert-unconditional! (assoc ?card-state :damage (+ (:damage ?attack) (:damage ?card-state))))
  ; ok
  (insert-unconditional! (->HasAttack ?id))
  ; infinite loop
  ;(insert! (->HasAttack ?id))
  )

(defrule attack-sound-card
  "attack sound card"
  {:salience -10}
  [?attack <- Attack (= ?id id)]
  [:not (HasAttackSound (= id ?id))]
  =>
  (println "Attack sound card" ?attack)
  (insert-unconditional! (->HasAttackSound ?id)))

(defrule has-attack-card [?has-attack <- HasAttack]
  =>
  (println "Has attack card" ?has-attack))

(defrule delete-attack-card
  {:salience -100}
  [?attack <- Attack (= ?id id)]
  [?has-attack <- HasAttack (= id ?id)]
  [?attack-sound <- HasAttackSound (= id ?id)]
  =>
  (println "Delete attack card" ?attack)
  (retract! ?attack)
  (retract! ?has-attack)
  (retract! ?attack-sound)
  )

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
                            (->Card "b" true false)
                            )
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
        _ (println (query session get-card-states))
        ]
    (println "Hello, World!")))