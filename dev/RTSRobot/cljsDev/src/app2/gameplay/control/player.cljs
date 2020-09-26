(ns app2.gameplay.control.player
  (:require [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m]
            [clojure.core.async :as a])
  (:require [tool.math]
            [app2.gameplay.spec]))


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

        (= [:keyPressed ","] evt)
        (let [weapon (get-in entity [:weapon-state :weapons 0])
              _ (a/go (.next (-> gameplay :js :outputSubject) [:on-entity-fire [entity weapon]]))]
          entity)

        (= [:keyPressed "."] evt)
        (let [weapon (get-in entity [:weapon-state :weapons 1])
              _ (a/go (.next (-> gameplay :js :outputSubject) [:on-entity-fire [entity weapon]]))]
          entity)

        :else
        entity))
    entity))

(defn fire-control [gameplay [cmd args]]
  #_(when (not= :tick cmd)
      (println cmd args))
  (cond
    (= :on-entity-fire cmd)
    (let [[entity weapon] args
          _ (s/assert
             (s/keys :req-un [::position ::robot-state])
             entity)
          _ (s/assert
             ::app2.gameplay.spec/weapon
             weapon)
          weapon-proto (s/assert
                        (s/nilable ::app2.gameplay.spec/weapon-proto)
                        (-> (:weapon-proto-id weapon)
                            app2.gameplay.spec/weapon-proto-pool))
          gameplay (cond
                     (nil? weapon-proto)
                     (let [_ (println "weapon proto not found" weapon)]
                       gameplay)

                     (= :bullet (:bullet-type weapon-proto))
                     (update-in gameplay [:state :entities] (fn [entities]
                                                              (let [bullet {:id (str (gensym "bullet"))
                                                                            :position (:position entity)
                                                                            :last-position [0 0]
                                                                            :velocity (m/mmul (-> entity :robot-state :heading) 5)
                                                                            :collision-state {:shape [:circle 5]
                                                                                              :collision-group :player-bullet}
                                                                            :timer 0
                                                                            :expire-time 2
                                                                            :tags #{:bullet}}]
                                                                (assoc entities (:id bullet) bullet))))

                     (= :sword (:bullet-type weapon-proto))
                     (update-in gameplay [:state :entities] (fn [entities]
                                                              (let [[hx hy] (-> entity :robot-state :heading)
                                                                    angle (js/Math.atan2 hy hx)
                                                                    range (m/to-radians 90)
                                                                    bullet {:id (str (gensym "bullet"))
                                                                            :position (:position entity)
                                                                            :collision-state {:shape [:polygon (cons [0 0] (tool.math/circle-to-polygon 30 (- angle (/ range 2)) (+ angle (/ range 2)) 3))]
                                                                                              :collision-group :player-bullet}
                                                                            :timer 0
                                                                            :expire-time 2
                                                                            :tags #{:bullet}}]
                                                                (assoc entities (:id bullet) bullet))))

                     :else
                     gameplay)]
      gameplay)

    :else
    gameplay))