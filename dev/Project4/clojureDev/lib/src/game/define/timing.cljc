(ns game.define.timing
  (:require [clojure.spec.alpha :as s]))
(s/def ::phase-keyword #{:reroll 
                         :draw 
                         :maintenance
                         :battle})
(s/def ::step-keyword #{:attack
                        :defense 
                        :damage-checking 
                        :return :end})
(s/def ::timing-keyword #{:start 
                          :free1 
                          :rule 
                          :free2 
                          :end 
                          :damage-reset 
                          :resolve-effect 
                          :adjust-hand 
                          :turn-end})
(s/def ::timing #{;; Reroll
                  [:reroll :start]
                  [:reroll :rule]
                  [:reroll :free2]
                  [:reroll :end]
                  ;; Draw
                  [:draw :start]
                  [:draw :free1]
                  [:draw :rule]
                  [:draw :free2]
                  [:draw :end]
                  ;; Maintenance
                  [:maintenance :start]
                  [:maintenance :free1]
                  [:maintenance :end]
                  ;; Attack
                  [:battle :attack :start]
                  [:battle :attack :free1]
                  [:battle :attack :rule]
                  [:battle :attack :free2]
                  [:battle :attack :end]
                  ;; Defense
                  [:battle :defense :start]
                  [:battle :defense :free1]
                  [:battle :defense :rule]
                  [:battle :defense :free2]
                  [:battle :defense :end]
                  ;; DamageChecking
                  [:battle :damage-checking :start]
                  [:battle :damage-checking :free1]
                  [:battle :damage-checking :rule]
                  [:battle :damage-checking :free2]
                  [:battle :damage-checking :end]
                  ;; Return
                  [:battle :return :start]
                  [:battle :return :free1]
                  [:battle :return :rule]
                  [:battle :return :free2]
                  [:battle :end :damage-reset]
                  [:battle :end :resolve-effect]
                  [:battle :end :adjust-hand]
                  [:battle :end :turn-end]})