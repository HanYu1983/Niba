(ns app.gameplay.system.body.core
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s])
  (:require [app.gameplay.model]))

(defn timeout-control [gameplay body [cmd args]]
  (let [id (.getUserData body)
        entity (get-in gameplay [:entities id])
        {:keys [timeout]} entity]
    (cond
      (not timeout)
      gameplay

      (not (= :tick cmd))
      gameplay

      :else
      (let [gameplay (s/assert
                      ::app.gameplay.model/gameplay
                      (if (<= timeout 0)
                        (let [gameplay (app.gameplay.model/destroy-body gameplay body)]
                          gameplay)

                        (let [entity (update entity :timeout #(- % args))
                              gameplay (update gameplay :entities #(assoc % id entity))]
                          gameplay)))]
        gameplay))))

(defn player-control [gameplay body [cmd args]]
  (let [id (.getUserData body)
        entity (get-in gameplay [:entities id])
        {:keys [player?]} entity]
    (cond
      (not player?)
      gameplay

      (= :keyIsDown cmd)
      (cond
        (= 87 args)
        (do
          #_(let [tx (.getTransform body)
                  pos (.-p tx)
                  rot (.-q tx)
                  _ (.set tx (pl/Vec2.add pos (pl/Rot.mul rot (pl/Vec2 0.5 0))) (.getAngle rot))]
              gameplay)
          (.setLinearVelocity body (pl/Rot.mul (pl/Rot. (.getAngle body)) (pl/Vec2 10 0)))
          gameplay)

        (= 83 args)
        (do
          (.setLinearVelocity body (pl/Rot.mul (pl/Rot. (.getAngle body)) (pl/Vec2 -10 0)))
          gameplay)

        (= 68 args)
        (let [force 1]
          (.setAngularVelocity body force)
          gameplay)


        (= 65 args)
        (let [force -1]
          (.setAngularVelocity body force)
          gameplay)

        :else
        gameplay)

      (= :keyReleased cmd)
      (cond
        (= 32 args)
        (let [gameplay (app.gameplay.model/create-bullet gameplay
                                                         {:position (.getWorldPoint body (pl/Vec2 5 0))
                                                          :angle (.getAngle body)}
                                                         body
                                                         {:id (str (gensym))
                                                          :timeout 3})]
          gameplay)

        (= 87 args)
        (do
          (.setLinearVelocity body (pl/Vec2 0 0))
          gameplay)

        (= 83 args)
        (do
          (.setLinearVelocity body (pl/Vec2 0 0))
          gameplay)

        (= 68 args)
        (let [force 0]
          (.setAngularVelocity body force)
          gameplay)


        (= 65 args)
        (let [force 0]
          (.setAngularVelocity body force)
          gameplay)

        :else
        gameplay)

      :else
      gameplay)))