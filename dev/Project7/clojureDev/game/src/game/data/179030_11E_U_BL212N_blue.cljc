#_{:clj-kondo/ignore [:underscore-in-namespace]}
(ns game.data.179030_11E_U_BL212N_blue
  (:require [clojure.spec.alpha :as s]
            [game.define.card-proto]
            [game.data.dynamic]))
;; 179030_11E_U_BL212N_blue
;; N
;; CCA
;; ジェガン重装型
;; ジェガン系　MS
;; 『起動』：このカードが場に出た場合、本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。   
(def value (->> {:gsign [:blue :uc]
                 :type :unit
                 :texts {"『起動』：このカードが場に出た場合、本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。"
                         {:type [:automatic :trigger]
                          :events
                          ['(fn [ctx runtime evt]
                              (clojure.core.match/match evt
                                [:on-enter-field {:card-id on-enter-card-id}]
                                (let [this-card-id (-> runtime game.define.runtime/get-card-id)]
                                  (if (-> this-card-id (= on-enter-card-id))
                                    (game.data.dynamic/add-immediate-effect ctx (->> {:reason [:card-text this-card-id]
                                                                                      :text (merge game.define.card-text/card-text-value
                                                                                                   {:type :system
                                                                                                    :conditions {"本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。"
                                                                                                                 {:tips '(fn [ctx runtime]
                                                                                                                           (let [card-tips (-> ctx get-g-cards (has-origin-char "装弾"))
                                                                                                                                 card-basyou-tips (-> card-tips (map get-basyou) (zipmap card-tips) vec)]
                                                                                                                             card-basyou-tips))
                                                                                                                  :type :card
                                                                                                                  :count 1
                                                                                                                  :options {:can-cancel true}
                                                                                                                  :action '(fn [ctx runtime]
                                                                                                                       ; 自軍ハンガーに移す事ができる。
                                                                                                                             (let [[sel-card-id basyou] (-> ctx
                                                                                                                                                            (get-selection "本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。"))
                                                                                                                                   ctx (-> ctx (move-card sel-card-id basyou [:A :hanger]))]
                                                                                                                               ctx))}}
                                                                                                    :logic {"その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。"
                                                                                                            ['(Leaf "本来の記述に「特徴：装弾」を持つ自軍G１枚を、自軍ハンガーに移す事ができる。")
                                                                                                             '(fn [ctx runtime]
                                                                                                          ; その場合、自軍本国の上のカード１枚を、ロール状態で自軍Gにする。
                                                                                                                ctx)]
                                                                                                            "do nothing"
                                                                                                            ['(And) '(fn [ctx runtime] ctx)]}})}
                                                                                     (merge game.define.effect/effect-value)))))
                                :else ctx))]}}}
                (merge game.define.card-proto/default-card-proto-value)))


(defn tests []
  (->> value (s/assert :game.define.card-proto/value)))