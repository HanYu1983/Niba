#_{:clj-kondo/ignore [:underscore-in-namespace]}
(ns game.data.179030_11E_U_BL209R_blue
  (:require [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.data.dynamic]))
;; 179030_11E_U_BL209R_blue
;; R
;; CCA
;; νガンダム［†］
;; νガンダム系　MS　専用「アムロ・レイ」
;; 戦闘配備　〔１〕：サイコミュ（３）　〔１〕：改装［νガンダム系］
;; 『恒常』：本来の記述に「特徴：装弾」を持つ自軍Gがある場合、このカードは、合計国力ー１してプレイできる。
;; 『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。
(def value (->> {:gsign [:blue :uc]
                 :type :unit
                 :texts {"『恒常』：play card"
                         {:type [:automatic :constant]
                          :conditions {"合計國力6"
                                       {:tips '(fn [ctx runtime] ctx)
                                        :count 0
                                        :options {}
                                        :action '(fn [ctx runtime]
                                                   (-> ctx game.data.dynamic/get-my-g count (> 6)))}
                                       "横置3個藍G"
                                       {:tips '(fn [ctx runtime] ctx
                                                 (-> ctx game.data.dynamic/get-my-g-can-tap))
                                        :count 3
                                        :options {}
                                        :action '(fn [ctx runtime]
                                                   ctx)}
                                       "在手牌或hanger"
                                       {:action '(fn [ctx] ctx)}
                                       "在配備階段"
                                       {:action '(fn [ctx] ctx)}
                                       "放到play-card-zone"
                                       {:tips '(fn [ctx runtime]
                                                 ctx)
                                        :action '(fn [ctx runtime]
                                                   ctx)}}
                          :logic {"出機體"
                                  ['(And (Leaf "合計國力6") (Leaf "横置3個藍G") (Leaf "放到play-card-zone"))
                                   '(fn [ctx runtime]
                                      (game.data.dynamic/cut-in ctx (->> {:reason [:play-card ""]
                                                                            :text (->> {:type :system
                                                                                        :logic {"移到場上"
                                                                                                [nil
                                                                                                 '(fn [ctx runtime]
                                                                                                    ctx)]}}
                                                                                       (merge game.define.card-text/card-text-value)
                                                                                       (clojure.spec.alpha/assert :game.define.card-text/value))}
                                                                           (merge game.define.effect/effect-value)
                                                                           (clojure.spec.alpha/assert :game.define.effect/value))))]}}

                         "『恒常』：本来の記述に「特徴：装弾」を持つ自軍Gがある場合、このカードは、合計国力ー１してプレイできる。"
                         {:type [:automatic :constant]
                          :game-effects ['(fn [ctx runtime]
                                            (let [enabled (-> ctx game.data.dynamic/get-my-g (#(mapcat game.data.dynamic/get-card-chars %)) (contains? "装弾"))]
                                              (when enabled
                                                {:description "このカードは、合計国力ー１してプレイできる。"})))]}
                         "『常駐』：青のGサインを持つ自軍Gが５枚以上ある場合、このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。"
                         {:type [:automatic :residents]
                          :game-effects ['(fn [ctx runtime]
                                            (let [is-every-blue-g (-> ctx game.data.dynamic/get-my-g (#(map game.data.dynamic/get-card-color)) (#(map game.data.dynamic/is-card-color-blue)) every?)
                                                  is-my-g-more-then-5 (-> ctx game.data.dynamic/get-my-g count (> 5))
                                                  enabled (and is-every-blue-g is-my-g-more-then-5)]
                                              (when enabled
                                                {:description "このカードと同じエリアにいる全ての自軍ユニットは、敵軍効果では破壊されずダメージを受けない。"})))]}}}
                (merge game.define.card-proto/default-card-proto-value)))


(defn tests []
  (->> value (s/assert :game.define.card-proto/value)))