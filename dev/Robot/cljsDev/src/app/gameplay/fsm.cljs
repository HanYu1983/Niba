(ns app.gameplay.fsm)

(def model {:stack []
            :state []})

(defn currState [ctx]
  (first (:stack ctx)))

(defn pushState [ctx state]
  (-> ctx 
   (update :stack (partial cons state))
   (update :state (partial cons nil))))

(defn popState [ctx]
  (-> ctx
      (update :state rest)
      (update :stack rest)))

(defn setState [ctx state]
  (-> ctx
      popState
      (pushState state)))

(defn save [ctx obj]
  (update ctx :state (fn [origin]
                       (->> (rest origin)
                            (cons obj)))))

(defn load [ctx]
  (first (:state ctx)))