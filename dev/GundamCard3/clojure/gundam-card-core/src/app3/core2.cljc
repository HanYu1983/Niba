(ns app3.core2
  (:import (java.lang Exception))
  (:require [clojure.edn :as edn]
            [clara.rules :refer :all]
            [clara.rules.accumulators :as acc]))

; ============== CardTable ============

(defrecord CardStack [id card-ids])

(defn shuffle-card-stack [card-stack]
  (update card-stack :card-ids shuffle))

(defrecord CardTable [card-map card-stack-map])

(defn create-card-table [cards card-stacks])

(defn add-card [table id card])

(defn get-card [table id])

(defn map-card [table id f])

(defn move-card [table from to options ids])

(defn remove-card [table id])

; ============= CoinTable ==============
(defrecord CoinTable [coin-map coin-assoc-map])
(defn add-coin [table id coin])
(defn get-coin [table id])
(defn get-coins [table assoc-id])

; =========== stack system ==============

(defrecord StackSystem [effect-map effect-stack immediate-effects destory-effects])
(defn cut-in [stack-system id effect])
(defn append-immediate-effect [stack-system id effect])
(defn append-destory-effect [stack-system id effect])
(defn remove-effect [stack-system id])
(defn map-effect [stack-system id f])
(defn get-top-effect [stack-system])
(defn get-effect [stack-system id])

; ========== Text ===========
(defrecord Condition [id tip-script action-script])
(defn eval-tip-script [con]
  (-> con :tip-script eval))
(defn eval-action-script [con]
  (-> con :action-script eval))

(defrecord Action [id conditions action-script])
(defn get-conditions [action]
  (-> action :conditions))
(defn reduce-conditions [action f ctx]
  (->> action get-conditions (reduce f ctx)))
(defn evaluate-conditions-errors [action ctx]
  (let [errors (atom [])
        ctx (->> ctx (reduce-conditions action
                                        (fn [ctx con]
                                          (let [tip-script (eval-tip-script con)
                                                action-script (eval-action-script con)
                                                tip (-> ctx tip-script)
                                                _ (when (->> tip (is-tip-ok ctx) not)
                                                    (swap! errors cons (ex-data "")))
                                                ctx (try (-> ctx action-script)
                                                         (catch Exception e
                                                           (swap! errors cons (ex-data e))
                                                           ctx))]
                                            ctx))))
        final-action (eval-action-script action)
        ctx (try (-> ctx final-action)
                 (catch Exception e
                   (swap! errors cons (ex-data e))
                   ctx))]
    [@errors ctx]))
(defn evaluate-conditions [action ctx]
  (-> action (evaluate-conditions-errors ctx) ((fn [[errors ctx]]
                                                 (when (-> errors count pos?)
                                                   (throw (ex-info "" errors)))
                                                 ctx))))

(defrecord Text [id actions event-script])
(defn get-actions [text]
  (-> text :actions))
(defn eval-event-script [text]
  (-> text :event-script eval))
(defn get-actions [text]
  (-> text :actions))
(defn get-action [text id]
  (-> text :actions (nth id)))


