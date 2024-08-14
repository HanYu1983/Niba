(ns game.lagacy.player-status-map
  (:require [clojure.spec.alpha :as s]
            [clojure.set :refer [difference]]
            [game.define.player :as player]))

(def simple-flags [:has-play-g :has-test])
(s/def ::flag (-> #{} (into simple-flags)))
(s/def ::flags (s/coll-of ::flag :kind set?))
(s/def ::player-status (s/keys :req-un [::flags]))
(s/def ::player-status-map (s/map-of any? ::player-status))
(s/def ::spec (s/keys :req-un [::player-status-map]))

(def default-player-status {:flags #{}})
(def default-component {:player-status-map {}})

(defn get-flags [player-status]
  (s/assert ::player-status player-status)
  (-> player-status :flags))

(defn set-flags [player-status flags]
  (s/assert ::player-status player-status)
  (-> player-status (update :flags (constantly flags))))

(defn set-has-play-g [player-status]
  (s/assert ::player-status player-status)
  (-> player-status (update :flags into #{:has-play-g})))

(defn get-has-play-g [player-status]
  (s/assert ::player-status player-status)
  (-> player-status :flags :has-play-g nil? not))

(defn clear-has-play-g [player-status]
  (s/assert ::player-status player-status)
  (-> player-status (update :flags difference #{:has-play-g})))

#_(defmacro gen-flag-fns [k]
  `(do
     (defn ~(symbol (str "set-" (name k))) [~'player-status]
       (s/assert ::player-status ~'player-status)
       (-> ~'player-status (update :flags into #{~k})))
     (defn ~(symbol (str "get-" (name k))) [~'player-status]
       (s/assert ::player-status ~'player-status)
       (-> ~'player-status :flags ~k nil? not))
     (defn ~(symbol (str "clear-" (name k))) [~'player-status]
       (s/assert ::player-status ~'player-status)
       (-> ~'player-status (update :flags difference #{:has-play-g})))))

#_(doseq [flag simple-flags] (gen-flag-fns flag))

(defn get-player-status [ctx player-id]
  (s/assert ::spec ctx)
  (-> ctx :player-status-map (get player-id) (or default-player-status)))

(defn set-player-status [ctx player-id player-status]
  (s/assert ::spec ctx)
  (-> ctx (update-in [:player-status-map player-id] (constantly player-status))))

(defn update-player-status [ctx player-id f & args]
  (-> ctx
      (get-player-status player-id)
      (#(apply f % args))
      (#(s/assert ::player-status %))
      (#(set-player-status ctx player-id %))))

(defn tests []
  (let [player-a :A
        ctx default-component
        ctx (-> ctx (update-player-status player-a set-has-play-g))
        _ (-> ctx (get-player-status player-a) get-has-play-g (or (throw (ex-info "must has-play-g" {}))))
        ctx (-> ctx (update-player-status player-a clear-has-play-g))
        _ (-> ctx (get-player-status player-a) get-has-play-g not (or (throw (ex-info "must no has-play-g" {}))))
        _ (println ctx)]))