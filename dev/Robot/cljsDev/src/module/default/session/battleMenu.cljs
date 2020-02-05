(ns module.default.session.battleMenu
  (:require [module.default.dataalg.data]))

(def defaultModel [{:unit nil :action [:pending]}
                   {:unit nil :action [:pending]}])

(defn setUnits [ctx left right]
  (-> ctx
      (update-in [0 :unit] (constantly left))
      (update-in [1 :unit] (constantly right))))

(defn setLeftAction [ctx action gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType args] action]
      (condp = actionType
        :attack
        (let [weapon args]
          (-> ctx
              (update-in [0 :action] (constantly action))
              (update-in [0 :hitRate] (constantly (module.default.dataalg.data/getUnitHitRate gameplayCtx left weapon right)))))

        (-> ctx
            (update-in [0 :action] (constantly action))
            (update-in [0 :hitRate] (constantly 0)))))))

(defn setRightAction [ctx action gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType args] action]
      (condp = actionType
        :attack
        (let [weapon args]
          (-> ctx
              (update-in [1 :action] (constantly action))
              (update-in [1 :hitRate] (constantly (module.default.dataalg.data/getUnitHitRate gameplayCtx right weapon left)))))

        (-> ctx
            (update-in [1 :action] (constantly action))
            (update-in [1 :hitRate] (constantly 0)))))))

(defn setRightActionFromReaction [ctx gameplayCtx]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)
        [leftActionType leftWeapon] (get-in ctx [0 :action] ctx)]
    (setRightAction ctx (module.default.dataalg.data/thinkReaction gameplayCtx right left leftWeapon) gameplayCtx)))

(defn mapUnits [ctx f]
  (-> ctx
      (update-in [0 :unit] f)
      (update-in [1 :unit] f)))