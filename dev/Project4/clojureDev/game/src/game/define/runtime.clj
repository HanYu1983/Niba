(ns game.define.runtime)

(defprotocol ExecuteRuntime
  (get-card-id [this])
  (get-response-player-id [this]))

(defrecord SystemExecuteRuntime [response-player-id]
  ExecuteRuntime
  (get-card-id [_] (throw (ex-info "not support" {})))
  (get-response-player-id [this] (:response-player-id this)))

(defrecord DefaultExecuteRuntime [card-id response-player-id]
  ExecuteRuntime
  (get-card-id [this] (:card-id this))
  (get-response-player-id [this] (:response-player-id this)))

(defn tests []
  (when (not (= :gundam (get-card-id (DefaultExecuteRuntime. :gundam nil))))
    (throw (ex-message "xxx"))))