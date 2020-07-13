(ns app.gameplay.system.body.core
  (:require ["planck-js" :as pl]))

(defn player-control [gameplay body [cmd args]]
  (condp = cmd
    :keyPressed
    (let [id (.getUserData body)
          entity (get-in gameplay [:entities id])
          player? (:player entity)]
      (if player?
        (let [key args]
          (condp = key
            32
            (let [bulletEntity {:id (str (gensym))
                                :bullet true
                                :timeout 3000}
                  bulletBody (-> gameplay :world
                                 (.createDynamicBody (js-obj "position" (.getWorldPoint body (pl/Vec2 5 0))
                                                             "angle" (.getAngle body)
                                                             "userData" (:id bulletEntity))))

                  _ (doto bulletBody
                      (.createFixture (pl/Box 1 1) (js-obj "density" 0.1))
                      (.applyLinearImpulse (.getWorldVector body (pl/Vec2 1000 0))
                                           (.getWorldPoint bulletBody (pl/Vec2 0 5))
                                           true)
                      (.applyAngularImpulse 100 true))
                  gameplay (update gameplay :entities #(assoc % (:id bulletEntity) bulletEntity))]
              gameplay)
            gameplay))
        gameplay))

    :keyIsDown
    (let [id (.getUserData body)
          entity (get-in gameplay [:entities id])
          player? (:player entity)]
      (if player?
        (let [key args]
          (condp = key
            87
            (do
              (.applyLinearImpulse body
                                   (.getWorldVector body (pl/Vec2 5 0))
                                   (.getWorldPoint body (pl/Vec2))
                                   true)
              gameplay)
            83
            (do
              (.applyLinearImpulse body
                                   (.getWorldVector body (pl/Vec2 -5 0))
                                   (.getWorldPoint body (pl/Vec2))
                                   true)
              gameplay)
            68
            (let [force 1]
              (.applyAngularImpulse body force true)
              gameplay)
            65
            (let [force -1]
              (.applyAngularImpulse body force true)
              gameplay)
            gameplay))
        gameplay))

    gameplay))