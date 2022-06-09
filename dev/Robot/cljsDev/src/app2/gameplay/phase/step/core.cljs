(ns app2.gameplay.phase.step.core
  (:require [clojure.spec.alpha :as s]
            [clojure.core.async :refer [go <!]]
            [clojure.set]
            [app2.component.debug :refer [handle-debug]]
            [app2.component.menu :refer [handle-menu-component]]
            [app2.component.attack-range :refer [handle-attack-range-component]]
            [app2.component.camera :refer [handle-camera-component]]
            [app2.component.cursor :refer [handle-cursor-component]]
            [app2.tool.gameplay-spec :as gameplay-spec]
            [tool.menuCursor :refer [getCursor1 getCursor2 getSelect mapCursor1 mapCursor2]])
  (:require-macros [app2.tool.macros :refer [async-> defasync defnx]]))

(defasync menu-step [ctx any?, menu-key keyword?, unit any?, input-ch any?] [ctx nil err] (s/tuple any? (s/nilable (s/or :i number? :s string? :k keyword?)) any?)
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-menu-component menu-key evt)
                       (handle-attack-range-component menu-key unit evt))

          [ctx cancel? selection err] (s/assert
                                       (s/tuple any? boolean? (s/nilable (s/or :i number? :s string? :k keyword?)) any?)
                                       (cond
                                         (= [:on-click "'"] evt)
                                         [ctx true nil nil]

                                         (= [:on-click "space"] evt)
                                         [ctx true (-> ctx menu-key :menu-cursor getSelect) nil]

                                         :else
                                         [ctx false nil nil]))
          _ (when err (throw err))]
      (if (or cancel? selection)
        [ctx selection nil]
        (recur ctx)))))

(defasync select-position-step [ctx any?, input-ch any?] [ctx nil err] (s/tuple any? (s/nilable ::gameplay-spec/position) any?)
  (loop [ctx ctx]
    (let [evt (<! input-ch)
          ctx (async-> ctx
                       (handle-debug evt)
                       (handle-camera-component evt)
                       (handle-cursor-component evt))

          [ctx cancel? selection err] (s/assert
                                       (s/tuple any? boolean? (s/nilable ::gameplay-spec/position) any?)
                                       (cond
                                         (= [:on-click "'"] evt)
                                         [ctx true nil nil]

                                         (= [:on-click "space"] evt)
                                         [ctx false (-> ctx :cursor) nil]

                                         :else
                                         [ctx false nil nil]))
          _ (when err (throw err))]
      (if (or cancel? selection)
        [ctx selection nil]
        (recur ctx)))))