(ns game.data.core
  (:require [clojure.core :refer [read-string]]
            [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.data.179030_11E_U_BL212N_blue]
            [game.data.179030_11E_U_BL209R_blue]))

(defn get-card-data [card-id]
  (-> (str "game.data." card-id "/value") read-string eval))

(defn tests []
  (game.data.179030_11E_U_BL212N_blue/tests)
  (game.data.179030_11E_U_BL209R_blue/tests)
  (-> "179030_11E_U_BL212N_blue" get-card-data :gsign (= [:blue :uc]) (or (throw (ex-info "must blue uc" {})))))


(defn test-card-proto []
(let [;; 179030_11E_U_BL213S_blue
        ;; S
        ;; 閃光のハサウェイ
        ;; ペーネロペー［†］
        ;; ペーネロペー系　MS　専用「レーン・エイム」
        ;; 戦闘配備　高機動　〔１〕：改装［ペーネロペー系］
        ;; 『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。
        ;; 『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。
      card-proto-179030_11E_U_BL213S_blue
      (merge game.define.card-proto/default-card-proto-value
             {:gsign [:blue :uc]
              :type :unit
              :texts {"『常駐』：このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。"
                      {:type [:automatic :residents]
                       :game-effects ['(fn [ctx runtime]
                                         (let [x (-> ctx get-my-hand count)]
                                           {:description "このカードは、＋X／＋X／＋Xを得る。Xの値は、自軍手札の枚数とする。"
                                            :battle-point [x x x]}))]}
                      "『起動』：このカードが場に出た場合、カード３枚を引く。この記述の効果は、プレイヤー毎に１ターンに１回しか起動しない。"
                      {:type [:automatic :trigger]
                       :events
                       ['(fn [ctx runtime evt]
                           (clojure.core.match/match evt
                             [:on-end-turn {:player-id player-id}]
                             (-> ctx
                                 (get-card-state this-card-id)
                                 (dissoc "このカードが場に出た場合、カード３枚を引く")
                                 (#(set-card-state ctx this-card-id %)))
                             [:on-enter-field {:card-id on-enter-card-id}]
                             (let [this-card-id (-> runtime game.define.runtime/get-card-id)
                                   not-yet (-> ctx
                                               (get-card-state this-card-id)
                                               (get "このカードが場に出た場合、カード３枚を引く")
                                               nil?)]
                               (if (-> this-card-id (= on-enter-card-id) (and not-yet))
                                 (add-immediate-effect ctx (merge game.define.effect/effect-value
                                                                  {:reason [:card-text this-card-id]
                                                                   :text (merge game.define.card-text/card-text-value
                                                                                {:type :system
                                                                                 :logic {"このカードが場に出た場合、カード３枚を引く"
                                                                                         ['(And)
                                                                                          '(fn [ctx runtime]
                                                                                             (let [ctx (-> ctx
                                                                                                           (get-card-state this-card-id)
                                                                                                           (assoc "このカードが場に出た場合、カード３枚を引く")
                                                                                                           (#(set-card-state ctx this-card-id %))
                                                                                                           (draw-card 3))]
                                                                                               ctx))]}})}))

                                 ctx))))]}}})

      play-card-effect
      (merge game.define.effect/effect-value
             {:reason [:play-card ""]
              :text (merge game.define.card-text/card-text-value
                           {:type :system
                            :conditions {"合計國力6"
                                         {:tips '(fn [ctx runtime] ctx)
                                          :count 0
                                          :options {}
                                          :action '(fn [ctx runtime]
                                                     (-> ctx get-my-g count (> 6)))}
                                         "横置3個藍G"
                                         {:tips '(fn [ctx runtime] ctx
                                                   (-> ctx get-my-g-can-tap))
                                          :count 3
                                          :options {}
                                          :action '(fn [ctx runtime]
                                                       ; tap
                                                     ctx)}
                                         "放到play-card-zone"
                                         {:tips '(fn [ctx runtime]
                                                   ctx)
                                          :action '(fn [ctx runtime]
                                                     ctx)}}
                            :logic {"出機體"
                                    ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                                     '(fn [ctx runtime]
                                        (game.common.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                                              :text (->> {:type :system
                                                                                          :logic {"移到場上"
                                                                                                  [nil
                                                                                                   '(fn [ctx runtime]
                                                                                                      ctx)]}}
                                                                                         (merge game.define.card-text/card-text-value)
                                                                                         (s/assert :game.define.card-text/value))}
                                                                             (merge game.define.effect/effect-value)
                                                                             (s/assert :game.define.effect/value))))]}})})]))