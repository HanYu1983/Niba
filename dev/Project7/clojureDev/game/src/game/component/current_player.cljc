(ns game.component.current-player
  (:require [clojure.spec.alpha :as s]
            [game.define.player]))

(s/def ::current-player-id any?)
(s/def ::spec (s/keys :req-un [::current-player-id]))

(defn get-attack-side [ctx]
  (s/assert ::spec ctx)
  (-> ctx :current-player-id))

(defn get-defend-side [ctx]
  (s/assert ::spec ctx)
  (-> ctx get-attack-side game.define.player/get-opponent))

(defn is-current-player [ctx player-id]
  (-> ctx get-attack-side (= player-id)))

(defn tests []
  (let [_ (-> {:current-player-id :A} get-attack-side (= :A) (or (throw (ex-info "" {}))))
        _ (-> {:current-player-id :A} get-defend-side (= :B) (or (throw (ex-info "" {}))))
        _ (-> {:current-player-id :A} (is-current-player :A) (or (throw (ex-info "" {}))))]))