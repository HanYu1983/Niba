(ns module.v1.system.core
  (:require [clojure.core.async :as a])
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.type :as type]))

(defn mapReturn [f & [gameplayCtx :as args]]
  (let [conform (s/conform ::type/returnCtx gameplayCtx)]
    (if (= ::s/invalid conform)
      (throw (js/Error. (s/explain-str ::type/returnCtx gameplayCtx)))
      (let [[returnType _] conform]
        (condp = returnType
          :return gameplayCtx
          (apply f args))))))

(defn asyncMapReturn [f & [gameplayCtx :as args]]
  (a/go
    (let [conform (s/conform ::type/returnCtx gameplayCtx)]
      (if (= ::s/invalid conform)
        (throw (js/Error. (s/explain-str ::type/returnCtx gameplayCtx)))
        (let [[returnType _] conform]
          (condp = returnType
            :return gameplayCtx
            (a/<! (apply f args))))))))