(ns tutorial.ch02
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

;; 單位
(defrecord Unit [id name hp max-hp attack defense level status])

;; 裝備
(defrecord Equipment [id unit-id type attack-bonus defense-bonus])

;; 事件
(defrecord DamageEvent [unit-id amount source-id])
(defrecord HealEvent [unit-id amount source-id])
(defrecord GameStartEvent [])

;; 狀態標記
(defrecord DeadUnit [unit-id])
(defrecord Poisoned [unit-id duration remaining])
(defrecord Enraged [unit-id attack-bonus])

;; 推論結果
(defrecord TotalAttack [unit-id value])
(defrecord TotalDefense [unit-id value])

;; 規則1：計算總攻擊力（基礎 + 裝備）
(defrule calculate-total-attack
  [Unit (= id ?id) (= attack ?base)]
  [?eqs <- (acc/all) :from [Equipment (= unit-id ?id)]]
  =>
  (let [eqs-atk-bonus (->> ?eqs (map :attack-bonus) (apply +))]
    (insert! (->TotalAttack ?id (+ ?base eqs-atk-bonus)))))

;; 規則2：計算總防禦力
(defrule calculate-total-defense
  [Unit (= id ?id) (= defense ?base)]
  [?eqs <- (acc/all) :from [Equipment (= unit-id ?id)]]
  [?ens <- (acc/all) :from [Enraged (= unit-id ?id)]]
  =>
  (let [eqs-def-bonus (->> ?eqs (map :defense-bonus) (apply +))
        ens-atk-bonus (->> ?ens (map :attack-bonus) (apply +))]
     (insert! (->TotalDefense ?id (+ ?base eqs-def-bonus ens-atk-bonus)))))

;; 規則3：傷害計算與應用
(defrule apply-damage
  [DamageEvent (= unit-id ?id) (= amount ?damage)]
  [TotalDefense (= unit-id ?id) (= value ?defense)]
  [?unit <- Unit (= id ?id) (= hp ?hp)]
  [:not [DeadUnit (= unit-id ?id)]]
  => 
  (let [reduced-damage (max 1 (- ?damage ?defense))
        new-hp (max 0 (- ?hp reduced-damage))]
    (println "apply-damage" new-hp)
    (retract! ?unit)
    (insert-unconditional! (assoc ?unit :hp new-hp))
    (when (<= new-hp 0)
      (insert-unconditional! (->DeadUnit ?id)))))

;; 規則4：瀕死狂暴（生命值 < 30% 時獲得攻擊加成）
(defrule near-death-rage
  [Unit (= id ?id) (= hp ?hp) (= max-hp ?max-hp) (< ?hp (* ?max-hp 0.3))]
  [:not [Enraged (= unit-id ?id)]]
  =>
  (println "near-death-rage" ?hp)
  (insert-unconditional! (->Enraged ?id 50)))

;; 規則5：中毒持續傷害
(defrule poison-damage
  [?poison <- Poisoned (= unit-id ?id) (= remaining ?remaining)]
  [?unit <- Unit (= id ?id) (= hp ?hp)]
  [:test (>= ?remaining 1)]
  [:not [DeadUnit (= unit-id ?id)]]
  =>
  (let [new-hp (max 0 (- ?hp 10))
        new-remaining (dec ?remaining)
        new-unit (assoc ?unit :hp new-hp)
        new-poison (assoc ?poison :remaining new-remaining)]
    (println "poison-damage" new-hp new-remaining)
    (retract! ?unit)
    (insert-unconditional! new-unit)
    (retract! ?poison) 
    (insert-unconditional! new-poison)
    (when (<= new-hp 0)
      (insert-unconditional! (->DeadUnit ?id)))))


(comment
  (simulate-combat))
  

(defquery get-dead-unit []
  [?item <- DeadUnit])

(defquery get-enraged []
  [?item <- Enraged])

(defquery get-unit []
  [?item <- Unit])

(defquery get-poisoned []
  [?item <- Poisoned])

(defquery get-totalAttack []
  [?item <- TotalAttack])

(defrule game-start
  [?evt <- GameStartEvent]
  =>
  (insert-unconditional! (->Unit "warrior" "戰士" 100 100 30 0 5 :idle))
  (insert-unconditional! (->Unit "mage" "法師" 80 80 25 10 5 :idle))
  (insert-unconditional! (->Equipment "sword" "warrior" :weapon 15 0))
  (insert-unconditional! (->Equipment "armor" "warrior" :armor 0 10))
  (insert-unconditional! (->Poisoned "warrior" 3 3))
  (insert-unconditional! (->DamageEvent "warrior" 30 "mage"))
  (retract! ?evt))

(defn simulate-combat []
  (let [session (-> (mk-session 'tutorial.ch02)
                    (insert (->GameStartEvent))
                    (fire-rules))]
    
    (println "=== 戰鬥結果 ===")
    (println "get-dead-unit:" (query session get-dead-unit))
    (println "get-enraged:" (query session get-enraged))
    (println "get-unit:" (query session get-unit))
    (println "get-poisoned:" (query session get-poisoned))
    (println "get-totalAttack" (query session get-totalAttack))
    ))

(defn -main [args]
  (simulate-combat))
