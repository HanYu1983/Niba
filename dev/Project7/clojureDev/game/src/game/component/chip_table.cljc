(ns game.component.chip-table
  (:require [clojure.spec.alpha :as s]
            [game.define.chip]
            [game.define.basyou]
            [game.tool.card.table]))

(s/def ::table :game.tool.card.table/table)
(s/def ::chips (s/map-of any? :game.define.chip/spec))
(s/def ::spec (s/keys :req-un [::table ::chips]))

(def chip-table {:chips {}
                 :table game.tool.card.table/table})

(defn get-table [ctx]
  (s/assert ::spec ctx)
  (-> ctx :table))

(defn get-chips [ctx]
  (s/assert ::spec ctx)
  (-> ctx :chips))

(defn add-chip [ctx deck-id id card]
  (s/assert ::spec ctx)
  (s/assert :game.define.basyou/spec deck-id)
  (s/assert :game.define.chip/spec card)
  (-> ctx
      (update :table game.tool.card.table/add-card deck-id id nil)
      (update :chips assoc id card)))

(defn get-chip [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :chips (get id) (or (throw (ex-info (str "chip id not found:" id) {})))))

(defn is-chip [ctx id]
  (-> ctx :chips (get id) nil? not))

(defn remove-chip [ctx id]
  (s/assert ::spec ctx)
  (-> ctx (update :chips dissoc id)))

(defn tests []
  (let [ctx (s/assert ::spec chip-table)
        chip game.define.chip/chip
        ctx (-> ctx (add-chip [:A :maintenance-area] "0" chip))
        _ (-> ctx (is-chip "0") (or (throw (ex-info "must is chip" {}))))
        _ (-> ctx (get-chip "0") (= chip) (or (throw (ex-info "must be chip" {}))))
        ctx (-> ctx (remove-chip "0"))]))