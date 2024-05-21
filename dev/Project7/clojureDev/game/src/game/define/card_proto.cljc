(ns game.define.card-proto
  (:import (java.lang Throwable))
  (:require [clojure.spec.alpha :as s]
            [clojure.string]
            [clojure.core :refer [read-string]]
            [game.tool.logic-tree]
            [game.define.card-text]
            [game.define.gsign]))
(s/def ::texts (s/map-of any? :game.define.card-text/value))
(s/def ::type #{:unit :character :command :operation :operation-unit :graphic :ace})
(s/def ::gsign :game.define.gsign/spec)
(s/def ::play-card (s/keys :req-un [:game.define.card-text/script :game.define.card-text/use-timing]))
(s/def ::value (s/keys :req-un [::type ::gsign ::texts]
                       :opt-un [::battle-point ::cost ::pack ::char ::play-card]))
;;(s/def ::spec (s/tuple any? ::value))

(def default-card-proto-value {:gsign [:blue :uc]
                               :type :unit
                               :play-card {:use-timing [:any :any]
                                           :script '(fn [ctx runtime] game.define.card-text/card-text-value)}
                               :texts {}})

(defn do-logic [ctx runtime card-proto text-id logic selections]
  (let [text (-> card-proto second :texts (get text-id))
        conditions (-> text :conditions)
        key-list (keys selections)
        has-logic (game.tool.logic-tree/has logic key-list)
        _ (when (not has-logic)
            (throw (ex-info "not in" {})))
        errs (->> key-list
                  (map (comp eval :action conditions))
                  (zipmap key-list)
                  (map (fn [[key action-fn]]
                         (try [nil (action-fn ctx runtime (selections key))]
                              (catch Throwable e [e nil]))))
                  (filter first)
                  (map first))
        _ (when (-> errs count pos?)
            (throw (ex-info (->> errs
                                 (map #(.getMessage %))
                                 (clojure.string/join ","))
                            {})))
        ctx (->> key-list
                 (map (comp eval :action conditions))
                 (zipmap key-list)
                 (reduce (fn [ctx [key action-fn]]
                           (action-fn ctx runtime (selections key)))
                         ctx))
        action-fn (-> text :action eval)
        ctx (if (not action-fn)
              ctx
              (action-fn ctx runtime))]
    ctx))

(defn test-do-logic []
  (let [ctx {}
        runtime {}
        card-proto ["gundam"
                    {:play-card {:use-timing [:any :any]
                                 :script '(fn [ctx runtime]
                                            game.define.card-text/card-text-value)}
                     :texts {"gundam-text-1"
                             {:type [:special [:psycommu 3]]
                              :events ['(fn [ctx runtime evt])]
                              :game-effects []
                              :conditions {"1"
                                           {:tips '(fn [ctx runtime]
                                                     [:card "0" "1"])
                                            :count 1
                                            :options {:player :own}
                                            :action '(fn [ctx runtime selection]
                                                       #_(throw (ex-info "not in 2" {}))
                                                       ctx)}
                                           "in-battle-phase"
                                           {:options {:player :enemy}
                                            :action '(fn [ctx runtime selection]
                                                       #_(throw (ex-info "not in" {}))
                                                       ctx)}}
                              :logic {""
                                      ['(And (Leaf "1")
                                             (Leaf "in-battle-phase"))
                                       '(fn [ctx runtime])]}}
                             "gundam-text-2"
                             {:type [:special [:psycommu 3]]}}
                     :type :graphic
                     :gsign [:blue :uc]
                     :battle-point [2 1 2]
                     :char "gundam xx ee"
                     :cost [:normal [:blue :blue nil nil nil]]
                     :pack :gundam}]
        _ (s/assert ::value (second card-proto))
        _ (do-logic ctx runtime card-proto "gundam-text-1"
                    '(And (Leaf "1")
                          (Leaf "in-battle-phase"))
                    {"1" [:card "1"]
                     "in-battle-phase" [:player-yes "ok"]})]))

(defn tests []
  (test-do-logic))
