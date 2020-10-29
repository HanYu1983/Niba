(ns app2.component.menu
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :as a]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]])
  (:require [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

(defasync handle-menu-component [ctx any?, menu-key keyword?, evt any?] [ctx err] any?
  (s/assert ::view-spec/menu-component (get-in ctx [menu-key]))
  (cond
    (= [:on-click "w"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor1 origin dec)))
     nil]

    (= [:on-click "s"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor1 origin inc)))
     nil]

    (= [:on-click "a"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor2 origin nil dec)))
     nil]

    (= [:on-click "d"] evt)
    [(update-in ctx [menu-key :menu-cursor] (fn [origin]
                                              (mapCursor2 origin nil inc)))
     nil]

    :else
    [ctx nil]))