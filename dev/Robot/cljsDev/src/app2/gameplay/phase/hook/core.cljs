(ns app2.gameplay.phase.hook.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [app2.data.data :refer [getMenuData]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [app2.tool.view-spec :as view-spec]
            [app2.tool.const :refer [*test]]
            [tool.menuCursor])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

; hook
(defnx create-unit-menu-component [ctx any?, unit any?, target-robot any?] [nil err] (s/tuple (s/nilable ::view-spec/menu-component) any?)
  (let [[menu data] (getMenuData ctx unit target-robot)]
    [{:menu-cursor (tool.menuCursor/model menu)
      :menu-cursor-data data}
     nil]))

(defnx create-system-menu-component [ctx any?] [nil err] (s/tuple (s/nilable ::view-spec/menu-component) any?)
  (let [menu [["endTurn"]]
        data {}]
    [{:menu-cursor (tool.menuCursor/model menu)
      :menu-cursor-data data}
     nil]))