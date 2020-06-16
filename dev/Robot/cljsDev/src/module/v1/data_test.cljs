(ns module.v1.data-test
  (:require [cljs.test :refer-macros [deftest is testing async run-tests]]
            [clojure.core.async :as a]
            [clojure.spec.alpha :as s]
            [clojure.test.check] ; 注意: 必須引入這個, 不然會錯誤
            [clojure.spec.gen.alpha :as gen])
  (:require [module.v1.data :as data]
            [module.v1.type :as type]
            [module.v1.system.spec :as spec]))

(def playmap [[1 2] [3 4]])
(def weapon (assoc (gen/generate (s/gen ::type/weapon))
                   :weaponKey :beam_mega1))
(def component (gen/generate (s/gen ::type/component)))
(def unitA {:key :a
            :position [0 0]
            :playerKey :a
            :robotState {:robotKey :a
                         :pilotKey :a
                         :tags {}
                         :hp 0
                         :en 0
                         :weapons {:a [weapon]}
                         :components {:a [component]}}})

(deftest test-basic
  (is (s/valid? ::type/unit unitA))
  (is (s/valid? ::spec/map playmap)))

(deftest test-fn-spec
  (let [_ (data/getTerrain {:map playmap} [0 0])
        _ (data/moveCost {:map playmap} unitA [0 0] [0 1])
        _ (data/getWeaponRange nil unitA weapon)
        _ (data/getWeaponType nil unitA weapon)
        _ (data/getWeaponSuitability nil unitA weapon)
        _ (data/getWeaponInfo nil unitA weapon)
        _ (data/invalidWeapon? nil unitA weapon)]))

(deftest test-async
  (testing "the API is awesome 2"
    (async done
           (is (= 0 0))
           (done))))

(defmethod cljs.test/report [:cljs.test/default :end-run-tests] [m]
  (if (cljs.test/successful? m)
    (println "Success!")
    (println "FAIL")))