(ns app2.component.cursor
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]
            [clojure.core.matrix :as m]
            [clojure.core.match :refer [match]]
            [app2.tool.const :refer [*test sync-indexed-position atom-indexed-position-unit]])
  (:require [app2.tool.gameplay-spec :as gameplay-spec]))


(defn handle-cursor-component [gameplayCtx [cmd args]]
  (go
    (try
      (s/assert ::app2.tool.gameplay-spec/cursor-component gameplayCtx)
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

                indexed-position-units (sync-indexed-position units @atom-indexed-position-unit)
                _ (reset! atom-indexed-position-unit indexed-position-units)

                unitAtCursor (indexed-position-units cursor)
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

#_(defn handle-cursor-component2 [ctx evt]
  (go
    (try
      (s/assert ::app2.tool.gameplay-spec/cursor-component ctx)
      (cond
        (= [:on-click "w"] evt)
        [(update ctx :cursor #(m/add % [0 -1])) nil]

        (= [:on-click "s"] evt)
        [(update ctx :cursor #(m/add % [0 1])) nil]

        (= [:on-click "a"] evt)
        [(update ctx :cursor #(m/add % [-1 0])) nil]

        (= [:on-click "d"] evt)
        [(update ctx :cursor #(m/add % [1 0])) nil]
        
        

        (and (:units ctx)
             (= [:on-click "q"] evt))
        [ctx nil]

        :else
        [ctx nil])
      (catch js/Error e
        [ctx e]))))