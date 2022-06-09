(ns app.controller.player
  (:require [clojure.spec.alpha :as s]
            ["rxjs" :as rxjs]
            ["rxjs/operators" :as rxop]
            [app.tool.event :as event]
            [app.controller.env :as env]))

(defn on-create [ctx e]
  (.next event/on-create-tank ctx)
  ; create body
  ctx)

(defn on-key [ctx env key]
  (let [_ (env/find-nearby-tank env nil)
        _ (.next event/on-create {:id (str (gensym "bullet")) :type :bullet :args nil})])
  ; move body
  ctx)

(defn on-tick [ctx env]
  (.next event/on-update-tank ctx)
  ctx)

(let [atom-env (atom nil)
      atom-ctx (atom nil)]
  (.subscribe (.pipe event/on-create
                     (rxop/filter (fn [[obj _]]
                                    (= (:type obj) :player))))
              (fn [e]
                (swap! atom-ctx #(on-create % e))))
  (.subscribe event/on-update-env
              (fn [e]
                (reset! atom-env e)))
  (.subscribe event/on-key
              (fn [key]
                (swap! atom-ctx #(on-key % @atom-env key))))
  (.subscribe event/on-tick
              (fn []
                (swap! atom-ctx #(on-tick % @atom-env)))))