(ns module.v1.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [cljs.reader])
  (:require [app.module]
            [app.lobby.model]
            [tool.map]
            [tool.units]
            [tool.fsm]
            [tool.kmeans]
            [module.v1.type]
            [module.v1.data :as data]
            [module.v1.type :as type]
            [module.v1.common :as common]
            [module.v1.phase.startUnitsMenu :refer [startUnitsMenu]]
            [module.v1.phase.playerTurn :refer [playerTurn]]
            [module.v1.phase.enemyTurn :refer [enemyTurn]]
            [module.v1.system.spec :as spec])
  (:require-macros [module.v1.core :as core]))


(defmethod app.module/loadData :v1 [_]
  (a/go data/data))

(s/def ::lobbyAskGetRobotStoreList (s/keys :req-un [::getRobotStoreList]))
(s/def ::lobbyAskGetPilotStoreList (s/keys :req-un [::getPilotStoreList]))
(s/def ::lobbyAskGetWeaponStoreList (s/keys :req-un [::getWeaponStoreList]))
(s/def ::lobbyAskGetComponentStoreList (s/keys :req-un [::getComponentStoreList]))
(s/def ::lobbyAskGetRobotList (s/keys :req-un [::getRobotList]))
(s/def ::lobbyAskGetPilotList (s/keys :req-un [::getPilotList]))
(s/def ::lobbyAskGetWeaponList (s/keys :req-un [::getWeaponList]))
(s/def ::lobbyAskGetComponentList (s/keys :req-un [::getComponentList]))
(s/def ::lobbyAskQuestion (s/or :getRobotStoreList ::lobbyAskGetRobotStoreList
                                :getPilotStoreList ::lobbyAskGetPilotStoreList
                                :getWeaponStoreList ::lobbyAskGetWeaponStoreList
                                :getComponentStoreList ::lobbyAskGetComponentStoreList
                                :getRobotList ::lobbyAskGetRobotList
                                :getPilotList ::lobbyAskGetPilotList
                                :getWeaponList ::lobbyAskGetWeaponList
                                :getComponentList ::lobbyAskGetComponentList))

(defmethod app.module/lobbyAsk :v1 [_ lobbyCtx question]
  (common/assertSpec ::app.lobby.model/model lobbyCtx)
  (common/assertSpec ::lobbyAskQuestion question)
  (let [[spec value] (s/conform ::lobbyAskQuestion question)]
    (cond
      (= :getRobotList spec)
      (common/assertSpec
       (s/map-of keyword? map?)
       (let [ret (->> (:robots lobbyCtx)
                      (map (fn [[key robotKey]]
                             (common/assertSpec
                              ::type/unit
                              {:key key
                               :position [0 0]
                               :playerKey :player
                               :robotState {:robotKey robotKey
                                            :pilotState (let [keyForPilot (common/assertSpec
                                                                           (s/nilable keyword?)
                                                                           (->> (:robotByPilot lobbyCtx)
                                                                                (filter (fn [[_ robotKey]]
                                                                                          (= robotKey key)))
                                                                                ffirst))]
                                                          (when keyForPilot
                                                            {:key keyForPilot
                                                             :pilotKey (common/assertSpec
                                                                        keyword?
                                                                        ((:pilots lobbyCtx) keyForPilot))
                                                             :expEvade 0
                                                             :expGuard 0
                                                             :expMelee 0
                                                             :expRange 0
                                                             :curage 100}))
                                            :weapons {}
                                            :components {}
                                            :tags {}
                                            :hp 0
                                            :en 0}})))
                      (map (fn [unit]
                             (data/getUnitInfo {:lobbyCtx lobbyCtx} unit)))
                      (zipmap (-> lobbyCtx :robots keys)))]
         ret))

      (= :getWeaponList spec)
      (common/assertSpec
       (s/map-of keyword? map?)
       (let [ret (->> (:weapons lobbyCtx)
                      (map (fn [[key weaponKey]]
                             (common/assertSpec
                              ::type/weaponState
                              {:key key
                               :weaponKey weaponKey
                               :tags {}
                               :bulletCount 100})))
                      (map (fn [weapon]
                             (data/getWeaponInfo {:lobbyCtx lobbyCtx} nil weapon)))
                      (zipmap (-> lobbyCtx :weapons keys)))]
         ret))

      (= :getPilotList spec)
      (common/assertSpec
       (s/map-of keyword? map?)
       (let [ret (->> (:pilots lobbyCtx)
                      (map (fn [[key pilotKey]]
                             (common/assertSpec
                              ::type/pilotState
                              {:key key
                               :pilotKey pilotKey
                               :expMelee 0
                               :expRange 0
                               :expEvade 0
                               :expGuard 0
                               :curage 100})))
                      (map (fn [pilot]
                             (data/getPilotInfo {:lobbyCtx lobbyCtx} nil pilot)))
                      (zipmap (-> lobbyCtx :pilots keys)))]
         ret))

      (= :getComponentList spec)
      (common/assertSpec
       (s/map-of keyword? map?)
       (let [ret (->> (:components lobbyCtx)
                      (map (fn [[key componentKey]]
                             {:key key
                              :componentKey componentKey}))
                      (map (fn [component]
                             (data/getComponentInfo {:lobbyCtx lobbyCtx} nil component)))
                      (zipmap (-> lobbyCtx :components keys)))]
         ret))

      (= :getRobotStoreList spec)
      (common/assertSpec
       (s/map-of keyword? (s/keys :req-un [::cost]))
       (->> data/data :robot
            (map (fn [[robotKey value]]
                   (merge
                    {:cost (:cost value)}
                    (common/assertSpec
                     ::type/unit
                     {:key (keyword robotKey)
                      :position [0 0]
                      :playerKey :player
                      :robotState {:robotKey (keyword robotKey)
                                   :pilotState nil
                                   :weapons {}
                                   :components {}
                                   :tags {}
                                   :hp 0
                                   :en 0}}))))
            (map #(data/getUnitInfo {:lobbyCtx lobbyCtx} %))
            (map (fn [unit] [(:key unit) unit]))
            (into {})))

      :else
      (common/assertSpec
       (s/map-of keyword? map?)
       (let [field (spec {:getPilotStoreList :pilot
                          :getWeaponStoreList :weapon
                          :getComponentStoreList :component})]
         (field data/data))))))



(defn gameplayLoop [gameplayCtx inputCh outputCh]
  (a/go
    (loop [gameplayCtx gameplayCtx]
      (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
      (let [gameplayCtx (common/assertSpec
                         ::type/gameplayCtx
                         (a/<! (playerTurn gameplayCtx nil inputCh outputCh)))
            gameplayCtx (common/assertSpec
                         ::type/gameplayCtx
                         (if (-> gameplayCtx :done)
                           gameplayCtx
                           (let [enemies (->> (:players gameplayCtx)
                                              keys
                                              (filter #(not= :player %)))]
                             (a/<! (a/go-loop [gameplayCtx gameplayCtx
                                               enemies enemies]
                                     (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
                                     (if (= (count enemies) 0)
                                       gameplayCtx
                                       (let [enemy (first enemies)
                                             gameplayCtx (common/assertSpec
                                                          ::type/gameplayCtx
                                                          (a/<! (enemyTurn gameplayCtx enemy inputCh outputCh)))]
                                         (recur gameplayCtx (rest enemies)))))))))]
        (if (-> gameplayCtx :done)
          gameplayCtx
          (recur gameplayCtx))))))


(defn createMapByLevel [gameplayCtx levelStr]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec
   ::type/gameplayCtx
   (let [matchs (re-find #"(\d+)_(\d+)" (or levelStr "0_0"))
         [_ levelType level] (if matchs
                               (map js/parseInt matchs)
                               [0 0 0])
         levelProps {0 {:deepsea 0.6
                        :sea 0.6
                        :sand 0.1
                        :grass 1
                        :hill 1
                        :city 0.3
                        :tree 0.4
                        :award 0.01
                        :power 1
                        :offset 0}
                     1 {:deepsea 0.3
                        :sea 0.3
                        :sand 0.1
                        :grass 1
                        :hill 1
                        :city 0.5
                        :tree 0.4
                        :award 0.01
                        :power 1
                        :offset 0}
                     2 {:deepsea 0.8
                        :sea 0.8
                        :sand 0.2
                        :grass 0.3
                        :hill 0.1
                        :city 0.1
                        :tree 0.1
                        :award 0.01
                        :power 1
                        :offset 0}
                     3 {:deepsea 0.6
                        :sea 0.6
                        :sand 0.1
                        :grass 1
                        :hill 1
                        :city 0.3
                        :tree 0.4
                        :award 0.01
                        :power 1
                        :offset 0}}
          ; create map
         [mw mh] (:mapsize gameplayCtx)
         playmap (tool.map/generateMap
                  {:seed 0
                   :x (* level mw)
                   :y 0
                   :w mw
                   :h mh}
                  (levelProps levelType))
         gameplayCtx (update-in gameplayCtx [:map] (constantly playmap))]
     gameplayCtx)))

(defn createTestUnits [gameplayCtx]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (common/assertSpec
   ::type/gameplayCtx
   (let [[gameplayCtx _] (->> (get data/data :robot)
                              (take 4)
                              (reduce (fn [[gameplayCtx i] [robotKey _]]
                                        [(-> gameplayCtx
                                             (data/createUnit {:playerKey :player
                                                               :position [0 i]}
                                                              {:robotKey robotKey})
                                             (data/createUnit {:playerKey :ai1
                                                               :position [5 i]}
                                                              {:robotKey robotKey}))
                                         (inc i)])
                                      [gameplayCtx 1]))]
     gameplayCtx)))

(defn createUserSelectedUnitsAsync [gameplayCtx lobbyCtx inputCh outputCh]
  (common/assertSpec ::type/gameplayCtx gameplayCtx)
  (a/go
    (common/assertSpec
     ::type/gameplayCtx
     (let [; 選角頁
           [gameplayCtx selectedUnits] (a/<! (startUnitsMenu gameplayCtx {:units (or (-> lobbyCtx :robots) {})} inputCh outputCh))
          ; 產生自己選出的軍隊
           gameplayCtx (->> (map (fn [idx key robotKey]
                                   [{:key key
                                     :playerKey :player
                                     :position [0 (+ idx 1)]}
                                    {:robotKey robotKey
                                     :pilotState (let [keyForPilot (common/assertSpec
                                                                    (s/nilable keyword?)
                                                                    (->> (:robotByPilot lobbyCtx)
                                                                         (filter (fn [[_ robotKey]]
                                                                                   (= robotKey key)))
                                                                         ffirst))]
                                                   (when keyForPilot
                                                     {:key keyForPilot
                                                      :pilotKey (common/assertSpec
                                                                 keyword?
                                                                 ((:pilots lobbyCtx) keyForPilot))
                                                      :expEvade 0
                                                      :expGuard 0
                                                      :expMelee 0
                                                      :expRange 0
                                                      :curage 100}))}])
                                 (range)
                                 selectedUnits
                                 (map #(-> lobbyCtx :robots %) selectedUnits))
                            (reduce (fn [gameplayCtx [entity state]]
                                      (data/createUnit gameplayCtx entity state))
                                    gameplayCtx))]
       gameplayCtx))))


(defmethod app.module/gameplayLoad :v1 [_ ctx inputCh outputCh]
  (let [gameplayCtx (data/load! data/gameplayCtx)
        gameplayCtx (a/<! (gameplayLoop gameplayCtx inputCh outputCh))
        _ (a/<! (common/gameplayDone nil (:done gameplayCtx) inputCh outputCh))
          ; 取代lobbyCtx
        ctx (assoc ctx
                   :lobbyCtx (:lobbyCtx gameplayCtx)
                   :gameplayCtx gameplayCtx)]
    ctx))

(defmethod app.module/gameplayStart :v1 [_ ctx args inputCh outputCh]
  (a/go
    (let [; copy lobbyCtx first
          gameplayCtx (assoc data/gameplayCtx :lobbyCtx (:lobbyCtx ctx))
          ; 建立地圖
          gameplayCtx (createMapByLevel gameplayCtx args)
          ; 產生自己選出的軍隊
          gameplayCtx (a/<! (createUserSelectedUnitsAsync gameplayCtx (:lobbyCtx ctx) inputCh outputCh))
          ; 產生敵機
          gameplayCtx (common/assertSpec
                       ::type/gameplayCtx
                       (let [[mw mh] (:mapsize gameplayCtx)
                             posList (take 5 (map vector
                                                  (repeatedly #(rand-int mw))
                                                  (repeatedly #(rand-int mh))))
                             beforeCentroids [[15, 15]]
                             clusterCnt (count beforeCentroids)
                             {:keys [clusters centroids]} (tool.kmeans/kmeans posList clusterCnt {:initialization beforeCentroids})
                             ; 團體先偏移到本來設定的集結點
                             posList (map (fn [pos cluster]
                                            (let [{:keys [centroid]} (nth centroids cluster)
                                                  beforeCentroid (nth beforeCentroids cluster)
                                                  offset (map - beforeCentroid centroid)]
                                              (mapv + pos offset)))
                                          posList
                                          clusters)
                             ; 團體向團體中心集結
                             posList (loop [posList posList
                                            times 0]
                                       (if (> times 3)
                                         posList
                                         (let [{:keys [clusters centroids]} (tool.kmeans/kmeans posList clusterCnt {:initialization beforeCentroids})
                                               tmp (map (fn [pos cluster]
                                                          (let [{:keys [centroid error]} (centroids cluster)
                                                                offset (if (> error 5)
                                                                         (->> (map - centroid pos)
                                                                              (map #(/ % 3)))
                                                                         [0 0])]
                                                            (mapv + pos offset)))
                                                        posList
                                                        clusters)]
                                           (recur tmp (inc times)))))
                             ; 限制在地圖內並取出不重復的點
                             posList (->> (map #(mapv js/Math.floor %) posList)
                                          (map (fn [[x y]]
                                                 [(max 0 (min (dec mw) x))
                                                  (max 0 (min (dec mh) y))]))
                                          (distinct))
                             ; 產生軍隊
                             gameplayCtx (reduce (fn [gameplayCtx pos]
                                                   (-> gameplayCtx
                                                       (data/createUnit {:playerKey :ai1
                                                                         :position pos}
                                                                        {:robotKey :gundam})))
                                                 gameplayCtx
                                                 posList)]
                         gameplayCtx))
          _ (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
          ; 讓不能在地上的部隊飛起來
          gameplayCtx (a/<! (a/go
                              (common/assertSpec
                               ::type/gameplayCtx
                               (loop [gameplayCtx gameplayCtx
                                      unitList (-> (:units gameplayCtx) tool.units/getAll)]
                                 (let [[unit & unitList] unitList]
                                   (if unit
                                     (let [nextUnit (a/<! (data/fixUnitSkyGround gameplayCtx unit inputCh outputCh))
                                           gameplayCtx (data/updateUnit gameplayCtx unit (constantly nextUnit))]
                                       (recur gameplayCtx unitList))
                                     gameplayCtx))))))
          gameplayCtx (a/<! (gameplayLoop gameplayCtx inputCh outputCh))
          _ (a/<! (common/gameplayDone nil (:done gameplayCtx) inputCh outputCh))
          ; 取代lobbyCtx
          ctx (assoc ctx
                     :lobbyCtx (:lobbyCtx gameplayCtx)
                     :gameplayCtx gameplayCtx)]
      ctx)))


(defmethod app.module/testIt :v1 [_ inputCh outputCh]
  (when inputCh
    (a/go
      (loop []
        (let [[cmd [id subargs :as args] :as evt] (a/<! inputCh)]
          ; 使用print強制所有欄位求值. 不然有些程式碼不會運行到
          (js/console.log (clj->js args))
          (a/>! outputCh ["ok", [id]])
          (recur)))))
  (let [testAll true
        ; 有些電腦很像是記憶體的關係, a/go中不能有太多程式碼(還是macro), 會出現macroexpand stack overflow或是a/aset不能解析等
        ; 要用奇怪的方式把程式碼分散在不同的a/go中, 使用waitCh來block線程
        waitCh (a/chan)
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
      (a/<! (a/timeout 3000))
      (a/>! waitCh true))

    (a/go
      (a/<! waitCh) ;等待線程
      (core/defclick (or testAll true) "select units"
        [up down left enter]
        (a/<! (a/timeout 3000))) ; wait player turn start animation
      (a/>! waitCh true))

    (a/go
      (a/<! waitCh) ;等待線程
      (core/defclick (or testAll true) "create unit"
        []
        (core/defexe (fn [ctx]
                       (-> ctx
                           (data/createUnit {:key :unit1
                                             :playerKey :player
                                             :position [0 0]}
                                            {:robotKey :gaite_land
                                             :pilotState {:key :test
                                                          :pilotKey :amuro
                                                          :expEvade 0
                                                          :expGuard 0
                                                          :expMelee 0
                                                          :expRange 0
                                                          :curage 0}})
                           (data/createUnit {:key :unit2
                                             :playerKey :player
                                             :position [4 0]}
                                            {:robotKey :zgundam_sky})
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

      (core/defclick (or testAll false) "test gundam from ground to sky"
        [right right right right enter]
        (core/defexe (fn [gameplayCtx]
                       (when (not (s/valid? ::spec/unitMenuView gameplayCtx))
                         (throw (js/Error. "should open unitMenu")))
                       gameplayCtx))
        (core/defclick true "move to sky button and click"
          [down down down enter]
          (a/<! (a/timeout 500)))
        (core/defexe (fn [gameplayCtx]
                       gameplayCtx))
        (core/defclick true "move cursor back"
          [cancel left left left left]))

      (core/defclick (or testAll false) "open and close system menu"
        [right enter]
        (core/defexe (fn [gameplayCtx]
                       (when (not (s/valid? ::spec/systemMenuView gameplayCtx))
                         (throw (js/Error. "should open systemMenu")))
                       gameplayCtx))
        (core/defclick true "close system menu"
          [down up down enter])
        (core/defexe (fn [gameplayCtx]
                       (when (s/valid? ::spec/systemMenuView gameplayCtx)
                         (throw (js/Error. "should close systemMenu")))
                       gameplayCtx))
        (core/defclick true "move cursor back"
          [left]))

      (core/defclick (or testAll false) "open and close unit menu"
        [enter]
        (core/defexe (fn [gameplayCtx]
                       (when (not (s/valid? ::spec/unitMenuView gameplayCtx))
                         (throw (js/Error. "should open unitMenu")))
                       gameplayCtx))
        (core/defclick true "close unit menu"
          [cancel])
        (core/defexe (fn [gameplayCtx]
                       (when (s/valid? ::spec/unitMenuView gameplayCtx)
                         (throw (js/Error. "should close unitMenu")))
                       gameplayCtx)))
      ; 線程結束
      (a/>! waitCh true)
      (print "ok"))

    (a/go
      (a/<! waitCh)
      (core/defclick (or testAll false) "test transform"
        []
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (common/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_land)
                           (throw (js/Error. "should gaite_land")))
                         gameplayCtx)))
        (core/defclick true "transform to sky"
          [enter
           down down enter])
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (common/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_sky)
                           (throw (js/Error. "should transform to sky")))
                         gameplayCtx)))
        (core/defclick true "transform back"
          [down down enter cancel])
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (common/assertSpec ::type/unit unit1)
                         (when (not= (-> unit1 :robotState :robotKey) :gaite_land)
                           (throw (js/Error. "should gaite_land")))
                         gameplayCtx))))

      (let [bulletCount (atom 0)]
        (core/defclick (or testAll false) "bullet count"
          []
          (core/defexe (fn [gameplayCtx]
                         (let [{units :units} gameplayCtx
                               unit1 (tool.units/getByKey units :unit1)
                               weapons (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit1)]
                           (common/assertSpec ::type/unit unit1)
                           (common/assertSpec ::type/weaponEntry weapons)
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
                               weapons (data/getUnitWeapons {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit1)]
                           (common/assertSpec ::type/unit unit1)
                           (common/assertSpec ::type/weaponEntry weapons)
                           (when (not= (get-in weapons [1 1 :bulletCount]) (dec @bulletCount))
                             (throw (js/Error. "bullet count must dec")))
                           gameplayCtx)))))
      (a/>! waitCh true)
      (println "ok"))

    (a/go
      (a/<! waitCh)
      (core/defclick (or testAll false) "done tag"
        []
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (common/assertSpec ::type/unit unit1)
                         (when (not (contains? (-> unit1 :robotState :tags) :done))
                           (throw (js/Error. "unit1 must done")))
                         gameplayCtx)))
        (core/defclick true "click endTurn"
          [right enter down enter])
        (a/<! (a/timeout 3000))
        (core/defexe (fn [gameplayCtx]
                       (let [{units :units} gameplayCtx
                             unit1 (tool.units/getByKey units :unit1)]
                         (common/assertSpec ::type/unit unit1)
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

      (core/defclick (or testAll false) "move"
        [enter enter right enter cancel cancel cancel left])

      (core/defclick (or testAll false) "enemy unit only cancel menu"
        [right right enter enter left left])
      (a/>! waitCh true))
    (a/go
      (a/<! waitCh))))