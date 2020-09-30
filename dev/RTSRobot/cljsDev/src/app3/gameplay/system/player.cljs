(ns app3.gameplay.system.player
  (:require ["planck-js" :as pl])
  (:require [app3.gameplay.system.basic :refer [create-world create-entity collide-system  entity-system]]
            [app3.gameplay.emitter]))

(defn player-system! [atom-entity entities bodies [cmd args]]
  (cond
    (and (:player-state @atom-entity)
         (bodies (:id @atom-entity)))
    (let [entity @atom-entity
          body (bodies (:id entity))
          _ (cond
              (= [:keyIsDown "w"] [cmd args])
              (let [_ (.applyLinearImpulse body
                                           (.getWorldVector body (pl/Vec2 0 -1))
                                           (.getWorldPoint body (pl/Vec2 0 0))
                                           true)])

              (= [:keyIsDown "s"] [cmd args])
              (let [_ (.applyLinearImpulse body
                                           (.getWorldVector body (pl/Vec2 0 1))
                                           (.getWorldPoint body (pl/Vec2 0 0))
                                           true)])

              (= [:keyIsDown "a"] [cmd args])
              (let [_ (.applyAngularImpulse body -1 true)])

              (= [:keyIsDown "d"] [cmd args])
              (let [_ (.applyAngularImpulse body 1 true)])

              (= [:keyPressed "space"] [cmd args])
              (let [entity-id (str (gensym "bullet"))
                    pos (.getWorldPoint body (pl/Vec2 0 -5))
                    _ (.subscribe (create-entity {:id entity-id
                                                  :body-def {:userData entity-id
                                                             :position [(.-x pos) (.-y pos)]
                                                             :angle (.getAngle body)
                                                             :type :dynamic
                                                             :fixtures-def [{:shape-def [:circle [0 0] 1]
                                                                             :filterCategoryBits app3.gameplay.emitter/category-player-bullet
                                                                             :filterMaskBits app3.gameplay.emitter/mask-player-bullet
                                                                             :density 1}]}})
                                  (fn [[_ bullet-body]]
                                    (let [_ (.applyLinearImpulse bullet-body
                                                                 (.getWorldVector body (pl/Vec2 0 -100))
                                                                 (.getWorldPoint body (pl/Vec2 0 0))
                                                                 true)])))]))])))