(ns app2.tool.core-step
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]
            [app2.component.debug :refer [handle-debug]]
            [app2.component.menu :refer [handle-menu-component]]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

(defasync menu-step [ctx any?, menu-key keyword?, input-ch any?] [ctx nil err] (s/tuple any? (s/nilable string?) any?)
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-menu-component menu-key evt))

          [ctx cancel? selection err] (s/assert
                                       (s/tuple any? boolean? (s/nilable string?) any?)
                                       (cond
                                         (= [:on-click "esc"] evt)
                                         [ctx true nil nil]

                                         (= [:on-click "space"] evt)
                                         [ctx true (-> ctx menu-key :menu-cursor getSelect) nil]

                                         :else
                                         [ctx false nil nil]))
          _ (when err (throw err))]
      (if (or cancel? selection)
        [ctx selection nil]
        (recur ctx)))))