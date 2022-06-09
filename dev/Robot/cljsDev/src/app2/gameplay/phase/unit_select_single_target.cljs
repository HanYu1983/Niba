(ns app2.gameplay.phase.unit-select-single-target
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
            [app2.gameplay.phase.unit-battle-menu :refer [unit-battle-menu-phase]]
            [app2.tool.const :refer [*test search-position]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [app2.tool.battleMenu :as battleMenu]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]]
            [tool.async :refer [async-reduce]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

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