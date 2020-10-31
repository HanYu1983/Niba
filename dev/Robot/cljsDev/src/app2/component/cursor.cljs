(ns app2.component.cursor
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.tool.const :refer [*test search-position]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]))


(defn handle-cursor-component [gameplayCtx [cmd args]]
  (go
    (try
      (s/assert ::app2.tool.view-spec/cursor-component gameplayCtx)
      (cond
        (= :on-click cmd)
        (cond
          (#{"w" "s" "a" "d"} args)
          (let [{:keys [mapsize]} gameplayCtx
                gameplayCtx (update gameplayCtx :cursor #(->> (m/add % (get {"w" [0 -1]
                                                                             "s" [0 1]
                                                                             "a" [-1 0]
                                                                             "d" [1 0]}
                                                                            args))
                                                              (mapv min (map dec mapsize))
                                                              (mapv max [0 0])))]
            [gameplayCtx nil])

          (#{"q" "e"} args)
          (let [{:keys [cursor units]} gameplayCtx
                ourUnits (s/assert
                          (s/coll-of ::gameplay-spec/robot)
                          (cond->> (vals units)
                            true
                            (filter (fn [unit]
                                      (and (= (-> unit :playerKey) :player)
                                           (not (-> unit :robotState :tags :done)))))

                            (= "q" args)
                            reverse))

                unitAtCursor (search-position units cursor)
               ; 如果遊標指在己方未行動的機體上
                isSelfUnitAtCursor (and unitAtCursor
                                        (= (-> unitAtCursor :playerKey) :player)
                                        (not (-> unitAtCursor :robotState :tags :done)))
                nextUnit (s/assert
                          (s/nilable ::gameplay-spec/robot)
                          (cond->> ourUnits
                            isSelfUnitAtCursor
                            (drop-while (fn [unit]
                                          (not= (-> unit :position) cursor)))

                            true
                            ((fn [list]
                              ; 剩一個代表剩下自己
                               (if (= 1 (count list))
                                ; 循環. 從頭取
                                 (first ourUnits)
                                ; 跳過自己, 取下一個
                                 (second list))))))
                gameplayCtx (if nextUnit
                              (update gameplayCtx :cursor (constantly (-> nextUnit :position)))
                              gameplayCtx)]
            [gameplayCtx nil])

          :else
          [gameplayCtx nil])

        :else
        [gameplayCtx nil])
      (catch js/Error e
        [gameplayCtx e]))))