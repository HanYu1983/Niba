(ns app.module)

(defmulti lobbyAsk (fn [type] type))

(defmulti loadData (fn [type] type))
(defmulti gameplayStart (fn [type ctx] type))
(defmulti gameplayLoad (fn [type ctx] type))
(defmulti testIt (fn [type] type))

(def *module nil)