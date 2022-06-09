(ns app2.component.move-range
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [app2.data.data :refer [getUnitMovePathTree]]
            [app2.tool.const :refer [*test search-position]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]])
  (:require [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

(defasync handle-move-range-component [ctx any?, update? boolean?, [cmd args] any?] [ctx err] any?
  ;(println "handle-move-range-component")
  (s/assert ::view-spec/moveRangeView ctx)
  (cond
    (= :on-click cmd)
    (cond
      (#{"w" "s" "a" "d"} args)
      (let [{:keys [cursor units]} ctx
            unitAtCursor (search-position units cursor)
            robot? (s/valid? ::gameplay-spec/robot unitAtCursor)
            moveRange (if robot?
                        (let [shortestPathTree (getUnitMovePathTree ctx unitAtCursor)
                              moveRange (map first shortestPathTree)]
                          moveRange)
                        [])
            ctx (update-in ctx [:moveRange] (constantly moveRange))]
        [ctx nil])
      :else
      [ctx nil])
    :else
    [ctx nil]))