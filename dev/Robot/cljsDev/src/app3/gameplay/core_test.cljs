(ns app3.gameplay.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.core.async :refer [go <! >!]]
            [app3.gameplay.core]
            [tool.map :refer [generateMap]]))

(def basic-gameplay {:map (generateMap {:seed 0
                                        :x 0
                                        :y 0
                                        :w 10
                                        :h 10}
                                       {:deepsea 0.6
                                        :sea 0.6
                                        :sand 0.1
                                        :grass 1
                                        :hill 1
                                        :city 0.3
                                        :tree 0.4
                                        :award 0.01
                                        :power 1
                                        :offset 0})
                     :numberOfTurn 0
                     :money 0
                     :moveRange []
                     :cursor [0 0]
                     :camera [0 0]
                     :mapsize [20 20]
                     :viewsize [10 10]
                     :units {}
                     :players {:player {:key :player
                                        :faction 0}
                               :ai1 {:key :ai1
                                     :faction 1}
                               :ai2 {:key :ai2
                                     :faction 1}}
                     :active-player-key :player
                     :lobbyCtx {:robots {}
                                :pilots {}
                                :robotByPilot {}
                                :money 100000
                                :weapons {}
                                :robotByWeapon {}
                                :weaponLevelByKey {}
                                :components {}
                                :robotByComponent {}
                                :pilotStateByPilot {}}})

(def atom-ctx (atom nil))