(ns module.v1.core
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require [app.module])
  (:require [tool.map])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [module.v1.type])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require-macros [module.v1.core :as core])
  (:require [module.v1.common :as common])
  (:require [module.v1.phase.playerTurn :refer [playerTurn]])
  (:require [module.v1.phase.enemyTurn :refer [enemyTurn]]))


(def mapViewSize [20 20])
(def gameplayCtx {:map [[]]
                  :camera [0 0]
                  :cursor [0 0]
                  :viewsize mapViewSize
                  :mapsize [20 20]
                  :units tool.units/model
                  :moveRange []
                  :players {:player {:faction 0}
                            :ai1 {:faction 1}
                            :ai2 {:faction 1}}
                  :fsm tool.fsm/model})

(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (let [gameplayCtx (a/<! (playerTurn gameplayCtx nil inputCh outputCh))
            ; 回傳空值代表有例外
            _ (when (nil? gameplayCtx)
                (throw (js/Error. "stop in playerTurn")))
            enemies (->> (:players gameplayCtx)
                         keys
                         (filter #(not= :player %)))
            enemyTurns (a/go-loop [gameplayCtx gameplayCtx
                                   enemies enemies]
                         (if (= (count enemies) 0)
                           gameplayCtx
                           (let [enemy (first enemies)
                                 gameplayCtx (a/<! (enemyTurn gameplayCtx enemy inputCh outputCh))
                                 _ (when (nil? gameplayCtx)
                                     (throw (js/Error. "stop in enemyTurn")))]
                             (recur gameplayCtx (rest enemies)))))
            _ (when (nil? enemyTurns)
                (throw (js/Error. "stop in enemyTurns")))]
        (recur (a/<! enemyTurns))))))


(defmethod app.module/loadData :v1 [_]
  (a/go data/data))

(defmethod app.module/lobbyGetUnits :v1 [_ lobbyCtx])

(defmethod app.module/lobbyGetPilots :v1 [_ lobbyCtx])

(defmethod app.module/gameplayStart :v1 [_ ctx inputCh outputCh]
  (a/go
    (let [playmap (tool.map/generateMap 20 20
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
          gameplayCtx (-> gameplayCtx
                          (update-in [:map] (constantly playmap)))]
      (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
      (a/<! (gameplayLoop gameplayCtx inputCh outputCh)))))


(defmethod app.module/testIt :v1 [_ inputCh outputCh]
  (when inputCh
    (a/go
      (loop []
        (let [[cmd [id subargs :as args] :as evt] (a/<! inputCh)]
          ; 使用print強制所有欄位求值. 不然有些程式碼不會運行到
          (js/console.log (clj->js args))
          (a/>! outputCh ["ok", [id]])
          (recur)))))
  (let [testAll false
        right 68
        down 83
        left 65
        up 87
        enter 13
        cancel 27
        rup 38
        rdown 40
        rleft 37
        rright 39]
    (a/go
      (core/defclick (or testAll true) "create unit"
        []
        (core/defexe (fn [ctx]
                       (-> ctx
                           (data/createUnit {:key :unit1
                                             :playerKey :player
                                             :position [0 0]}
                                            {:robotKey :gaite_land})
                           (data/createUnit {:key :unit2
                                             :playerKey :player
                                             :position [4 0]}
                                            {:robotKey :gundam})
                           (data/createUnit {:key :unit3
                                             :playerKey :ai1
                                             :position [2 0]}
                                            {:robotKey :gundam}))))
        (core/defexe (fn [{units :units :as gameplayCtx}]
                       (when (not (tool.units/getByKey units :unit1))
                         (throw (js/Error. (str "unit1 not found"))))
                       (when (not (tool.units/getByKey units :unit2))
                         (throw (js/Error. (str "unit1 not found"))))
                       (when (not (tool.units/getByKey units :unit3))
                         (throw (js/Error. (str "unit1 not found"))))
                       gameplayCtx)))

      (core/defclick (or testAll false) "open and close system menu"
        [right enter]
        (core/defexe (fn [gameplayCtx]
                       (when (not (s/valid? ::type/systemMenuView gameplayCtx))
                         (throw (js/Error. "should open systemMenu")))
                       gameplayCtx))
        (core/defclick true "close system menu"
          [down up down enter])
        (core/defexe (fn [gameplayCtx]
                       (when (s/valid? ::type/systemMenuView gameplayCtx)
                         (throw (js/Error. "should close systemMenu")))
                       gameplayCtx))
        (core/defclick true "move cursor back"
          [left]))

      (core/defclick (or testAll false) "open and close unit menu"
        [enter]
        (core/defexe (fn [gameplayCtx]
                       (when (not (s/valid? ::type/unitMenuView gameplayCtx))
                         (throw (js/Error. "should open systemMenu")))
                       gameplayCtx))
        (core/defclick true "close unit menu"
          [cancel])
        (core/defexe (fn [gameplayCtx]
                       (when (s/valid? ::type/unitMenuView gameplayCtx)
                         (throw (js/Error. "should close systemMenu")))
                       gameplayCtx)))

      (core/defclick (or testAll false) "test transform"
        []
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (type/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_land)
                           (throw (js/Error. "should gaite_land")))
                         gameplayCtx)))
        (core/defclick true "transform to sky"
          [enter
           down down enter])
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (type/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_sky)
                           (throw (js/Error. "should transform to sky")))
                         gameplayCtx)))
        (core/defclick true "transform back"
          [down down enter cancel])
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (type/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_land)
                           (throw (js/Error. "should gaite_land")))
                         gameplayCtx))))

      (let [bulletCount (atom 0)]
        (core/defclick (or testAll false) "bullet count"
          []
          (core/defexe (fn [gameplayCtx]
                         (let [{units :units} gameplayCtx
                               unit1 (tool.units/getByKey units :unit1)
                               weapons (data/getUnitWeapons gameplayCtx unit1)]
                           (type/assertSpec ::type/unit unit1)
                           (type/assertSpec ::type/weaponEntry weapons)
                           (reset! bulletCount (get-in weapons [1 1 :bulletCount]))
                           gameplayCtx)))
          (core/defclick true "open menu and attack use bullet weapon"
            [enter
             down right enter
             right right enter enter])
        ; wait battle animation
          (a/<! (a/timeout 5000))
          (core/defclick true "back"
            [left left])
          (core/defexe (fn [gameplayCtx]
                         (let [{units :units} gameplayCtx
                               unit1 (tool.units/getByKey units :unit1)
                               weapons (data/getUnitWeapons gameplayCtx unit1)]
                           (type/assertSpec ::type/unit unit1)
                           (type/assertSpec ::type/weaponEntry weapons)
                           (when (not= (get-in weapons [1 1 :bulletCount]) (dec @bulletCount))
                             (throw (js/Error. "bullet count must dec")))
                           gameplayCtx)))))

      (core/defclick (or testAll false) "done tag"
        []
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (type/assertSpec ::type/unit unit1)
                         (when (not (contains? (-> unit1 :robotState :tags) :done))
                           (throw (js/Error. "unit1 must done")))
                         gameplayCtx)))
        (core/defclick true "click endTurn"
          [right enter enter])
        (a/<! (a/timeout 3000))
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (type/assertSpec ::type/unit unit1)
                         (when (contains? (-> unit1 :robotState :tags) :done)
                           (throw (js/Error. "unit1 must not done")))
                         gameplayCtx))))

      (core/defclick (or testAll false) "move cursor"
        [right down left up])

      (core/defclick (or testAll false) "move camera"
        [rright rdown rleft rup])

      (core/defclick (or testAll false) "menu"
        [enter
         down up down left left right right
         down down up up cancel])

      (core/defclick (or testAll true) "move"
        [enter enter right enter cancel cancel cancel left])

      (core/defclick (or testAll false) "enemy unit only cancel menu"
        [right right enter enter left left])

      (print "ok"))))