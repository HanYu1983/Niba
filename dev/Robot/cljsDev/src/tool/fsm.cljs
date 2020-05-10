(ns tool.fsm
  (:require [clojure.spec.alpha :as s]))

(s/def ::stack (s/coll-of keyword?))
(s/def ::model (s/keys :req-un [::stack ::state]))

(def model {:stack []
            :state []})

(defn currState [ctx]
  (first (:stack ctx)))

(defn pushState [ctx state]
  (-> ctx 
   (update :stack (partial cons state))
   (update :state (partial cons nil))))

(defn popState [ctx]
  (-> ctx
      (update :state rest)
      (update :stack rest)))

(defn setState [ctx state]
  (-> ctx
      popState
      (pushState state)))

(defn save [ctx obj]
  (update ctx :state (fn [origin]
                       (->> (rest origin)
                            (cons obj)))))

(defn load [ctx]
  (first (:state ctx)))