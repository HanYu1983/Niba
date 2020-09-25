(ns app2.gameplay.model
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rx]
            [cljs.reader])
  (:require [app2.gameplay.spec]
            [tool.rbush]
            [tool.math]
            [tool.goal]))

(def gameplay (s/assert
               ::app2.gameplay.spec/gameplay
               {:state {:entities {"player" {:id "player"
                                             :position [0 0]
                                             :collision-state {:shape [:circle 10]}
                                             :player-state {}
                                             :robot-state {:heading [1 0]}
                                             :weapon-state {:weapons [{:id (gensym "weapon")
                                                                       :weapon-proto-id :sword
                                                                       :bullet-count 0}
                                                                      {:id (gensym "weapon")
                                                                       :weapon-proto-id :gun
                                                                       :bullet-count 0}]}}
                                   "ai" {:id "ai"
                                         :position [0 0]
                                         :last-position [0 0]
                                         :collision-state {:shape [:polygon (cons [0 0] (tool.math/circle-to-polygon 30 0 3.14 3))]}
                                         :robot-state {:heading [1 0]}
                                         :brain {:goal [:stack
                                                        [:think]]
                                                 :memory {}}}}
                        :viewport [800 640]
                        :camera [0 0 1]}
                :js {:outputSubject (rx/Subject.)
                     :rbush (tool.rbush/create {:compareMinX (fn [a b]
                                                               (- (- (get-in a [:position 0]) (:radius a))
                                                                  (- (get-in b [:position 0]) (:radius b))))
                                                :compareMinY (fn [a b]
                                                               (- (- (get-in a [:position 1]) (:radius a))
                                                                  (- (get-in b [:position 1]) (:radius b))))
                                                :toBBox (fn [item]
                                                          [(- (get-in item [:position 0]) (:radius item))
                                                           (- (get-in item [:position 1]) (:radius item))
                                                           (+ (get-in item [:position 0]) (:radius item))
                                                           (+ (get-in item [:position 1]) (:radius item))])})}}))