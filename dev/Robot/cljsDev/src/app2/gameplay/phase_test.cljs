(ns app2.gameplay.phase-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.tool.gameplay-spec]
            [app2.gameplay.phase :refer [player-turn gameplay-loop]]
            [tool.menuCursor :refer [getSelect]]))

(def atom-gameplay (atom nil))
(def fetch [(fn [gameplay]
              (reset! atom-gameplay gameplay)
              gameplay)])

(deftest test-player-turn []
  (testing ""
    (async done
           (let [inputCh (a/chan)
                 _ (a/go
                     (let [[ctx err] (a/<! (player-turn {:cursor [0 0]
                                                         :mapsize [10 10]
                                                         :players [{:key :player
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
                                                                                  :en 0}}}
                                                         :numberOfTurn 0
                                                         :money 0}
                                                      inputCh))
                           _ (println "test-player-turn:" err)
                           _ (is (or (nil? err)
                                     (= "chan closed" (.-message err))))
                           ;_ (when err (throw err))
                           ]))
                 _ (a/go
                     (println "移動遊標")
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [0 1] (:cursor @atom-gameplay)))

                     (println "打開系統菜單")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is ((comp not nil?) (:system-menu-component @atom-gameplay)))

                     (println "設定系統菜單內容")
                     (a/>! inputCh [(fn [ctx]
                                      (update-in ctx [:system-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["move"] ["weapon1" "weapon2"]])
                                                                                           :menu-cursor-data {}})))])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [["move"] ["weapon1" "weapon2"]] (get-in @atom-gameplay [:system-menu-component :menu-cursor :menu])))

                     (println "下移系統菜單遊標")
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:system-menu-component :menu-cursor :cursor])))

                     (println "連續右移系統菜單遊標, 但只會被限制在weapon2")
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:system-menu-component :menu-cursor :subcursor 1])))
                     (println "選中weapon2")
                     (is (= "weapon2" (-> @atom-gameplay :system-menu-component :menu-cursor getSelect)))

                     (println "關閉系統菜單")
                     (a/>! inputCh [:on-click "'"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (nil? (:system-menu-component @atom-gameplay)))

                     (println "遊標移回(0,0)")
                     (a/>! inputCh [:on-click "w"])

                     (println "打開單位菜單")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is ((comp not nil?) (:unit-menu-component @atom-gameplay)))

                     (println "設定單位菜單內容")
                     (a/>! inputCh [(fn [ctx]
                                      (update-in ctx [:unit-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["move"] ["weapon1" "weapon2"]])
                                                                                         :menu-cursor-data {}})))])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [["move"] ["weapon1" "weapon2"]] (get-in @atom-gameplay [:unit-menu-component :menu-cursor :menu])))

                     (println "下移單位菜單遊標")
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :cursor])))

                     (println "連續右移單位菜單遊標, 但只會被限制在weapon2")
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :subcursor 1])))
                     (println "選中weapon2")
                     (is (= "weapon2" (-> @atom-gameplay :unit-menu-component :menu-cursor getSelect)))

                     (println "關閉單位菜單")
                     (a/>! inputCh [:on-click "'"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (nil? (:unit-menu-component @atom-gameplay)))

                     (a/close! inputCh)
                     (done))]))))


(deftest test-gameplay-loop []
  (testing ""
    (async done
           (let [inputCh (a/chan)
                 _ (a/go
                     (let [[ctx err] (a/<! (gameplay-loop {:cursor [0 0]
                                                           :mapsize [10 10]
                                                           :players [{:key :player
                                                                      :faction 0}
                                                                     {:key :ai1
                                                                      :faction 1}
                                                                     {:key :ai2
                                                                      :faction 1}]
                                                           :active-player-key :player
                                                           :units {}
                                                           :numberOfTurn 0
                                                           :money 0}
                                                          inputCh))
                           _ (println "test-gameplay-loop:" err)
                           _ (is (or (nil? err)
                                     (= "chan closed" (.-message err))))]))
                 _ (a/go
                     (println "一開始是player")
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= :player (-> @atom-gameplay :active-player-key)))

                     (println "打開系統菜單")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is ((comp not nil?) (:system-menu-component @atom-gameplay)))

                     (println "設定系統菜單內容")
                     (a/>! inputCh [(fn [ctx]
                                      (update-in ctx [:system-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["endTurn"]])
                                                                                           :menu-cursor-data {}})))])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [["endTurn"]] (get-in @atom-gameplay [:system-menu-component :menu-cursor :menu])))

                     (println "按endTurn結束回合, 現在必須是ai1")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= :ai1 (-> @atom-gameplay :active-player-key)))

                     (println "強制退出, 現在必須是ai2")
                     (a/>! inputCh [:return])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= :ai2 (-> @atom-gameplay :active-player-key)))

                     (println "強制退出, 現在必須是player")
                     (a/>! inputCh [:return])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= :player (-> @atom-gameplay :active-player-key)))

                     (a/close! inputCh)
                     (done))]))))