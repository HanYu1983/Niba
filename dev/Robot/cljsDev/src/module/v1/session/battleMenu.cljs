(ns module.v1.session.battleMenu
  (:require [clojure.spec.alpha :as s]))

(s/def ::hitRate number?)
(s/def ::action (s/or :pending (s/tuple #{:pending})
                      :attack (s/tuple #{:attack} (constantly true))
                      :evade (s/tuple #{:evade})))
(s/def ::unitAndAction (s/keys :req-un [::unit ::action] :opt-un [::hitRate]))
(s/def ::defaultModel (s/tuple ::unitAndAction ::unitAndAction))

(def defaultModel [{:unit nil :action [:pending]}
                   {:unit nil :action [:pending]}])

(s/explain ::defaultModel defaultModel)

(defn setUnits [ctx left right]
  (-> ctx
      (update-in [0 :unit] (constantly left))
      (update-in [1 :unit] (constantly right))))

(defn setLeftAction [ctx action gameplayCtx hitRateFn]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType weapon] action
          [rightActionType _] (get-in ctx [1 :action])]
      (condp = actionType
        :attack
        (-> ctx
            (update-in [0 :action] (constantly action))
            (update-in [0 :hitRate] (constantly (cond-> (hitRateFn gameplayCtx left weapon right)
                                                  (= rightActionType :evade)
                                                  (/ 2)))))

        (-> ctx
            (update-in [0 :action] (constantly action))
            (update-in [0 :hitRate] (constantly 0)))))))


(defn setRightAction [ctx action gameplayCtx hitRateFn]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)]
    (let [[actionType weapon] action
          [leftActionType _] (get-in ctx [0 :action])]
      (condp = actionType
        :attack
        (-> ctx
            (update-in [1 :action] (constantly action))
            (update-in [1 :hitRate] (constantly (cond-> (hitRateFn gameplayCtx right weapon left)
                                                  (= leftActionType :evade)
                                                  (/ 2)))))

        (-> ctx
            (update-in [1 :action] (constantly action))
            (update-in [1 :hitRate] (constantly 0)))))))

(defn setRightActionFromReaction [ctx gameplayCtx hitRateFn thinkReactionFn]
  (let [left (get-in ctx [0 :unit] ctx)
        right (get-in ctx [1 :unit] ctx)
        [leftActionType leftWeapon] (get-in ctx [0 :action] ctx)]
    (-> ctx
        (setRightAction (thinkReactionFn gameplayCtx right left leftWeapon) gameplayCtx hitRateFn)
        ; 更新左方數值
        (setLeftAction (get-in ctx [0 :action]) gameplayCtx hitRateFn))))

(defn mapUnits [ctx f]
  (-> ctx
      (update-in [0 :unit] f)
      (update-in [1 :unit] f)))