(ns game.define.card-text
  (:require [clojure.spec.alpha :as s]
            [tool.logic-tree :as logic-tree]))
(s/def ::script (fn [v] (-> v seq? (and (-> v eval fn?)))))
(s/def ::use-timing (s/tuple #{:any :turn :draw :reroll :maintenance :battle :attack :defense :damage-checking :return}
                             #{:any :own :enemy}))
(s/def ::description string?)
(s/def ::special-effect (s/or :psycommu (s/tuple #{:psycommu} int?)))
(s/def ::type (s/or :automatic (s/tuple #{:automatic} #{:residents :trigger :constant})
                    :use (s/tuple #{:use} ::use-timing)
                    :special (s/tuple #{:special} ::special-effect)
                    :system #{:system}))
(s/def ::tips ::script)
(s/def ::action ::script)
(s/def ::condition (s/keys :opt-un [::tips ::action]))
(s/def ::conditions (s/map-of any? ::condition))
(s/def ::events (s/coll-of ::script))
(s/def ::game-effects (s/coll-of ::script))
(s/def ::logic-tree list?)
(s/def ::logic (s/keys :opt-un [::logic-tree ::action]))
(s/def ::logics (s/map-of string? ::logic))
(s/def ::is-surrounded-by-arrows boolean?)
(s/def ::value (s/keys :req-un [::type]
                       :opt-un [::description ::events ::game-effects ::conditions ::logics ::action ::is-surrounded-by-arrows]))

(def card-text-value {:type :system})

(defn create []
  {:type :system})

(defn get-conditions [text]
  (s/assert ::value text)
  (-> text :conditions))
(defn filter-player-condition [text condition player-id])
(defn is-condition-belong-to-player-id [condition player-id]
  true)
(defn get-logics [text]
  (s/assert ::value text)
  (-> text :logics))
(defn can-pass-conditions [text logic-id selection])

(defn get-logics-ids [text]
  (s/assert ::value text)
  (-> text :logics keys))

(defn get-logic-tree [logic]
  (s/assert ::logic logic)
  (-> logic :logic-tree))

(defn get-logic-action [logic]
  (s/assert ::logic logic)
  (-> logic :action eval))

(defn get-logic-conditions [text logic]
  (s/assert ::value text)
  (s/assert ::logic logic)
  (let [all-condition-ids (-> logic get-logic-tree logic-tree/enumerateAll flatten)
        my-conditions (->> all-condition-ids
                           (map (-> text get-conditions))
                           (zipmap all-condition-ids)
                           (into {}))]
    my-conditions))

(defn get-condition-tips [condition]
  (s/assert ::condition condition)
  (-> condition :tips eval))

(defn get-condition-action [condition]
  (s/assert ::condition condition)
  (-> condition :action eval))

(defn is-surrounded-by-arrows [text]
  (s/assert ::value text)
  (-> text :is-surrounded-by-arrows (or false)))

(defn get-game-effects [text]
  (s/assert ::value text)
  (-> text :game-effects (#(map eval %))))

; 自軍配備階段一次
; check player status map has-play-g
(defn get-play-g-text []
  (let [text (->> {:logic {"play-g"
                           [nil
                            '(fn [ctx runtime]
                               ; 直立進場
                               ctx)]}}
                  (merge card-text-value))]))

(defn test-logic []
  (let [; P20
        ; 宣告play
        text (->> {:conditions {"condition1"
                                {:tips '(fn [] :tips) :action '(fn [] :action)}
                                "condition2"
                                {:tips '(fn []) :action '(fn [])}}
                   :logics {"condition1 and condition2" {:logic-tree '(And (Leaf "condition1") (Leaf "condition2")) :action '(fn [])}
                            "condition1" {:logic-tree '(Leaf "condition1") :action '(fn [])}}}
                  (merge card-text-value)
                  (s/assert ::value))
        _ (-> text get-logics-ids vec (= ["condition1 and condition2" "condition1"]) (or (throw (ex-info "logic-options not right" {}))))
        ; 指定對象, 對象無法滿足的話不能play
        conditions (-> text get-logics (get (-> text get-logics-ids first)) (#(get-logic-conditions text %)))
        tips (-> conditions (get "condition1") get-condition-tips)
        _ (-> (tips) (= :tips) (or (throw (ex-info "must tips" {}))))
        ; 支付
        action (-> conditions (get "condition1") get-condition-action)
        _ (-> (action) (= :action) (or (throw (ex-info "must action" {}))))
        ; 效果發生
        ]))

(defn tests []
  (test-logic)
  (->> {:description ""
        :events []
        :game-effects []
        :conditions {"" {:tips '(fn []) :action '(fn [])}}
        :logics {"" {:logic-tree '(And (Leaf "")) :action '(fn [])}}
        :is-surrounded-by-arrows false}
       (merge card-text-value)
       (s/assert ::value)))