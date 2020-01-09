(ns tool.menuCursor)

(defn model [menu]
  {:cursor 0
   :subcursor (into [] (repeat (count menu) 0))
   :menu menu})

(defn getMenu [ctx]
  (:menu ctx))

(defn getCursor1 [ctx]
  (:cursor ctx))

(defn getCursor2 [ctx]
  (get-in ctx [:subcursor (getCursor1 ctx)]))

(defn getSelect [ctx]
  (get-in ctx [:menu (getCursor1 ctx) (getCursor2 ctx)]))

(defn mapCursor1 [ctx f]
  (-> (:cursor ctx)
      (f)
      (max 0)
      (min (dec (count (:subcursor ctx))))
      ((fn [cursor]
         (update ctx :cursor (constantly cursor))))))

(defn mapCursor2 [ctx f]
  (let [cursor1 (:cursor ctx)
        cursor2 (get-in ctx [:subcursor cursor1])
        cursor2 (-> cursor2
                    (f)
                    (max 0)
                    (min (dec (count (get (:menu ctx) cursor1)))))
        ctx (update-in ctx [:subcursor cursor1] (constantly cursor2))]
    ctx))