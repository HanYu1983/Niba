(ns app2.phase.core-test
  (:require [cljs.test :refer-macros [deftest is testing async]]
            [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.gameplay-spec]
            [app2.phase.player-turn :refer [player-turn]]
            [tool.menuCursor :refer [getSelect]]))

(def atom-gameplay (atom nil))
(def fetch (fn [gameplay]
             (reset! atom-gameplay gameplay)
             gameplay))

(deftest test-player-turn []
  (testing ""
    (async done
           (let [inputCh (a/chan)
                 _ (a/go
                     (let [[ctx err] (a/<! (player-turn {:cursor [0 0]
                                                         :mapsize [10 10]
                                                         :units {"entity1" {:key "wow"
                                                                            :position [0 0]}}}
                                                      inputCh))
                           _ (println "=====" err)
                           _ (is (or (nil? err)
                                     (= "chan closed" (.-message err))))]))
                 _ (a/go
                     (println "移動遊標")
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [0 1] (:cursor @atom-gameplay)))

                     (println "打開系統菜單")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is ((comp not nil?) (:system-menu-component @atom-gameplay)))

                     (println "關閉系統菜單")
                     (a/>! inputCh [:on-click "esc"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (nil? (:system-menu-component @atom-gameplay)))

                     (println "遊標移回(0,0)")
                     (a/>! inputCh [:on-click "w"])

                     (println "打開單位菜單")
                     (a/>! inputCh [:on-click "space"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is ((comp not nil?) (:unit-menu-component @atom-gameplay)))

                     (println "設定菜單內容")
                     (a/>! inputCh (fn [ctx]
                                     (update-in ctx [:unit-menu-component] (constantly {:menu-cursor (tool.menuCursor/model [["move"] ["weapon1" "weapon2"]])
                                                                                        :menu-cursor-data {}}))))
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= [["move"] ["weapon1" "weapon2"]] (get-in @atom-gameplay [:unit-menu-component :menu-cursor :menu])))

                     (println "下移菜單遊標")
                     (a/>! inputCh [:on-click "s"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :cursor])))

                     (println "連續右移菜單遊標, 但只會被限制在weapon2")
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh [:on-click "d"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (= 1 (get-in @atom-gameplay [:unit-menu-component :menu-cursor :subcursor 1])))
                     (println "選中weapon2")
                     (is (= "weapon2" (-> @atom-gameplay :unit-menu-component :menu-cursor getSelect)))

                     (println "關閉單位菜單")
                     (a/>! inputCh [:on-click "esc"])
                     (a/>! inputCh fetch) (a/<! (a/timeout 0))
                     (is (nil? (:unit-menu-component @atom-gameplay)))

                     (a/close! inputCh)
                     (done))]))))