(ns app2.gameplay.control.player
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.core.async :as a])
  (:require [tool.math]))


(defn player-control [entity gameplay [cmd args :as evt]]
  (if (every? #(% entity) [:position :player-state :robot-state])
    (let []
      (cond
        (= [:keyIsDown "w"] evt)
        (update-in entity [:position] #(m/add % (-> entity :robot-state :heading (m/mmul 1))))

        (= [:keyIsDown "s"] evt)
        (update-in entity [:position] #(m/add % (-> entity :robot-state :heading (m/mmul -1))))

        (= [:keyIsDown "a"] evt)
        (update-in entity [:robot-state :heading] #(tool.math/sat-vector-map % (fn [sat-v]
                                                                                 (.rotate sat-v -0.1))))

        (= [:keyIsDown "d"] evt)
        (update-in entity [:robot-state :heading] #(tool.math/sat-vector-map % (fn [sat-v]
                                                                                 (.rotate sat-v 0.1))))

        (= [:keyPressed "space"] evt)
        (let [_ (a/go (.next (-> gameplay :js :outputSubject) [:onPlayerFire entity]))]
          entity)

        :else
        entity))
    entity))

(defn fire-control [gameplay [cmd args]]
  #_(when (not= :tick cmd)
      (println cmd args))
  (cond
    (= :onPlayerFire cmd)
    (let [entity (s/assert
                  (s/keys :req-un [::position ::robot-state])
                  args)]
      (update-in gameplay [:state :entities] (fn [entities]
                                               (let [bullet {:id (str (gensym "bullet"))
                                                             :position (:position entity)
                                                             :last-position [0 0]
                                                             :velocity (m/mmul (-> entity :robot-state :heading) 20)
                                                             :radius 20
                                                             :timer 0
                                                             :expire-time 2}]
                                                 (assoc entities (:id bullet) bullet)))))

    :else
    gameplay))