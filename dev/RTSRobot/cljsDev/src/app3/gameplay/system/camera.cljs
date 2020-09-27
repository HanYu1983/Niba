(ns app3.gameplay.system.camera
  (:require [clojure.core.matrix :as m]
            ["rxjs/operators" :as rx-op])
  (:require [app3.gameplay.system.basic]
            [app3.gameplay.emitter]))

(defn camera-control! []
  (let [_ (-> app3.gameplay.emitter/on-gameplay
              (.pipe (rx-op/switchMap (fn [atom-gameplay]
                                        (-> app3.gameplay.emitter/emitter
                                            (.pipe (rx-op/map (fn [evt]
                                                                [atom-gameplay evt])))))))
              (.subscribe (fn [[atom-gameplay [cmd args]]]
                            (cond
                              (= [:keyIsDown "left"] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [-1 0 0] %))))
                              (= [:keyIsDown "right"] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [1 0 0] %))))
                              (= [:keyIsDown "up"] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [0 -1 0] %))))
                              (= [:keyIsDown "down"] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [0 1 0] %))))
                              (= [:keyPressed "-"] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [0 0 0.2] %))))
                              (= [:keyPressed "="] [cmd args])
                              (swap! atom-gameplay (fn [gameplay]
                                                     (update-in gameplay [:camera] #(m/add [0 0 -0.2] %))))))))]))