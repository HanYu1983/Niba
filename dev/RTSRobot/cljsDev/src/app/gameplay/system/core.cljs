(ns app.gameplay.system.core
  (:require ["planck-js" :as pl]
            [clojure.spec.alpha :as s])
  (:require [app.gameplay.model]))

(defn comp-body-control [fns gameplay evt]
  (app.gameplay.model/reduce-bodies (fn [gameplay body]
                                      (reduce (fn [gameplay f]
                                                (f gameplay body evt))
                                              gameplay
                                              fns))
                                    gameplay))

(defn camera-control [gameplay [cmd args]]
  (condp = cmd
    :keyIsDown
    (let [key args]
      (println args)
      (condp = key
        37
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. -1 0 0)))

        38
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 -1 0)))

        39
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 1 0 0)))

        40
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 1 0)))

        187
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 0 -0.1)))

        189
        (update gameplay :camera #(pl/Vec3.add % (pl/Vec3. 0 0 0.1)))

        gameplay))
    gameplay))

(defn step-world [gameplay [cmd args]]
  (condp = cmd
    :tick
    (let [elapsedTime args
          _ (.step (:world gameplay) elapsedTime)]
      gameplay)
    gameplay))

(defn select-box-control [gameplay [cmd args]]
  (cond
    (= cmd :select-box-done)
    (let [gameplay (assoc gameplay :entities (->> (:entities gameplay)
                                                  vals
                                                  (map (fn [entity]
                                                         (dissoc entity :selected?)))
                                                  (zipmap (keys (:entities gameplay)))))
          {:keys [camera viewport]} gameplay
          [[x1 y1] [x2 y2]] (s/assert ::app.gameplay.model/select-box args)

          atom-selected (atom [])
          _ (.queryAABB (:world gameplay)
                        (pl/AABB. (app.gameplay.model/getWorldPoint viewport camera (pl/Vec2. x1 y1))
                                  (app.gameplay.model/getWorldPoint viewport camera (pl/Vec2. x2 y2)))
                        (fn [fixture]
                          (when (-> fixture .getBody .getUserData)
                            (swap! atom-selected #(cons (-> fixture .getBody .getUserData) %)))
                          true))
          gameplay (reduce (fn [gameplay id]
                             (update-in gameplay [:entities id] (fn [entity]
                                                                  (assoc entity :selected? true))))
                           gameplay
                           @atom-selected)
          gameplay (dissoc gameplay :select-box)]
      gameplay)

    (= cmd :select-box-dragging)
    (assoc gameplay :select-box args)

    :else
    gameplay))

