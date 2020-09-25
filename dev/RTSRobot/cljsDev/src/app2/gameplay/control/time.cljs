(ns app2.gameplay.control.time
  (:require [clojure.core.async :as a]))


(defn timer-control [entity gameplay [cmd args]]
  (cond
    (and (:timer entity)
         (= :tick cmd))
    (let [elapsed args]
      (update-in entity [:timer] #(+ % elapsed)))

    :else
    entity))

(defn expire-evt-control [entity gameplay [cmd args]]
  (cond
    (and (every? #(% entity) [:timer :expire-time])
         (= :tick cmd))
    (let [{:keys [timer expire-time]} entity
          _ (when (> timer expire-time)
              (a/go
                (.next (-> gameplay :js :outputSubject) [:entity-expire entity])))]
      entity)

    :else
    entity))

(defn expire-control [gameplay [cmd args]]
  (cond
    (= :entity-expire cmd)
    (let [entity args]
      (update-in gameplay [:state :entities] (fn [entities]
                                               (dissoc entities (:id entity)))))

    :else
    gameplay))