(ns game.component.protocol.basic)

(defmulti get-card-controller-and-assert-exist (fn [ctx card-id] (:env ctx)))
(defmulti get-card-proto (fn [ctx proto-id] (:env ctx)))