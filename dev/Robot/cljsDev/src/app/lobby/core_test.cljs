(ns app.lobby.core-test
  (:require [cljs.test :refer-macros [deftest is async]]
            [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [clojure.test.check]
            [clojure.spec.gen.alpha :as gen])
  (:require [app.lobby.core]
            [app.lobby.model]))


(deftest test-basic
  (async
   done
   (let [outputToView (a/chan)
         inputFromView (a/chan)
         model app.lobby.model/defaultLobbyModel]
     (a/go
       (a/<! (app.lobby.core/startLobby {:lobbyCtx model
                                         :money 0} inputFromView outputToView)))
     (a/go
       (let [_ (a/>! inputFromView ["getRobotStoreList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getPilotStoreList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getWeaponStoreList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getComponentStoreList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getRobotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getPilotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getWeaponList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))
       (let [_ (a/>! inputFromView ["getComponentList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))

       (println "一開始0元, 必須沒錢買跳錯誤")
       (let [_ (a/>! inputFromView ["buyRobotById" ["any" {"key" "gundam"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert (comp not nil?) err))

       (println "增加100000元")
       (let [_ (a/>! inputFromView [:test (fn [lobby]
                                            (assoc lobby :money 100000))])
             _ (a/<! outputToView)])

       (println "買鋼彈成功")
       (let [_ (a/>! inputFromView ["buyRobotById" ["any" {"key" "gundam"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert nil? err))
       (let [_ (a/>! inputFromView [:test identity])
             lobbyCtx (a/<! outputToView)]
         (assert (= 83100 (:money lobbyCtx))))

       (println "買到不存在的機器必須錯誤")
       (let [_ (a/>! inputFromView ["buyRobotById" ["any" {"key" "gundam2"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert (comp not nil?) err))

       (println "檢查所買的機體庫存")
       (let [_ (a/>! inputFromView ["getRobotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)
             _ (s/assert (s/coll-of (s/tuple keyword? map?)) res)
             _ (assert (= 1 (count res)))
             [_ robot] (first res)
             _ (assert (= :gundam (-> robot :robotState :robotKey)))])

       (println "買空駕駛必須吐出錯誤")
       (let [_ (a/>! inputFromView ["buyPilotById" ["any" {"key" nil}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert (comp not nil?) err))

       (println "買不存在駕駛必須吐出錯誤")
       (let [_ (a/>! inputFromView ["buyPilotById" ["any" {"key" "abc"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert (comp not nil?) err))

       (println "買駕駛")
       (let [_ (a/>! inputFromView ["buyPilotById" ["any" {"key" "amuro"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert nil? err))

       (println "檢查所買的駕駛庫存")
       (let [_ (a/>! inputFromView ["getPilotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)
             _ (s/assert (s/coll-of (s/tuple keyword? map?)) res)
             _ (assert (= 1 (count res)))])

       (println "設置駕駛")
       (let [_ (a/>! inputFromView [:test identity])
             {:keys [robots pilots]} (a/<! outputToView)
             robotA (clj->js (ffirst robots))
             pilotA (clj->js (ffirst pilots))
             _ (a/>! inputFromView ["setRobotPilot" ["any" {"robotKey" robotA "pilotKey" pilotA}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (js/console.log err)
             _ (s/assert nil? err)

             _ (a/>! inputFromView [:test identity])
             {:keys [robotByPilot]} (a/<! outputToView)
             _ (assert (= (keyword robotA) (robotByPilot (keyword pilotA))))])

       (println "設置不存在的駕駛和機體必須吐出錯誤")
       (let [_ (a/>! inputFromView ["setRobotPilot" ["any" {"robotKey" "abc" "pilotKey" "abc"}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (s/assert (comp not nil?) err)])

       (println "買武器")
       (let [_ (a/>! inputFromView ["buyWeaponById" ["any" {"key" "beam_mega1"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert nil? err))

       (println "檢查所買的武器庫存")
       (let [_ (a/>! inputFromView ["getWeaponList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)
             _ (s/assert (s/coll-of (s/tuple keyword? map?)) res)
             _ (assert (= 1 (count res)))])

       (println "設置武器")
       (let [_ (a/>! inputFromView [:test identity])
             {:keys [robots weapons]} (a/<! outputToView)
             robotA (clj->js (ffirst robots))
             weaponA (clj->js (ffirst weapons))
             _ (a/>! inputFromView ["addRobotWeapon" ["any" {"robotKey" robotA "weaponKey" weaponA}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (s/assert nil? err)

             _ (a/>! inputFromView [:test identity])
             {:keys [robotByWeapon]} (a/<! outputToView)
             _ (assert (= (keyword robotA) (robotByWeapon (keyword weaponA))))])

       (let [_ (a/>! inputFromView ["getRobotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))

       (println "移除武器")
       (let [_ (a/>! inputFromView [:test identity])
             {:keys [weapons]} (a/<! outputToView)
             weaponA (clj->js (ffirst weapons))
             _ (a/>! inputFromView ["removeRobotWeapon" ["any" {"weaponKey" weaponA}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (s/assert nil? err)

             _ (a/>! inputFromView [:test identity])
             {:keys [robotByWeapon]} (a/<! outputToView)
             _ (s/assert nil? (robotByWeapon (keyword weaponA)))])

       (println "買配件")
       (let [_ (a/>! inputFromView ["buyComponentById" ["any" {"key" "energy1"}]])
             [_ [_ [err _]]] (a/<! outputToView)]
         (s/assert nil? err))

       (println "檢查所買的配件庫存")
       (let [_ (a/>! inputFromView ["getComponentList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)
             _ (s/assert (s/coll-of (s/tuple keyword? map?)) res)
             _ (assert (= 1 (count res)))])

       (println "設置配件")
       (let [_ (a/>! inputFromView [:test identity])
             {:keys [robots components]} (a/<! outputToView)
             robotA (clj->js (ffirst robots))
             componentA (clj->js (ffirst components))
             _ (a/>! inputFromView ["addRobotComponent" ["any" {"robotKey" robotA "componentKey" componentA}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (s/assert nil? err)

             _ (a/>! inputFromView [:test identity])
             {:keys [robotByComponent]} (a/<! outputToView)
             _ (assert (= (keyword robotA) (robotByComponent (keyword componentA))))])

       (let [_ (a/>! inputFromView ["getRobotList" ["any" {"offset" 0 "limit" 20}]])
             [_ [_ [_ res]]] (a/<! outputToView)]
         (s/assert (s/coll-of (s/tuple keyword? map?)) res))

       (println "移除配件")
       (let [_ (a/>! inputFromView [:test identity])
             {:keys [components]} (a/<! outputToView)
             componentA (clj->js (ffirst components))
             _ (a/>! inputFromView ["removeRobotComponent" ["any" {"componentKey" componentA}]])
             [_ [_ [err _]]] (a/<! outputToView)
             _ (s/assert nil? err)

             _ (a/>! inputFromView [:test identity])
             {:keys [robotByComponent]} (a/<! outputToView)
             _ (s/assert nil? (robotByComponent (keyword componentA)))])



       (done)))))