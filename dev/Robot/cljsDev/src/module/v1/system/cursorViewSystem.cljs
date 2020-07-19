(ns module.v1.system.cursorViewSystem
  (:require [clojure.spec.alpha :as s])
  (:require [module.v1.system.spec :as spec]
            [module.v1.common :as common]
            [module.v1.type :as type]
            [tool.units]))


(defn handleCursorView [gameplayCtx [cmd args]]
  (common/assertSpec ::spec/cursorView gameplayCtx)
  (common/assertSpec
   ::spec/cursorView
   (cond
     (= "KEY_DOWN" cmd)
     (let [action (common/actions args)]
       ;(println args)
       (cond
         (#{:up :down :left :right} action)
         (let [{:keys [mapsize]} gameplayCtx]
           (update-in gameplayCtx [:cursor] #(->> (mapv + % (action {:up [0 -1]
                                                                     :down [0 1]
                                                                     :left [-1 0]
                                                                     :right [1 0]}))
                                                  (mapv min (map dec mapsize))
                                                  (mapv max [0 0]))))
         (#{:L :R} action)
         (let [{:keys [cursor units]} gameplayCtx
               ourUnits (cond->> (tool.units/getAll units)
                          true
                          (filter (fn [unit]
                                    (common/assertSpec ::type/unit unit)
                                    (and (= (-> unit :playerKey) :player)
                                         (not (-> unit :robotState :tags :done)))))

                          (= action :L)
                          reverse)
               ; 如果遊標指在己方未行動的機體上
               isSelfUnitAtCursor (and (tool.units/getByPosition units cursor)
                                       (= (-> (tool.units/getByPosition units cursor) :playerKey) :player)
                                       (not (-> (tool.units/getByPosition units cursor) :robotState :tags :done)))
               nextUnit (common/assertSpec
                         (s/nilable ::type/unit)
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
           gameplayCtx)

         :else
         gameplayCtx))

     :else
     gameplayCtx)))