(ns tool.component.item-group
  (:import [java.lang Exception])
  (:require [clojure.spec.alpha :as s]
            [clojure.set :refer [difference union]]))

(s/def ::item-group-parent (s/map-of any? any?))
(s/def ::item-group-children (s/map-of any? set?))
(s/def ::spec (s/keys :req-un [::item-group-parent ::item-group-children]))

(defn create-item-group []
  (->> {:item-group-parent {}
        :item-group-children {}}
       (s/assert ::spec)))

(declare delete-item-group-parent
         assert-circle-ref)

(defn set-item-group-parent [ctx id parent]
  (s/assert ::spec ctx)
  (-> ctx
      (delete-item-group-parent id)
      (update :item-group-parent assoc id parent)
      (update-in [:item-group-children parent] #(union (or % #{}) #{id}))
      (assert-circle-ref id)))

(defn get-item-group-parent [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :item-group-parent (get id)))

(defn get-item-group-parent-root [ctx id]
  (s/assert ::spec ctx)
  (loop [current-id id]
    (let [parent (get-item-group-parent ctx current-id)]
      (if (nil? parent)
        current-id
        (recur parent)))))

(defn get-item-group [ctx id]
  (s/assert ::spec ctx)
  (-> ctx :item-group-children (get id #{})
      (->> (mapcat #(get-item-group ctx %)) (into #{id}))))

(defn get-item-group-from-root [ctx id]
  (s/assert ::spec ctx)
  (->> id (get-item-group-parent-root ctx) (get-item-group ctx)))

(defn delete-item-group-parent [ctx id]
  (s/assert ::spec ctx)
  (let [parent (get-item-group-parent ctx id)
        ctx (if (nil? parent)
              ctx
              (-> ctx
                  (update :item-group-parent dissoc id)
                  (update-in [:item-group-children parent] difference #{id})))]
    ctx))

(defn delete-item-group [ctx id]
  (s/assert ::spec ctx)
  (let [will-delete-ids (get-item-group ctx id)]
    (-> ctx
        (delete-item-group-parent id)
        (update :item-group-parent #(apply dissoc % will-delete-ids))
        (update :item-group-children #(apply dissoc % will-delete-ids)))))

(defn assert-circle-ref [ctx id]
  (s/assert ::spec ctx)
  (loop [current-id id
         visited #{}]
    (if (contains? visited current-id)
      (throw (ex-info "Circular reference detected" {:id id}))
      (let [parent (get-item-group-parent ctx current-id)]
        (if (nil? parent)
          ctx
          (recur parent (conj visited current-id)))))))

(defn tests []
  (let [ctx (create-item-group)
        ctx (set-item-group-parent ctx :child :parent)
        _ (assert (= (get-item-group-parent ctx :child) :parent) "set-item-group-parent failed")

        ctx (set-item-group-parent ctx :grandchild :child)
        _ (assert (= (get-item-group-parent-root ctx :grandchild) :parent) "get-item-group-parent-root failed")

        group (get-item-group ctx :parent)
        _ (assert (= group #{:parent :child :grandchild}) "get-item-group failed")

        group-from-root (get-item-group-from-root ctx :grandchild)
        _ (assert (= group-from-root #{:parent :child :grandchild}) "get-item-group-from-root failed")

        ctx (delete-item-group-parent ctx :child)
        _ (assert (nil? (get-item-group-parent ctx :child)) "delete-item-group-parent failed")

        group-after-delete (get-item-group ctx :parent)
        _ (assert (= group-after-delete #{:parent}) "delete-item-group-parent didn't update group structure")

        grandchild-parent-after-delete (get-item-group-parent ctx :grandchild)
        _ (assert (= grandchild-parent-after-delete :child) "delete-item-group-parent didn't preserve other relationships")

        root-after-delete (get-item-group-parent-root ctx :grandchild)
        _ (assert (= root-after-delete :child) "get-item-group-parent-root failed after delete")])

  (let [ctx (create-item-group)
        ctx (-> ctx
                (set-item-group-parent :item1 :group1)
                (set-item-group-parent :item2 :group1)
                (set-item-group-parent :item3 :group2)
                (set-item-group-parent :subgroup1 :group1)
                (set-item-group-parent :item4 :subgroup1))
        group1-items (get-item-group ctx :group1)
        group2-items (get-item-group ctx :group2)
        subgroup1-items (get-item-group ctx :subgroup1)
        item4-root (get-item-group-parent-root ctx :item4)]
    (assert (= group1-items #{:group1 :item1 :item2 :subgroup1 :item4}) "Complex group structure test failed")
    (assert (= group2-items #{:group2 :item3}) "Simple group structure test failed")
    (assert (= subgroup1-items #{:subgroup1 :item4}) "Nested group structure test failed")
    (assert (= item4-root :group1) "Root finding in nested structure failed")
    (let [ctx-after-delete (delete-item-group ctx :subgroup1)
          group1-after-delete (get-item-group ctx-after-delete :group1)]
      (assert (= group1-after-delete #{:group1 :item1 :item2}) "Delete nested group failed")
      (assert (nil? (get-item-group-parent ctx-after-delete :item4)) "Orphaned item not properly handled after delete")))

  (let [ctx (create-item-group)]
    (try
      (-> ctx
          (set-item-group-parent :item1 :group1)
          (set-item-group-parent :group1 :item1))
      (assert false "assert-circle-ref should have thrown an exception")
      (catch Exception e
        (assert (= (.getMessage e) "Circular reference detected") "Incorrect exception message")))))