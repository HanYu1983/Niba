(ns module.default.session.battleMenu
  (:require [module.default.data]))

(def defaultModel [{:unit nil :action [:pending]}
                   {:unit nil :action [:pending]}])

(defn setUnits [ctx left right]
  (-> ctx
      (update-in [0 :unit] (constantly left))
      (update-in [1 :unit] (constantly right))))

(defn setLeftAction [ctx action gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType weapon] action
          [rightActionType _] (get-in ctx [1 :action])]
      (condp = actionType
        :attack
        (-> ctx
            (update-in [0 :action] (constantly action))
            (update-in [0 :hitRate] (constantly (cond-> (module.default.data/getUnitHitRate gameplayCtx left weapon right)
                                                  (= rightActionType :evade)
                                                  (/ 2)))))

        (-> ctx
            (update-in [0 :action] (constantly action))
            (update-in [0 :hitRate] (constantly 0)))))))

(defn setRightAction [ctx action gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType weapon] action
          [leftActionType _] (get-in ctx [0 :action])]
      (condp = actionType
        :attack
        (-> ctx
            (update-in [1 :action] (constantly action))
            (update-in [1 :hitRate] (constantly (cond-> (module.default.data/getUnitHitRate gameplayCtx right weapon left)
                                                  (= leftActionType :evade)
                                                  (/ 2)))))

        (-> ctx
            (update-in [1 :action] (constantly action))
            (update-in [1 :hitRate] (constantly 0)))))))

(defn setRightActionFromReaction [ctx gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)
        [leftActionType leftWeapon] (get-in ctx [0 :action] ctx)]
    (-> ctx
        (setRightAction (module.default.data/thinkReaction gameplayCtx right left leftWeapon) gameplayCtx)
        ; 更新左方數值
        (setLeftAction (get-in ctx [0 :action]) gameplayCtx))))

(defn mapUnits [ctx f]
  (-> ctx
      (update-in [0 :unit] f)
      (update-in [1 :unit] f)))