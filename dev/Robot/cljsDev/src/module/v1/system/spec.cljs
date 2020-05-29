(ns module.v1.system.spec
  (:require [clojure.spec.alpha :as s])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.session.battleMenu :as battleMenu]))

(s/def ::position (s/tuple int? int?))
(s/def ::positions (s/coll-of ::position))
(s/def ::moveRange ::positions)
(s/def ::menu ::tool.menuCursor/menu)
(s/def ::menuCursorData (s/keys :opt-un [::weaponIdx ::transformIdx]))
(s/def ::menuCursor ::tool.menuCursor/model)
(s/def ::fsm ::tool.fsm/model)
(s/def ::map (s/coll-of vector?))
(s/def ::camera ::position)
(s/def ::cursor ::position)
(s/def ::viewsize (s/tuple int? int?))
(s/def ::mapsize (s/tuple int? int?))
(s/def ::mapView (s/keys :req-un [::map ::camera ::viewsize]))
(s/def ::cursorView (s/keys :req-un [::cursor ::camera ::mapsize]))
(s/def ::unitsView (s/keys :req-un [::units ::camera ::viewsize]))
(s/def ::moveRangeView (s/keys :req-un [::units ::moveRange ::camera]))
(s/def ::attackRangeView (s/keys :req-un [::attackRange ::camera]))
(s/def ::systemMenuView (fn [ctx]
                          (let [fsm (:fsm ctx)
                                state (tool.fsm/currState fsm)
                                {:keys [data menuCursor]} (tool.fsm/load fsm)]
                            (and (s/valid? ::fsm fsm)
                                 (s/valid? #{:menu} state)
                                 (s/valid? (s/tuple ::menuCursorData ::menuCursor) [data menuCursor])))))
(s/def ::unitMenuView (fn [ctx]
                        (let [fsm (:fsm ctx)
                              state (tool.fsm/currState fsm)
                              {:keys [unit data menuCursor]} (tool.fsm/load fsm)]
                          (and (s/valid? ::fsm fsm)
                               (s/valid? #{:unitMenu :unitBattleMenu} state)
                               (s/valid? (s/tuple ::unit ::menuCursorData ::menuCursor) [unit data menuCursor])))))
(s/def ::battleMenuView (fn [ctx]
                          (let [fsm (:fsm ctx)
                                state (tool.fsm/currState fsm)
                                {:keys [battleMenuSession]} (tool.fsm/load fsm)]
                            (and (s/valid? ::fsm fsm)
                                 (s/valid? #{:unitBattleMenu} state)
                                 (s/valid? (s/tuple ::battleMenu/defaultModel) [battleMenuSession])))))
(s/def ::startUnitsMenuView (fn [ctx]
                              (let [fsm (:fsm ctx)
                                    {:keys [units selectedUnits cursor]} (tool.fsm/load fsm)]
                                (and (s/valid? (s/coll-of (s/tuple keyword? keyword?)) units)
                                     (s/valid? (s/and set? (s/coll-of keyword?)) selectedUnits)
                                     (s/valid? int? cursor)))))
(s/def ::menuCursorView (fn [ctx]
                          (let [fsm (:fsm ctx)
                                {:keys [menuCursor]} (tool.fsm/load fsm)]
                            (and (s/valid? ::fsm fsm)
                                 (s/valid? (s/tuple ::menuCursor) [menuCursor])))))