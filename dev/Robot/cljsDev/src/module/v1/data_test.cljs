(ns module.v1.data-test
  (:require [cljs.test :refer-macros [deftest is async]]
            [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [clojure.test.check] ; 注意: 必須引入這個, 不然會錯誤
            [clojure.spec.gen.alpha :as gen])
  (:require [tool.map]
            [tool.units]
            [tool.fsm]
            [module.v1.data :as data]
            [module.v1.type :as type]
            [module.v1.system.spec :as spec]))


(def weapon (assoc (gen/generate (s/gen ::type/weapon))
                   :weaponKey :beam_mega1))
(def component (gen/generate (s/gen ::type/component)))
(def unitA {:key :a
            :position [0 0]
            :playerKey :a
            :robotState {:robotKey :gundam
                         :pilotKey :a
                         :tags {}
                         :hp 0
                         :en 0
                         :weapons {:a [weapon]}
                         :components {:a [component]}}})

(deftest test-fn-spec
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
        gameplayCtx {:map playmap :fsm tool.fsm/model :units tool.units/model}
        _ (data/getTerrain gameplayCtx [0 0])
        _ (data/moveCost gameplayCtx unitA [0 0] [0 1])
        _ (data/getWeaponRange nil unitA weapon)
        _ (data/getWeaponType nil unitA weapon)
        _ (data/getWeaponSuitability nil unitA weapon)
        _ (data/getWeaponInfo nil unitA weapon)
        _ (data/invalidWeapon? nil unitA weapon)
        _ (data/findNearestTerrainPosition gameplayCtx :award [0 0])]))

(defmethod cljs.test/report [:cljs.test/default :end-run-tests] [m]
  (if (cljs.test/successful? m)
    (println "Success!")
    (println "FAIL")))