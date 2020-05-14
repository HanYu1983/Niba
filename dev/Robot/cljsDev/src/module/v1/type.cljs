(ns module.v1.type
  (:require [clojure.spec.alpha :as s])
  (:require [tool.units])
  (:require [tool.fsm])
  (:require [tool.menuCursor])
  (:require [module.v1.session.battleMenu :as battleMenu]))

(defn explainValid? [sp args]
  (if (clojure.spec.alpha/valid? sp args)
    true
    (do (println (clojure.spec.alpha/explain-str sp args))
        (println args)
        false)))

(defn assertSpec [sp args]
  (when true
    (when (not (clojure.spec.alpha/valid? sp args))
      (println (clojure.spec.alpha/explain-str sp args))
      (println args)
      (throw (js/Error. (str "error"))))))

(s/def ::key keyword?)
(s/def ::position (s/tuple int? int?))
(s/def ::positions (s/coll-of ::position))
(s/def ::hp int?)
(s/def ::en int?)

(s/def ::map (s/coll-of vector?))
(s/def ::camera ::position)
(s/def ::cursor ::position)
(s/def ::viewsize (s/tuple int? int?))
(s/def ::mapsize (s/tuple int? int?))

(s/def ::player (s/keys :req-un [::faction]))
(s/def ::players (s/map-of keyword? ::player))

(s/def ::tags (s/map-of keyword? (constantly true)))

(s/def ::bulletCount int?)
(s/def ::weaponLevel int?)
(s/def ::weaponKey ::key)
(s/def ::weapon (s/keys :req-un [::key ::weaponKey ::weaponLevel ::tags ::bulletCount]
                        :opt-un [::range ::type ::suitability]))

(s/def ::component (s/keys :req-un [::key ::componentKey ::tags]))

(s/def ::playerKey ::key)
(s/def ::robotKey ::key)
(s/def ::pilotKey ::key)

(s/def ::weaponEntry (s/tuple keyword? (s/* ::weapon)))
(s/def ::componentEntry (s/tuple keyword? (s/* ::component)))
(s/def ::weapons (s/map-of keyword? (s/* ::weapon)))
(s/def ::components (s/map-of keyword? (s/* ::component)))

(s/def ::robotState (s/keys :req-un [::robotKey ::pilotKey ::weapons ::components ::tags ::hp ::en]))
(s/def ::robot (s/keys :req-un [::key ::position ::playerKey ::robotState]))

(s/def ::itemState (s/keys :req-un [::itemKey]))
(s/def ::item (s/keys :req-un [::key ::position ::itemState]))

(s/def ::unit (s/or :robot ::robot 
                    :item ::item))

(s/def ::units tool.units/modelType)


(s/def ::moveRange ::positions)

(s/def ::menu ::tool.menuCursor/menu)
(s/def ::menuCursorData (s/keys :opt-un [::weaponIdx ::transformIdx]))
(s/def ::menuCursor ::tool.menuCursor/model)

(s/def ::fsm ::tool.fsm/model)


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
(s/def ::gameplayCtx (s/merge ::mapView ::cursorView ::unitsView ::moveRangeView))

; for macro
(def unitMenuView ::unitMenuView)