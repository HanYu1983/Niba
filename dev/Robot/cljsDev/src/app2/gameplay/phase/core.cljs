(ns app2.gameplay.phase.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]
            [app2.data.data :refer [invalidWeapon? getWeaponType unitOnTransform updateUnit getUnitWeaponRange isFriendlyUnit getUnitInfo mapUnitToLocal getUnitHitRate thinkReaction]]
            [app2.component.camera :refer [handle-camera-component]]
            [app2.component.cursor :refer [handle-cursor-component]]
            [app2.component.debug :refer [handle-debug]]
            [app2.component.move-range :refer [handle-move-range-component]]
            [app2.component.attack-range :refer [handle-attack-range-component]]
            [app2.component.battle-menu :refer [handle-battle-menu]]
            [app2.gameplay.phase.step.core :refer [menu-step select-position-step]]
            [app2.gameplay.phase.hook.core :refer [create-system-menu-component create-unit-menu-component]]
            [app2.gameplay.phase.hook.animation :refer [animate-player-turn-start alert animate-targeting-aim]]
            [app2.tool.const :refer [*test search-position]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [app2.tool.battleMenu :as battleMenu]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))


(defasync unit-battle-menu-phase [ctx any?, args (s/keys :req-un [::view-spec/battle-menu-component]), input-ch any?] [ctx nil] any?
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
                         (handle-attack-range-component evt :unit-menu-component left)
                         (handle-battle-menu evt left))]
        (if false
          [(dissoc ctx :battle-menu-component) nil]
          (recur ctx))))))

(defasync unit-select-single-target [ctx ::gameplay-spec/gameplayCtx, args (s/keys :req-un [::gameplay-spec/unit ::gameplay-spec/weapon]), input-ch any?] [ctx err] (s/tuple ::gameplay-spec/gameplayCtx any?)
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