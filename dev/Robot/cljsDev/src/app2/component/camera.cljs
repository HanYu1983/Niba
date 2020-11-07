(ns app2.component.camera
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.tool.const :refer [*test search-position]])
  (:require [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]))


(defn handle-camera-component [gameplayCtx [cmd args]]
  (println "handle-camera-component")
  (go
    (try
      (s/assert ::app2.tool.view-spec/camera-component gameplayCtx)
      (cond
        (= :on-click cmd)
        (cond
          (#{"up" "down" "left" "right"} args)
          (let [{:keys [mapsize viewsize]} gameplayCtx
                gameplayCtx (update gameplayCtx :camera #(->> (m/add % (get {"up" [0 -1]
                                                                             "down" [0 1]
                                                                             "left" [-1 0]
                                                                             "right" [1 0]}
                                                                            args))
                                                              (mapv min (map - mapsize viewsize))
                                                              (mapv max [0 0])))]
            [gameplayCtx nil])

          :else
          [gameplayCtx nil])

        :else
        [gameplayCtx nil])
      (catch js/Error e
        [gameplayCtx e]))))