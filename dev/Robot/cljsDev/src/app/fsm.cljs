(ns app.fsm)

(def model {:stack [:default]
            :state {}})

(defn currState [ctx]
  (peek (:stack ctx)))

(defn pushState [ctx state]
  (update ctx :stack #(conj % state)))

(defn popState [ctx]
  (-> ctx
      (update :state (fn [state] (dissoc state (currState ctx))))
      (update :stack pop)))

(defn setState [ctx state]
  (-> ctx
      popState
      (pushState state)))

(defn save [ctx obj]
  (update-in ctx [:state (currState ctx)] (constantly obj)))

(defn load [ctx]
  (get-in ctx [:state (currState ctx)]))