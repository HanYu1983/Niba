(ns app2.component.battle-menu
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go]]
            [app2.data.data :refer [getUnitHitRate thinkReaction]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [app2.tool.battleMenu :refer [setLeftAction setRightActionFromReaction]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect]]))

(defn handle-battle-menu [ctx unit [cmd args]]
  (go
    (try
      (s/assert ::view-spec/cursor-component ctx)
      (s/assert ::view-spec/battle-menu-component ctx)
      (s/assert ::view-spec/unit-menu-component (:unit-menu-component ctx))
      (s/assert ::gameplay-spec/robot unit)
      (cond
        (= :on-click cmd)
        (let [playerTurn? (-> ctx :active-player-key (= :player))
              handleWeaponView (fn [ctx]
                                 (let [{:keys [menu-cursor menu-cursor-data]} (-> ctx :unit-menu-component)
                                       battle-menu (:battle-menu-component ctx)
                                       {:keys [weapons weaponIdx]} menu-cursor-data
                                       cursor1 (getCursor1 menu-cursor)
                                       cursor2 (getCursor2 menu-cursor)
                                       ; 選到武器時, 更新面板
                                       battle-menu (if (= cursor1 weaponIdx)
                                                     (let [weapon (nth weapons cursor2)]
                                                       (cond-> battle-menu
                                                         true
                                                         (setLeftAction [:attack weapon] ctx getUnitHitRate)
                                                         ; 我方回合並選到武器時, 更新敵方的反應動作
                                                         playerTurn?
                                                         (setRightActionFromReaction ctx getUnitHitRate thinkReaction)))
                                                     battle-menu)
                                       ctx (assoc ctx :battle-menu-component battle-menu)]
                                   ctx))]
          (cond
            ; 處理敵人回合的選單移動
            (and (not playerTurn?)
                 (#{"w" "s"} args))
            (let [{:keys [menu-cursor menu-cursor-data]} (-> ctx :unit-menu-component)
                  battle-menu (:battle-menu-component ctx)
                  cursor1 (getCursor1 menu-cursor)
                  {:keys [weaponIdx]} menu-cursor-data
                  select (getSelect menu-cursor)
                  {rightUnit :unit [_ rightWeapon] :action} (get battle-menu 1)
                  ; 如果選到evade
                  hitRate (cond-> (getUnitHitRate ctx rightUnit rightWeapon unit)
                            (= "evade" select)
                            (/ 2))
                  ; 更新命中率和武器面板
                  battle-menu (cond-> (update-in battle-menu [1 :hitRate] (constantly hitRate))
                                (#{"evade" "guard"} select)
                                (update-in [0 :action] (constantly [(keyword select)])))
                  _ (s/assert ::view-spec/battle-menu-component battle-menu)
                  ; 套用
                  ctx (assoc ctx :battle-menu-component battle-menu)
                  ; 上下移動時也會選到武器
                  ctx (if (= cursor1 weaponIdx)
                        (handleWeaponView ctx)
                        ctx)]
              [ctx nil])

            (#{"a" "d"} args)
            [(handleWeaponView ctx) nil]

            :else
            [ctx nil]))

        :else
        [ctx nil])
      (catch js/Error err
        [ctx err]))))