(ns tutorial.ch07.target-selection
  (:require [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

;; 單位
(defrecord Unit [id name team hp max-hp attack distance threat-value])

;; 仇恨值
(defrecord Hate [source-id target-id value])

;; 增益效果
(defrecord Buff [unit-id type value duration])

;; 目標選擇請求
(defrecord TargetSelection [ai-unit-id priority-criteria])

;; 候選目標
(defrecord CandidateTarget [target-id score factors])

;; 最終選定的目標
(defrecord SelectedTarget [ai-unit-id target-id reason])

(defrecord HateAdjusted [target-id])
(defrecord BuffAdjusted [target-id])
(defrecord HealerPriority [target-id])
(defrecord LowHealthPriority [target-id])

(defrecord GameStart [])

;; 規則1：計算基礎威脅分數
(defrule calculate-base-threat
  [Unit (= id ?ai-id) (= team :enemy)]
  [Unit (= id ?target-id) (= team :friendly) (= hp ?hp) (= max-hp ?max-hp)
   (= distance ?dist) (= threat-value ?base-threat)]
  ;(not [CandidateTarget (= target-id ?target-id)])
  ;[:not [CandidateTarget (= target-id ?target-id)]] 
  =>
  (let [health-factor (/ (- ?max-hp ?hp) ?max-hp)  ;; 血量越低分數越高
        distance-factor (/ 1 (max 1 ?dist))         ;; 距離越近分數越高
        threat-score (* ?base-threat
                        (+ 0.5 (* 2 health-factor) (* 0.3 distance-factor)))]
    (println "calculate-base-threat" ?target-id threat-score)
    (insert-unconditional! (->CandidateTarget ?target-id threat-score
                                              {:health health-factor
                                               :distance distance-factor
                                               :base ?base-threat}))))

;; 規則2：考慮仇恨值調整分數
(defrule adjust-by-hate
  [?candidate <- CandidateTarget (= target-id ?target-id) (= score ?score)]
  [?total-hate <- (acc/sum :value) :from [Hate (= source-id ?ai-id) (= target-id ?target-id)]]
  (not [HateAdjusted (= target-id ?target-id)])
  =>
  (let [hate-factor (min 2.0 (/ ?total-hate 100))  ;; 仇恨值最高提升2倍
        new-score (* ?score (+ 1 hate-factor))]
    (println "adjust-by-hate" ?target-id new-score)
    (retract! ?candidate)
    (insert-unconditional! (assoc ?candidate :score new-score))
    (insert-unconditional! (->HateAdjusted ?target-id))))

;; 規則3：考慮增益效果調整分數
(defrule adjust-by-buff
  [?candidate <- CandidateTarget (= target-id ?target-id) (= score ?score)]
  [Buff (= unit-id ?target-id) (= type :defense-buff) (= value ?value)]
  (not [BuffAdjusted (= target-id ?target-id)])
  =>
  (let [defense-penalty (/ 1 (+ 1 (* ?value 0.1)))  ;; 防禦增益降低優先級
        new-score (* ?score defense-penalty)]
    (println "adjust-by-buff" ?target-id new-score)
    (retract! ?candidate)
    (insert-unconditional! (assoc ?candidate :score new-score))
    (insert-unconditional! (->BuffAdjusted ?target-id))))

;; 規則4：特殊目標優先級（例如：治療者優先擊殺）
(defrule prioritize-healers
  [?candidate <- CandidateTarget (= target-id ?target-id) (= score ?score)]
  [Unit (= id ?target-id) (= name ?name) (re-find #"牧師" ?name)]
  (not [HealerPriority (= target-id ?target-id)])
  =>
  (println "prioritize-healers" ?target-id (* ?score 1.5))
  (retract! ?candidate)
  (insert-unconditional! (assoc ?candidate :score (* ?score 1.5)))
  (insert-unconditional! (->HealerPriority ?target-id)))

;; 規則5：瀕死目標優先擊殺
(defrule prioritize-low-health
  [?candidate <- CandidateTarget (= target-id ?target-id) (= score ?score)]
  [Unit (= id ?target-id) (= hp ?hp) (= max-hp ?max-hp) (< ?hp (* ?max-hp 0.15))]
  (not [LowHealthPriority (= target-id ?target-id)])
  =>
  (println "prioritize-low-health" ?target-id (* ?score 2.0))
  (retract! ?candidate)
  (insert-unconditional! (assoc ?candidate :score (* ?score 2.0)))
  (insert-unconditional! (->LowHealthPriority ?target-id)))

;; 規則6：選出最終目標（最高分數）
(defrule select-best-target
  [?max-score <- (acc/max :score) :from [CandidateTarget]]
  [?best-targets <- (acc/all) :from [CandidateTarget (= score ?max-score)]]
  [TargetSelection (= ai-unit-id ?ai-id)]
  [?selectedTarget <- SelectedTarget 
   (= ai-unit-id ?ai-id) 
   (= target-id ?target-id) 
   ; 不同目標才要換對象, 不然重新插入相同目標會導致無限迴圈
   (not= (-> ?best-targets first :target-id) ?target-id)]
  =>
  (let [target (first ?best-targets)]
    (println "select-best-target" (:target-id target) ?max-score)
    (retract! ?selectedTarget)
    (insert-unconditional! (->SelectedTarget ?ai-id (:target-id target) (str "max-score:" ?max-score)))))

;; 規則7：沒有候選目標時的行為
(defrule no-target-found
  [TargetSelection (= ai-unit-id ?ai-id)]
  (not [CandidateTarget])
  [?selectedTarget <- SelectedTarget (= ai-unit-id ?ai-id)]
  =>
  (println "no-target-found")
  (retract! ?selectedTarget)
  (insert-unconditional! (->SelectedTarget ?ai-id nil "no-target-found")))

(defrule default-selected-target
  "預設的SelectedTarget要先建好"
  [TargetSelection (= ai-unit-id ?ai-id)]
  =>
  (println "default-selected-target")
  (insert-unconditional! (->SelectedTarget ?ai-id nil "default-selected-target")))

(defquery getCandidateTarget []
  [?item <- CandidateTarget])

(defquery getSelectedTarget []
  [?item <- SelectedTarget])

(defrule game-start
  [?evt <- GameStart]
  =>
  (insert-unconditional! (->Unit "ai-1" "哥布林領袖" :enemy 150 150 30 0 50))
  (insert-unconditional! (->Unit "player-1" "戰士" :friendly 10 100 20 5 30))
  (insert-unconditional! (->Unit "player-2" "牧師" :friendly 60 80 15 8 40))
  (insert-unconditional! (->Unit "player-3" "法師" :friendly 45 60 35 10 35))
  (insert-unconditional! (->Hate "ai-1" "player-1" 45))
  (insert-unconditional! (->Hate "ai-1" "player-2" 30))
  (insert-unconditional! (->Hate "ai-1" "player-3" 60))
  (insert-unconditional! (->Buff "player-2" :defense-buff 5 10))
  (insert-unconditional! (->TargetSelection "ai-1" [:threat :health :distance]))
  (retract! ?evt))

(defn simulate-target-selection []
  (let [session (-> (mk-session 'tutorial.ch07.target-selection)
                    (insert (->GameStart))
                    (fire-rules))]

    (println "=== AI 目標選擇結果 ===")
    (println "getCandidateTarget:" (query session getCandidateTarget))
    (println "getSelectedTarget:" (query session getSelectedTarget))))

(defn -main [args]
  (simulate-target-selection))