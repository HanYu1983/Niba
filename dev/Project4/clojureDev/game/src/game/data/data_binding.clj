(ns game.data.data-binding
  (:require [data.CardProto_179030_11E_U_VT186R_purple]))

(def card-proto-pool {})

(defn get-card-proto [key]
  (or (card-proto-pool key)
      (throw (ex-message (str key " not found")))))