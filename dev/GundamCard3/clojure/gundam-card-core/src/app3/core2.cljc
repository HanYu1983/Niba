(ns app3.core2
  (:require
   [clara.rules :refer :all]
   [clojure.string :as str])
  (:import
   (clojure.lang ExceptionInfo)))


; ============== CardTable ============


(defn card-stack-create [id card-ids]
  {:id id, :card-ids card-ids})

(defn card-stack-shuffle [card-stack]
  (update card-stack :card-ids shuffle))

(defn card-stack-remove-card-ids [card-stack card-ids]
  (update card-stack :card-ids (partial filter (fn [card-id]
                                                 (some #(% not= card-id) card-ids)))))

(defn card-stack-add-card-ids [card-stack options card-ids]
  (update card-stack :card-ids (partial concat card-ids)))

(defn card-table-create [card-map card-stack-map]
  {:card-map card-map :card-stack-map card-stack-map})

(defn card-table-add-card [table id card]
  (-> table (update :card-map (partial cons [id card]))))

(defn card-table-get-card [table id]
  (-> table :card-map (get id)))

(defn card-table-map-card [table id f]
  (-> table (update-in [:card-map id] f)))

(defn card-table-move-card [table from to options ids]
  (-> table
      (update-in [:card-stack-map from] ((fn [card-stack]
                                           (card-stack-remove-card-ids card-stack ids))))
      (update-in [:card-stack-map to] ((fn [card-stack]
                                         (card-stack-add-card-ids card-stack options ids))))))

(defn card-table-map-card-stack-map [table f]
  (-> table (update :card-stack-map (fn [card-stack-map]
                                      (->> card-stack-map
                                           (map (fn [[card-stack-id card-stack]]
                                                  [card-stack-id (f card-stack)]))
                                           (into {}))))))
(defn card-table-remove-card [table id]
  (-> table
      (update :card-map dissoc id)
      (card-table-map-card-stack-map (fn [card-stack]
                                       (card-stack-remove-card-ids card-stack [id])))))

; ============= CoinTable ==============
(defn coin-table-create [coin-map coin-assoc-map]
  {:coin-map coin-map :coin-assoc-map coin-assoc-map})
(defn coin-table-add-coin [table id coin])
(defn coin-table-get-coin [table id])
(defn coin-table-get-coins [table assoc-id])

; =========== stack system ==============

(defn stack-system-create [effect-map effect-stack immediate-effects destory-effects])
(defn stack-system-cut-in [stack-system id effect])
(defn stack-system-append-immediate-effect [stack-system id effect])
(defn stack-system-append-destory-effect [stack-system id effect])
(defn stack-system-remove-effect [stack-system id])
(defn stack-system-map-effect [stack-system id f])
(defn stack-system-get-top-effect [stack-system])
(defn stack-system-get-effect [stack-system id])

; ========== Text =========== 
#_(defprotocol ITipComponent
    (is-tip-ok-to-perform [ctx tip]))

(defmulti is-tip-ok-to-perform :env)


(defn condition-create [id tip-script action-script]
  {:id id :tip-script tip-script :action-script action-script})
(defn condition-eval-tip-script [con]
  (-> con :tip-script eval))
(defn condition-eval-action-script [con]
  (-> con :action-script eval))

(defn action-create [id conditions action-script]
  {:id id, :conditions conditions, :action-script action-script})
(defn action-get-conditions [action]
  (-> action :conditions))
(defn action-reduce-conditions [action f ctx]
  (->> action action-get-conditions (reduce f ctx)))
(defn action-evaluate-conditions-errors [action ctx runtime]
  (let [errors (atom [])
        ctx (->> ctx (action-reduce-conditions action
                                               (fn [ctx con]
                                                 (println "action-evaluate-conditions-errors" ctx)
                                                 (let [tip-script (condition-eval-tip-script con)
                                                       action-script (condition-eval-action-script con)
                                                       tip (tip-script ctx runtime)
                                                       _ (when (->> tip (is-tip-ok-to-perform ctx) not)
                                                           (swap! errors conj "error tip"))
                                                       ctx (try (action-script ctx runtime)
                                                                (catch ExceptionInfo e
                                                                  (swap! errors conj (ex-message e))
                                                                  ctx))]
                                                   ctx))))
        final-action (condition-eval-action-script action)
        ctx (try (final-action ctx runtime)
                 (catch ExceptionInfo e
                   (swap! errors conj (ex-message e))
                   ctx))]
    [@errors ctx]))
(defn action-evaluate-conditions [action ctx runtime]
  (-> action (action-evaluate-conditions-errors ctx runtime) ((fn [[errors ctx]]
                                                                (when (-> errors count pos?)
                                                                  (throw (ex-info (str/join "," errors)
                                                                                  {:errors errors}))
                                                                  true)
                                                                ctx))))

(defn text-create [id actions event-script effect-script]
  {:id id, :actions actions, :event-script event-script :effect-script effect-script})
(defn text-get-actions [text]
  (-> text :actions))
(defn text-eval-event-script [text]
  (-> text :event-script eval))
(defn text-get-action [text id]
  (-> text :actions (nth id)))


(defmethod is-tip-ok-to-perform :test [ctx tip]
  (println "is-tip-ok-to-perform")
  true)


(defmulti runtime-get-card-id :type)
(defmulti runtime-get-player-id :type)

(defn test-text []
  (let [ctx {:env :test, :version 0}
        text (text-create "text-1"
                          [(action-create "action-1"
                                          [(condition-create "cond1"
                                                             `(fn [~'ctx ~'runtime] ~'ctx)
                                                             `(fn [~'ctx ~'runtime]
                                                                #_(throw (ex-info "acc" {}))
                                                                (update ~'ctx :version inc)))]
                                          `(fn [~'ctx ~'runtime]
                                             (update ~'ctx :version inc)))]
                          `(fn [~'ctx ~'runtime ~'event] ~'ctx)
                          `(fn [~'ctx ~'runtime] ~'ctx))
        ;_ (println text)
        action (-> text (text-get-action 0))
        ;_ (println action)
        ctx (->> (action-evaluate-conditions action ctx {}))
        _ (println ctx)]))


(defn -main [args]
  (test-text))