(ns app2.gameplay.phase.unit-battle-menu
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]
            [app2.data.data :as data :refer [invalidWeapon? getWeaponType unitOnTransform updateUnit getUnitWeaponRange isFriendlyUnit getUnitInfo mapUnitToLocal getUnitHitRate thinkReaction]]
            [app2.component.camera :refer [handle-camera-component]]
            [app2.component.cursor :refer [handle-cursor-component]]
            [app2.component.debug :refer [handle-debug]]
            [app2.component.move-range :refer [handle-move-range-component]]
            [app2.component.attack-range :refer [handle-attack-range-component]]
            [app2.component.battle-menu :refer [handle-battle-menu]]
            [app2.component.menu :refer [handle-menu-component]]
            [app2.gameplay.phase.step.core :refer [menu-step select-position-step]]
            [app2.gameplay.phase.hook.core :refer [create-system-menu-component create-unit-menu-component]]
            [app2.gameplay.phase.hook.animation :refer [animate-player-turn-start alert animate-targeting-aim animate-battle]]
            [app2.tool.const :refer [*test search-position]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [app2.tool.battleMenu :as battleMenu]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))


(defasync unit-battle-menu-phase [ctx any?, args (s/keys :req-un [::view-spec/battle-menu-component]), input-ch any?] [ctx false err] (s/tuple ::gameplay-spec/gameplayCtx boolean? any?)
  (println "unit-battle-menu-phase")
  (let [{:keys [battle-menu-component]} args
        [{left :unit leftAction :action} {right :unit}] battle-menu-component
        ; 先打開battle menu才能正確的產生battle的unit menu
        ctx (assoc ctx :battle-menu-component battle-menu-component)
        ; 建立unit menu
        [menu-component err] (create-unit-menu-component ctx left right)
        _ (when err (throw err))
        ctx (assoc ctx :unit-menu-component menu-component)]
    (loop [ctx ctx]
      (let [evt (<! input-ch)
            ctx (async-> ctx
                         (handle-debug evt)
                         (handle-cursor-component evt)
                         (handle-move-range-component true evt)
                         (handle-camera-component evt)
                         (handle-attack-range-component :unit-menu-component left evt)
                         (handle-menu-component :unit-menu-component evt)
                         (handle-battle-menu left evt))
            [ctx done? err] (s/assert
                             (s/tuple ::gameplay-spec/gameplayCtx boolean? any?)
                             (cond
                               (= [:on-click "space"] evt)
                               (let [{:keys [battle-menu-component unit-menu-component]} ctx
                                     [{left :unit} {right :unit}] battle-menu-component
                                     {:keys [menu-cursor menu-cursor-data]} unit-menu-component
                                     {:keys [weaponIdx weapons]} menu-cursor-data
                                     playerTurn? (= :player (-> ctx :active-player-key))
                                     fixRight? (not playerTurn?)
                                     cursor1 (getCursor1 menu-cursor)
                                     select (getSelect menu-cursor)
                                     handleBattle (fn [ctx leftAction rightAction]
                                                    (go
                                                      (s/assert
                                                       ::gameplay-spec/gameplayCtx
                                                       (let [result (s/assert
                                                                     ::data/actionResult
                                                                     (if fixRight?
                                                                       (->> (data/calcActionResult ctx right rightAction left leftAction)
                                                                            reverse
                                                                            (into []))
                                                                       (data/calcActionResult ctx left leftAction right rightAction)))
                                                             [leftAfter rightAfter] (data/applyActionResult ctx left leftAction right rightAction result)
                                                             _ (<! (animate-battle nil {:units (map #(->> (data/getUnitInfo {:gameplayCtx ctx :lobbyCtx (:lobbyCtx ctx)} %)
                                                                                                          (data/mapUnitToLocal ctx nil))
                                                                                                    (cond-> [left right]
                                                                                                      fixRight? reverse))
                                                                                        :unitsAfter (map #(->> (data/getUnitInfo {:gameplayCtx ctx :lobbyCtx (:lobbyCtx ctx)} %)
                                                                                                               (data/mapUnitToLocal ctx nil))
                                                                                                         (cond-> [leftAfter rightAfter]
                                                                                                           fixRight? reverse))
                                                                                        :results (cond-> result fixRight? reverse)}))
                                                             ctx (-> ctx
                                                                     (data/updateUnit left (constantly leftAfter))
                                                                     (data/updateUnit right (constantly rightAfter)))
                                                             ; 進攻方死亡
                                                             ctx (s/assert
                                                                  ::gameplay-spec/gameplayCtx
                                                                  (if (data/isUnitDead? ctx leftAfter)
                                                                    (let [ctx (<! (data/onGameplayUnitDead ctx leftAfter))]
                                                                      ctx)
                                                                    ctx))
                                                             ; 防守方死亡
                                                             ctx (s/assert
                                                                  ::gameplay-spec/gameplayCtx
                                                                  (if (data/isUnitDead? ctx rightAfter)
                                                                    (let [ctx (<! (data/onGameplayUnitDead ctx rightAfter))]
                                                                      ctx)
                                                                    ctx))
                                                             ctx (dissoc ctx :attackRange :checkHitRate)]
                                                         ctx))))
                                     [ctx done? err] (cond
                                                       (= cursor1 weaponIdx)
                                                       (let [cursor2 (tool.menuCursor/getCursor2 menu-cursor)
                                                             weapon (s/assert
                                                                     ; 先假設weapons的size一定大於零, 若沒有武器可用, 應該不能出現武器選單
                                                                     ::gameplay-spec/weaponState
                                                                     (nth weapons cursor2))
                                                             attackRange (data/getUnitWeaponRange ctx left weapon)
                                                             isTargetInRange (some #(= (:position right) %) attackRange)
                                                             invalidWeaponMsg (data/invalidWeapon? ctx left weapon right)]
                                                         (cond
                                                           invalidWeaponMsg
                                                           (do
                                                             (<! (alert {:message invalidWeaponMsg}))
                                                             [ctx false nil])

                                                           (not isTargetInRange)
                                                           (do
                                                             (<! (alert {:message (str "不在範圍內")}))
                                                             [ctx false nil])

                                                           :else
                                                           (let [leftAction (get-in battle-menu-component [0 :action])
                                                                 rightAction (get-in battle-menu-component [1 :action])
                                                                 ctx (<! (handleBattle ctx leftAction rightAction))]
                                                             [ctx true nil])))

                                                       (#{"guard" "evade"} select)
                                                       (let [leftAction [(keyword select)]
                                                             rightAction (get-in battle-menu-component [1 :action])
                                                             ctx (<! (handleBattle ctx leftAction rightAction))]
                                                         [ctx true nil])

                                                       (= "cancel" select)
                                                       [ctx true nil]

                                                       :else
                                                       [ctx false nil])]
                                 [ctx done? err])

                               :else
                               [ctx false nil]))
            _ (when err (throw err))]
        (if done?
          [(dissoc ctx :battle-menu-component) true nil]
          (recur ctx))))))