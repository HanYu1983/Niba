(ns app2.gameplay.phase.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [tool.map]
            [app2.tool.gameplay-spec]
            [app2.gameplay.phase.core :refer [player-turn gameplay-loop]]
            [tool.menuCursor :refer [getSelect]]))

;https://clojure.github.io/clojure/clojure.test-api.html

(def atom-gameplay (atom nil))
(def fetch [(fn [gameplay]
              (reset! atom-gameplay gameplay)
              gameplay)])

(def basic-gameplay {:map (tool.map/generateMap {:seed 0
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
                     :players [{:key :player
                                :faction 0}
                               {:key :ai1
                                :faction 1}
                               {:key :ai2
                                :faction 1}]
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

(deftest test-1 []
  (async done
         (let [inputCh (a/chan)
               _ (a/go
                   (let [[ctx err] (a/<! (player-turn (merge basic-gameplay
                                                             {:players [{:key :player
                                                                         :faction 0}
                                                                        {:key :ai1
                                                                         :faction 1}
                                                                        {:key :ai2
                                                                         :faction 1}]
                                                              :units {:a {:key :a
                                                                          :position [0 0]
                                                                          :playerKey :player
                                                                          :robotState {:robotKey :gundam
                                                                                       :pilotState nil
                                                                                       :weapons {}
                                                                                       :components {}
                                                                                       :tags {}
                                                                                       :hp 0
                                                                                       :en 0}}}})
                                                      inputCh))
                         _ (println "test-player-turn:" err)
                         _ (is (or (nil? err)
                                   (= "chan closed" (.-message err))))
                           ;_ (when err (throw err))
                         ]))]
           (a/go
             (testing "基本player-turn"
               (testing "移動遊標222"
                 (a/>! inputCh [:on-click "s"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [0 1] (:cursor @atom-gameplay))))

               (testing "打開系統菜單"
                 (a/>! inputCh [:on-click "space"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is ((comp not nil?) (:system-menu-component @atom-gameplay))))

               (testing "設定系統菜單內容"
                 (a/>! inputCh [(fn [ctx]
                                  (update-in ctx [:system-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["move"] ["weapon1" "weapon2"]])
                                                                                       :menu-cursor-data {}})))])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [["move"] ["weapon1" "weapon2"]] (get-in @atom-gameplay [:system-menu-component :menu-cursor :menu]))))

               (testing "下移系統菜單遊標"
                 (a/>! inputCh [:on-click "s"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= 1 (get-in @atom-gameplay [:system-menu-component :menu-cursor :cursor]))))

               (testing "連續右移系統菜單遊標, 但只會被限制在weapon2"
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= 1 (get-in @atom-gameplay [:system-menu-component :menu-cursor :subcursor 1]))))
               (testing "選中weapon2"
                 (is (= "weapon2" (-> @atom-gameplay :system-menu-component :menu-cursor getSelect))))

               (testing "關閉系統菜單"
                 (a/>! inputCh [:on-click "'"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (nil? (:system-menu-component @atom-gameplay))))

               ; "遊標移回(0,0)"
               (a/>! inputCh [:on-click "w"])

               (testing "打開單位菜單"
                 (a/>! inputCh [:on-click "space"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is ((comp not nil?) (:unit-menu-component @atom-gameplay))))

               (testing "設定單位菜單內容"
                 (a/>! inputCh [(fn [ctx]
                                  (update-in ctx [:unit-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["move"] ["weapon1" "weapon2"]])
                                                                                     :menu-cursor-data {}})))])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [["move"] ["weapon1" "weapon2"]] (get-in @atom-gameplay [:unit-menu-component :menu-cursor :menu]))))

               (testing "下移單位菜單遊標"
                 (a/>! inputCh [:on-click "s"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :cursor]))))

               (testing "連續右移單位菜單遊標, 但只會被限制在weapon2"
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :subcursor 1]))))
               (testing "選中weapon2"
                 (is (= "weapon2" (-> @atom-gameplay :unit-menu-component :menu-cursor getSelect))))

               (testing "關閉單位菜單"
                 (a/>! inputCh [:on-click "'"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (nil? (:unit-menu-component @atom-gameplay)))))
             (a/close! inputCh)
             (done)))))

(deftest test-2 []
  (async done
         (let [inputCh (a/chan)
               _ (a/go
                   (let [[ctx err] (a/<! (gameplay-loop (merge basic-gameplay
                                                               {:players [{:key :player
                                                                           :faction 0}
                                                                          {:key :ai1
                                                                           :faction 1}
                                                                          {:key :ai2
                                                                           :faction 1}]
                                                                :active-player-key :player})
                                                        inputCh))
                         _ (println "test-gameplay-loop:" err)
                         _ (is (or (nil? err)
                                   (= "chan closed" (.-message err))))]))]
           (a/go
             (testing "基本gameplay-loop"
               (testing "一開始是player"
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= :player (-> @atom-gameplay :active-player-key))))

               (testing "打開系統菜單"
                 (a/>! inputCh [:on-click "space"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is ((comp not nil?) (:system-menu-component @atom-gameplay))))

               (testing "設定系統菜單內容"
                 (a/>! inputCh [(fn [ctx]
                                  (update-in ctx [:system-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["endTurn"]])
                                                                                       :menu-cursor-data {}})))])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [["endTurn"]] (get-in @atom-gameplay [:system-menu-component :menu-cursor :menu]))))

               (testing "按endTurn結束回合, 現在必須是ai1"
                 (a/>! inputCh [:on-click "space"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= :ai1 (-> @atom-gameplay :active-player-key))))

               (testing "強制退出, 現在必須是ai2"
                 (a/>! inputCh [:return])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= :ai2 (-> @atom-gameplay :active-player-key))))

               (testing "強制退出, 現在必須是player"
                 (a/>! inputCh [:return])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= :player (-> @atom-gameplay :active-player-key)))))
             (a/close! inputCh)
             (done)))))

(deftest test-3 []
  (async done
         (let [inputCh (a/chan)
               _ (a/go
                   (let [[ctx err] (a/<! (player-turn (merge basic-gameplay
                                                             {:players [{:key :player
                                                                         :faction 0}
                                                                        {:key :ai1
                                                                         :faction 1}
                                                                        {:key :ai2
                                                                         :faction 1}]
                                                              :units {:a {:key :a
                                                                          :position [5 0]
                                                                          :playerKey :player
                                                                          :robotState {:robotKey :gundam
                                                                                       :pilotState nil
                                                                                       :weapons {}
                                                                                       :components {}
                                                                                       :tags {}
                                                                                       :hp 0
                                                                                       :en 0}}
                                                                      :b {:key :b
                                                                          :position [10 0]
                                                                          :playerKey :player
                                                                          :robotState {:robotKey :gundam
                                                                                       :pilotState nil
                                                                                       :weapons {}
                                                                                       :components {}
                                                                                       :tags {}
                                                                                       :hp 0
                                                                                       :en 0}}}})
                                                      inputCh))
                         _ (println "test-player-turn-2:" err)
                         _ (is (or (nil? err)
                                   (= "chan closed" (.-message err))))
                           ;_ (when err (throw err))
                         ]))]
           (a/go
             (testing "測試遊標快移"
               (testing "一開始cursor在(0,0)"
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [0 0] (:cursor @atom-gameplay))))

               (testing "遊標快移到單位"
                 (a/>! inputCh [:on-click "q"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [10 0] (:cursor @atom-gameplay))))

               (testing "遊標快移到下個單位"
                 (a/>! inputCh [:on-click "q"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [5 0] (:cursor @atom-gameplay))))

               (testing "遊標快移到第一個單位"
                 (a/>! inputCh [:on-click "q"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [10 0] (:cursor @atom-gameplay))))

               (testing "遊標倒著快移到下個單位"
                 (a/>! inputCh [:on-click "e"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [5 0] (:cursor @atom-gameplay))))

               (testing "遊標倒著快移到下個單位"
                 (a/>! inputCh [:on-click "e"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [10 0] (:cursor @atom-gameplay)))))
             (a/close! inputCh)
             (done)))))

(deftest test-4 []
  (async done
         (let [inputCh (a/chan)
               _ (a/go
                   (let [[ctx err] (a/<! (player-turn (merge basic-gameplay
                                                             {:units {:a {:key :a
                                                                          :position [1 0]
                                                                          :playerKey :player
                                                                          :robotState {:robotKey :gundam
                                                                                       :pilotState nil
                                                                                       :weapons {}
                                                                                       :components {}
                                                                                       :tags {}
                                                                                       :hp 0
                                                                                       :en 0}}}})
                                                      inputCh))
                         _ (println "test-player-turn-3:" err)
                         _ (is (or (nil? err)
                                   (= "chan closed" (.-message err))))
                           ;_ (when err (throw err))
                         ]))]
           (a/go
             (testing "測試moveRange/camera"
               (testing "一開始moveRange為空"
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [] (:moveRange @atom-gameplay))))

               (testing "移到單位上必須有moveRange"
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (pos? (count (:moveRange @atom-gameplay)))))

               (testing "移出單位時moveRange為空"
                 (a/>! inputCh [:on-click "d"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [] (:moveRange @atom-gameplay))))

               (testing "一開始camera在(0,0)"
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [0 0] (:camera @atom-gameplay))))
               
               (testing "移動camera"
                 (a/>! inputCh [:on-click "right"])
                 (a/>! inputCh fetch) (a/<! (a/timeout 0))
                 (is (= [1 0] (:camera @atom-gameplay)))))
             (a/close! inputCh)
             (done)))))