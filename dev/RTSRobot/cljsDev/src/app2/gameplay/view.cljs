(ns app2.gameplay.view
  (:require [clojure.core.match :refer [match]]
            [clojure.spec.alpha :as s]
            [clojure.core.matrix :as m])
  (:require [tool.math]
            [tool.keycode]
            [tool.sat]
            [tool.p5]
            [app2.gameplay.spec]))

(defn view [atom-gameplay input-signal]
  (tool.p5/view "canvas" atom-gameplay input-signal
                ["up" "down" "left" "right"
                 "w" "d" "a" "s" "=" "-"
                 "space" "," "."]
                (fn [p gameplay]
                  (let [{:keys [camera viewport]} (:state gameplay)]
                    (doseq [[id entity] (get-in gameplay [:state :entities])]
                      (let [_ (when (every? #(% entity) [:position :collision-state])
                                (let [[x y] (tool.math/get-camera-point viewport camera (:position entity))
                                      shape (s/conform ::app2.gameplay.spec/shape (-> entity :collision-state :shape))
                                      _ (match shape
                                          [_ [:circle radius]]
                                          (let [radius (* 2 radius (tool.math/world-camera-factor camera))]
                                            (.ellipse p x y radius radius))

                                          [_ [:arc radius start end]]
                                          (let [radius (* 2 radius (tool.math/world-camera-factor camera))]
                                            (.arc p x y radius radius start end))

                                          [_ [:polygon verties]]
                                          (let [_ (.beginShape p)
                                                _ (doseq [v verties]
                                                    (let [[vx vy] (->> v
                                                                       (m/add (:position entity))
                                                                       (tool.math/get-camera-point viewport camera))]
                                                      (.vertex p vx vy)))
                                                _ (.endShape p (.-CLOSE p))]))

                                      _ (.text p id x y)
                                      _ (when (:robot-state entity)
                                          (let [{heading :heading} (:robot-state entity)
                                                head (m/add [x y] (m/mul [50 50] heading))]
                                            (.line p x y (get head 0) (get head 1))))]))]))))))