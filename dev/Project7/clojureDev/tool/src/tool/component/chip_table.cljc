(ns tool.component.chip-table
  (:require [clojure.spec.alpha :as s]
            [tool.card.table]))

(s/def ::chips (s/map-of any? any?))
(s/def ::spec (s/merge :tool.component.table/spec
                       (s/keys :req-un [::chips])))

(defn create-chip-table []
  (s/assert ::spec {:chips {}
                    :table (tool.card.table/create-table)}))

(defn get-chips [ctx]
  (s/assert ::spec ctx)
  (-> ctx :chips))

(defn add-chip [ctx deck-id id card]
  (s/assert ::spec ctx)
  (-> ctx
      (update :table tool.card.table/add-card deck-id id nil)
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
  (let [ctx (create-chip-table)
        chip "chip"
        ctx (-> ctx (add-chip [:A :maintenance-area] "0" chip))
        _ (-> ctx (is-chip "0") (or (throw (ex-info "must is chip" {}))))
        _ (-> ctx (get-chip "0") (= chip) (or (throw (ex-info "must be chip" {}))))
        _ (-> ctx (remove-chip "0"))]))