(ns tutorial.ch06.combo-system
  (:require [clara.rules :refer :all]))

(defrecord GameStartEvent [])

;; 玩家動作事件
(defrecord ActionEvent [player-id action timestamp frame])

;; 連擊規則定義
(defrecord ComboRule [id name actions required-time-window damage])

;; 連擊狀態
(defrecord ComboState [player-id current-step last-action-time matched-actions])

;; 連擊執行結果
(defrecord ComboExecuted [player-id combo-name damage timestamp])

;; 連擊超時
(defrecord ComboTimeout [player-id])

;; 預定義連擊規則
(def combo-rules
  [(->ComboRule "combo-1" "三連擊" [:light :light :heavy] 3000 50)
   (->ComboRule "combo-2" "快速連打" [:light :light :light] 1500 40)
   (->ComboRule "combo-3" "重擊終結" [:light :heavy :special] 4000 80)
   (->ComboRule "combo-4" "極限連段" [:special :light :heavy :special] 5000 150)])

(defrule game-start
  [?evt <- GameStartEvent]
  =>
  (insert-unconditional! (->ActionEvent "player-1" :light 1000 1))
  (insert-unconditional! (->ActionEvent "player-1" :light 1200 2))
  (insert-unconditional! (->ActionEvent "player-1" :heavy 1400 3))
  (insert-unconditional! (->ActionEvent "player-1" :light 1600 4))
  (insert-unconditional! (->ActionEvent "player-1" :heavy 1800 5))
  (insert-unconditional! (->ActionEvent "player-1" :special 2000 6))
  (retract! ?evt))

;; 規則1：開始新連擊
(defrule start-combo
  [ActionEvent (= player-id ?player-id) (= action ?action) (= timestamp ?ts)] 
  [ComboRule [{id :id [action & _] :actions}] (= id ?rule-id) (= action ?action)]
  [:not [ComboState (= player-id ?player-id)]]
  =>
  (println "start-combo" ?player-id 1 ?ts [?action] ?rule-id)
  (insert-unconditional! (->ComboState ?player-id 1 ?ts [?action])))

;; 規則2：延續連擊
(defrule continue-combo
  [ActionEvent (= player-id ?player-id) (= action ?action) (= timestamp ?ts)]
  [?state <- ComboState
   (= player-id ?player-id) (= current-step ?step)
   (= last-action-time ?last-ts) (= matched-actions ?matched)]
  [ComboRule
   (= id ?rule-id) (= actions ?actions) (= required-time-window ?time-window)
   (< ?step (count ?actions)) (= (nth ?actions ?step) ?action)]
  [:test (> ?ts ?last-ts)]
  [:test (<= (- ?ts ?last-ts) ?time-window)]
  =>
  (let [new-step (inc ?step)
        new-matched (conj ?matched ?action)]
    (println "continue-combo" ?rule-id new-step new-matched)
    (retract! ?state)
    (insert-unconditional! (assoc ?state
                                  :current-step new-step
                                  :last-action-time ?ts
                                  :matched-actions new-matched))))

;; 規則3：完成連擊
(defrule complete-combo
  [?state <- ComboState
   (= player-id ?player-id) (= current-step ?step)
   (= matched-actions ?actions) (= last-action-time ?ts)]
  [ComboRule
   (= id ?rule-id) (= actions ?actions)
   (= name ?name) (= damage ?damage)]
  [:test (= ?step (count ?actions))]  ;; 已匹配所有動作
  =>
  (println "complete-combo" ?rule-id)
  (insert-unconditional! (->ComboExecuted ?player-id ?rule-id ?damage ?ts))
  (retract! ?state))

;; 規則4：連擊超時
(defrule combo-timeout
  [?state <- ComboState (= player-id ?player-id) (= last-action-time ?last-ts)]
  [ActionEvent (= player-id ?player-id) (= action ?action) (= timestamp ?ts)]
  [:test (> (- ?ts ?last-ts) 3000)]  ;; 3秒無動作
  =>
  (println "combo-timeout" ?action ?ts)
  (insert-unconditional! (->ComboTimeout ?player-id))
  (retract! ?state))

;; 規則5：連擊失敗（動作不匹配）
(defrule combo-failure
  [ActionEvent (= player-id ?player-id) (= action ?action) (= timestamp ?ts)]
  [?state <- ComboState
   (= player-id ?player-id) (= current-step ?step)
   (= last-action-time ?last-ts)]
  [ComboRule (= actions ?actions) (< ?step (count ?actions)) (not= ?action (nth ?actions ?step))]
  [:test (> ?ts ?last-ts)]
  [:test (<= (- ?ts ?last-ts) 3000)]
  =>
  (println "combo-failure" ?actions ?step)
  (retract! ?state))

(defquery get-action-event []
  [?item <- ActionEvent])

(defquery getComboState []
  [?item <- ComboState])

(defquery getComboExecuted []
  [?item <- ComboExecuted])

(defn simulate-combo-system []
  (let [session (-> (mk-session 'tutorial.ch06.combo-system)
                    (insert-all combo-rules)
                    (insert (->GameStartEvent))
                    (fire-rules))]

    (println "=== 連擊系統執行結果 ===")
    ;(println "執行的連擊:" (query session ComboExecuted))
    ;(println "連擊超時:" (query session ComboTimeout))
    ;(println "連擊狀態:" (query session ComboState))
    (println "get-action-event" (query session get-action-event))
    (println "getComboState" (query session getComboState))
    (println "getComboExecuted" (query session getComboExecuted))
    ))

(defn -main [args]
  (simulate-combo-system))