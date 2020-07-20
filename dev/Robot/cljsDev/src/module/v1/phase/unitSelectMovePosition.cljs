(ns module.v1.phase.unitSelectMovePosition
  (:require [clojure.spec.alpha :as s])
  (:require [clojure.core.async :as a])
  (:require-macros [module.v1.core :as core])
  (:require [tool.menuCursor])
  (:require [tool.fsm])
  (:require [tool.units])
  (:require [tool.map])
  (:require [module.v1.data :as data])
  (:require [module.v1.type :as type])
  (:require [module.v1.common :as common])
  (:require-macros [module.v1.phase.unitMenuImpl])
  (:require [module.v1.system.spec :as spec])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem])
  (:require [module.v1.system.cursorViewSystem :as cursorViewSystem])
  (:require [module.v1.system.moveRangeViewSystem :as moveRangeViewSystem])
  (:require [module.v1.system.attackRangeViewSystem :as attackRangeViewSystem])
  (:require [module.v1.system.hitRateViewSystem :as hitRateViewSystem])
  (:require [module.v1.system.battleMenuViewSystem :as battleMenuViewSystem])
  (:require [module.v1.system.menuCursorViewSystem :as menuCursorViewSystem])
  (:require [module.v1.phase.unitSelectSingleTarget :refer [unitSelectSingleTarget]])
  (:require [module.v1.phase.unitSelectAttackPosition :refer [unitSelectAttackPosition]])
  (:require [module.v1.step.selectPosition :refer [selectPosition]])
  (:require [module.v1.system.mapViewSystem :as mapViewSystem]))

(declare unitMenu)

(core/defstate unitSelectMovePosition {unit :unit paths :paths}
  {:nameCtx gameplayCtx
   :initState
   {:tempMoveRange (let [moveRange (map first paths)]
                     moveRange)}
   :initCtx nil}
  (loop [gameplayCtx gameplayCtx]
    (let [gameplayCtx (assoc gameplayCtx :moveRange (-> gameplayCtx :fsm tool.fsm/load :tempMoveRange))
          _ (a/<! (common/paint nil (data/render gameplayCtx) inputCh outputCh))
          [gameplayCtx result] (a/<! (selectPosition gameplayCtx {} inputCh outputCh))]
      (cond
        (false? result)
        [gameplayCtx false]

        (true? result)
        (let [{:keys [cursor camera]} gameplayCtx
              path (tool.map/buildPath paths cursor)]
          (if (> (count path) 1)
            (let [unitAtCursor (common/assertSpec
                                (s/nilable ::type/unit)
                                (-> (:units gameplayCtx)
                                    (tool.units/getByPosition cursor)))
                  [unitSpecAtCursor] (if unitAtCursor
                                       (s/conform ::type/unit unitAtCursor)
                                       [nil])]
              (cond
                (and unitAtCursor (= :robot unitSpecAtCursor))
                (recur gameplayCtx)

                ; 如果是空位或是箱子
                (or (not unitAtCursor) (= :item unitSpecAtCursor))
                (let [_ (a/<! (common/unitMoveAnim nil {:unit (->> (data/getUnitInfo {:gameplayCtx gameplayCtx :lobbyCtx (:lobbyCtx gameplayCtx)} unit)
                                                                   (data/mapUnitToLocal gameplayCtx nil)) :path (map (partial data/world2local camera) path)} inputCh outputCh))
                      ; 若是箱子要先移除才能移動機體
                      gameplayCtx (if (= :item unitSpecAtCursor)
                                    (update gameplayCtx :units (fn [units]
                                                                 (tool.units/delete units unitAtCursor)))
                                    gameplayCtx)

                      ; 將移動後的機體暫存, 用來回復操作
                      tempUnit (data/onUnitMove gameplayCtx unit cursor)
                      state (-> gameplayCtx :fsm tool.fsm/load)
                      state (merge state {:tempUnit tempUnit})
                      ; 套用移動後的機體
                      gameplayCtx (-> gameplayCtx
                                      (data/updateUnit unit (constantly tempUnit))
                                      (update :fsm #(tool.fsm/save % state)))
                      [gameplayCtx isEnd] (a/<! (unitMenu gameplayCtx {:unit tempUnit} inputCh outputCh))]
                  (if isEnd
                    (let [; 結束操作時才判斷是否踩到箱子
                          ; 取得獎勵
                          gameplayCtx (if (= :item unitSpecAtCursor)
                                        (let [_ (a/<! (common/showMessage nil {:message (str "you got item")} inputCh outputCh))
                                              gameplayCtx (data/onGameplayUnitGetItemAward gameplayCtx unit unitAtCursor)]
                                          gameplayCtx)
                                        gameplayCtx)]
                      [gameplayCtx true])
                    (let [; 將箱子回復原狀
                          gameplayCtx (if (= :item unitSpecAtCursor)
                                        (update gameplayCtx :units (fn [units]
                                                                     (tool.units/add units unitAtCursor)))
                                        gameplayCtx)
                          ; 將機體回復原樣
                          tempUnit (:tempUnit state)
                          gameplayCtx (data/updateUnit gameplayCtx tempUnit (constantly unit))]
                      (recur gameplayCtx))))

                :else
                (throw (js/Error. "can not reach here. please check."))))
            (recur gameplayCtx)))

        :else
        (recur gameplayCtx)))))

(module.v1.phase.unitMenuImpl/impl)