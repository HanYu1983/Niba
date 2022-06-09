(ns app.core
  (:require [clojure.spec.alpha :as s]
            [app.tool.event :as event]
            [app.controller.player]
            [app.controller.env]))

(s/check-asserts true)
(.next event/on-create {:id (str (gensym "player")) :type :player :args {}})
(.next event/on-create {:id (str (gensym "enemy")) :type :enemy :args nil})
(.next event/on-create {:id (str (gensym "enemy")) :type :enemy :args nil})
(.next event/on-directive :move-player-to-right)