(ns app2.gameplay.phase.core
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


(defasync unit-battle-menu-phase [ctx any?, args (s/keys :req-un [::view-spec/battle-menu-component]), input-ch any?] [ctx false err] any?
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
            ctx (cond
                  (= "space" args)
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
                                                                                             (data/mapUnitToLocal ctx nil)) (cond-> [left right]
                                                                                                                              fixRight? reverse))
                                                                           :unitsAfter (map #(->> (data/getUnitInfo {:gameplayCtx ctx :lobbyCtx (:lobbyCtx ctx)} %)
                                                                                                  (data/mapUnitToLocal ctx nil)) (cond-> [leftAfter rightAfter]
                                                                                                                                   fixRight? reverse))
                                                                           :results (cond-> result fixRight? reverse)}))
                                                ctx (-> ctx
                                                        (data/updateUnit left (constantly leftAfter))
                                                        (data/updateUnit right (constantly rightAfter)))
                                         ; 進攻方死亡
                                                ctx (s/assert
                                                     ::gameplay-spec/gameplayCtx
                                                     (if (data/isUnitDead? ctx leftAfter)
                                                       (let [ctx (<! (data/onGameplayUnitDead ctx leftAfter input-ch))]
                                                         ctx)
                                                       ctx))
                                         ; 防守方死亡
                                                ctx (s/assert
                                                     ::gameplay-spec/gameplayCtx
                                                     (if (data/isUnitDead? ctx rightAfter)
                                                       (let [ctx (<! (data/onGameplayUnitDead ctx rightAfter input-ch))]
                                                         ctx)
                                                       ctx))
                                                ctx (dissoc ctx :attackRange :checkHitRate)]
                                            ctx))))]
                    (cond
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
                            (<! (alert nil {:message invalidWeaponMsg}))
                            ctx)

                          (not isTargetInRange)
                          (do
                            (<! (alert nil {:message (str "不在範圍內")}))
                            ctx)

                          :else
                          (let [leftAction (get-in battle-menu-component [0 :action])
                                rightAction (get-in battle-menu-component [1 :action])
                                ctx (<! (handleBattle ctx leftAction rightAction))]
                            [ctx true])))

                      (#{"guard" "evade"} select)
                      (let [leftAction [(keyword select)]
                            rightAction (get-in battle-menu-component [1 :action])
                            ctx (<! (handleBattle ctx leftAction rightAction))]
                        [ctx true])

                      (= "cancel" select)
                      [ctx false]

                      :else
                      ctx))

                  :else
                  ctx)]
        (if false
          [(dissoc ctx :battle-menu-component) true nil]
          (recur ctx))))))

(defasync unit-select-single-target [ctx ::gameplay-spec/gameplayCtx, args (s/keys :req-un [::gameplay-spec/unit ::gameplay-spec/weapon]), input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (println "unit-select-single-target")
  (loop [ctx ctx]
    (let [{:keys [unit weapon]} args
          [ctx cursor err] (<! (select-position-step ctx input-ch))
          _ (when err (throw err))
          unitAtCursor (search-position (:units ctx) cursor)
          [ctx done? err] (if unitAtCursor
                            (let [weaponRange (into #{} (getUnitWeaponRange ctx unit weapon))
                                  unitInRange? (weaponRange cursor)
                                  friendlyUnit? (isFriendlyUnit ctx unit unitAtCursor)
                                  invalidWeaponMsg (invalidWeapon? ctx unit weapon nil)]
                              (cond
                                invalidWeaponMsg
                                (do
                                  (<! (alert {:message invalidWeaponMsg}))
                                  [ctx false nil])

                                (not unitInRange?)
                                (do
                                  (<! (alert {:message (str "目標不在範圍內")}))
                                  [ctx false nil])

                                friendlyUnit?
                                (do
                                  (<! (alert {:message (str "請選擇敵方目標")}))
                                  [ctx false nil])

                                :else
                                (let [_ (<! (animate-targeting-aim nil {:units (map #(->> (getUnitInfo {:ctx ctx :lobbyCtx (:lobbyCtx ctx)} %)
                                                                                          (mapUnitToLocal ctx nil)) [unit unitAtCursor])}))
                                      [ctx isEnd err] (<! (unit-battle-menu-phase ctx
                                                                                  {:battle-menu-component (-> battleMenu/defaultModel
                                                                                                              (battleMenu/setUnits unit unitAtCursor)
                                                                                                              (battleMenu/setLeftAction [:attack weapon] ctx getUnitHitRate)
                                                                                                              (battleMenu/setRightActionFromReaction ctx getUnitHitRate thinkReaction))}
                                                                                  input-ch))
                                      _ (println "can not reach here:" err)
                                      _ (when err (throw err))]
                                  (if isEnd
                                    [ctx isEnd nil]
                                    [ctx false nil]))))
                            (do
                              (<! (alert {:message (str "請選擇目標")}))
                              [ctx false nil]))]
      (if (or done? err)
        [ctx err]
        (recur ctx)))))

(declare fixUnitSkyGround)

(defasync unit-menu [ctx ::gameplay-spec/gameplayCtx, unit ::gameplay-spec/unit, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (println "unit-menu")
  (let [[menu-component err] (create-unit-menu-component ctx unit nil)
        _ (when err (throw err))
        ctx (assoc ctx :unit-menu-component menu-component)]
    (loop [ctx ctx]
      (let [[ctx selection err] (<! (menu-step ctx :unit-menu-component unit input-ch))
            _ (when err (throw err))
            [ctx done? err] (if selection
                              (let [cursor1 (-> ctx :unit-menu-component :menu-cursor getCursor1)
                                    cursor2 (-> ctx :unit-menu-component :menu-cursor getCursor2)
                                    {:keys [transform-idx weaponIdx weapons]} (-> ctx :unit-menu-component :menu-cursor-data)
                                    [ctx done? err] (s/assert
                                                     (s/tuple any? boolean? any?)
                                                     (cond
                                                       (= weaponIdx cursor1)
                                                       (let [weapon (s/assert
                                                                     ::gameplay-spec/weaponState
                                                                     (nth weapons cursor2))
                                                             invalidWeaponMsg (invalidWeapon? ctx unit weapon nil)
                                                             weaponType (getWeaponType {:ctx ctx :lobbyCtx (:lobbyCtx ctx)} unit weapon)]
                                                         (cond
                                                           invalidWeaponMsg
                                                           (do
                                                             (<! (alert {:message invalidWeaponMsg}))
                                                             [ctx false nil])

                                                           (= "single" weaponType)
                                                           (let [[ctx err] (<! (unit-select-single-target ctx {:unit unit :weapon weapon} input-ch))]
                                                             (if err
                                                               [ctx false err]
                                                               [ctx false nil]))

                                                           (= "line" weaponType)
                                                           (let [[ctx isEnd err] [ctx false nil]]
                                                             (if (or isEnd err)
                                                               [ctx isEnd err]
                                                               [ctx false nil]))

                                                           :else
                                                           [ctx false nil]))

                                                       (= transform-idx cursor1)
                                                       (let [; 變形
                                                             transformedUnit (unitOnTransform ctx unit (get-in unit [:robotState :robotKey]) selection)
                                                             ; 先畫變形
                                                             ctx (updateUnit ctx unit (constantly transformedUnit))
                                                             unit transformedUnit
                                                             ; 調整到空中或地面並播放動畫
                                                             transformedUnit (<! (fixUnitSkyGround ctx unit input-ch))
                                                             ; 再畫結果
                                                             ctx (updateUnit ctx unit (constantly transformedUnit))]
                                                         [ctx false nil])

                                                       :else
                                                       [ctx false nil]))
                                    _ (when err (throw err))]
                                [ctx done? nil])
                              [ctx true nil])
            _ (when err (throw err))]
        (if done?
          [(dissoc ctx :unit-menu-component) nil]
          (recur ctx))))))

(defasync system-menu [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx false err] (s/tuple ::gameplay-spec/gameplayCtx boolean? any?)
  (let [[menu-component err] (create-system-menu-component ctx)
        _ (when err (throw err))
        ctx (assoc ctx :system-menu-component menu-component)]
    (loop [ctx ctx]
      (let [[ctx selection err] (<! (menu-step ctx :system-menu-component nil input-ch))
            _ (when err (throw err))
            [ctx done? end-turn? err] (s/assert
                                       (s/tuple any? boolean? boolean? any?)
                                       (if selection
                                         (cond
                                           (= "endTurn" selection)
                                           [ctx false true nil]

                                           :else
                                           [ctx false false nil])
                                         [ctx true false nil]))
            _ (when err (throw err))]
        (if (or done? end-turn?)
          [(dissoc ctx :system-menu-component) end-turn? nil]
          (recur ctx))))))

(defasync player-turn [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (<! (animate-player-turn-start ctx))
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-cursor-component evt)
                       (handle-move-range-component true evt)
                       (handle-camera-component evt))
          [ctx end-turn? err] (s/assert
                               (s/tuple any? boolean? any?)
                               (cond
                                 (= [:on-click "space"] evt)
                                 (let [units (:units ctx)
                                       cursor (:cursor ctx)
                                       unitAtCursor (search-position units cursor)
                                       [ctx end-turn? err] (s/assert
                                                            (s/tuple any? boolean? any?)
                                                            (if unitAtCursor
                                                              (let [[ctx err] (<! (unit-menu ctx unitAtCursor input-ch))]
                                                                [ctx false err])
                                                              (<! (system-menu ctx input-ch))))
                                       _ (when err (throw err))]
                                   [ctx end-turn? nil])

                                 :else
                                 [ctx false nil]))
          _ (when err (throw err))]
      (if end-turn?
        [ctx nil]
        (recur ctx)))))

(defasync enemy-trun [ctx ::gameplay-spec/gameplayCtx, player ::gameplay-spec/player, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (<! (animate-player-turn-start ctx))
  (if *test
    (loop [ctx ctx]
      (let [evt (<! input-ch)
            [ctx err] (<! (handle-debug ctx evt))]
        (if err
          [ctx nil]
          (recur ctx))))
    [ctx nil]))

(defasync gameplay-loop [ctx ::gameplay-spec/gameplayCtx, input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
  (loop [ctx ctx]
    (let [ctx (update ctx :active-player-key (constantly :player))
          [ctx err] (<! (player-turn ctx input-ch))
          _ (when err (throw err))
          [ctx end? err] (s/assert
                          (s/tuple any? boolean? any?)
                          (if (:done ctx)
                            [ctx true nil]
                            (<! (async-reduce (fn [[ctx end? err] player]
                                                (go
                                                  (try
                                                    (if (or end? err)
                                                      [ctx end? err]
                                                      (let [ctx (update ctx :active-player-key (constantly (:key player)))
                                                            [ctx err] (<! (enemy-trun ctx player input-ch))
                                                            _ (when err (throw err))
                                                            [ctx end? err] (if (:done ctx)
                                                                             [ctx true nil]
                                                                             [ctx false nil])]
                                                        [ctx end? err]))
                                                    (catch js/Error err
                                                      [ctx false err]))))
                                              [ctx false nil]
                                              (->> (:players ctx)
                                                   vals
                                                   (filter #(not= :player (:key %))))))))
          _ (when err (throw err))]
      (if end?
        [ctx nil]
        (recur ctx)))))