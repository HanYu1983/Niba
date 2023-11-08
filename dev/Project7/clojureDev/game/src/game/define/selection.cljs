(ns game.define.selection
  (:require [clojure.spec.alpha :as s]))
; ('card "0" "1")
(defn select-card? [obj] (-> obj first (= 'card)))
(defn select-basyou? [obj] (-> obj first (= 'basyou)))
(defn ids [obj] (rest obj))
(defn select-card [ids] (cons 'card ids))
(defn select-basyou [ids] (cons 'basyou ids))