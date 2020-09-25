(ns app2.gameplay.control.core)

(defn entities-reduce [fns gameplay [cmd args]]
  (update-in gameplay [:state :entities] (fn [entities]
                                           (->> (vals entities)
                                                (map (fn [entity]
                                                       (reduce (fn [entity f]
                                                                 (f entity gameplay [cmd args]))
                                                               entity
                                                               fns)))
                                                (zipmap (keys entities))))))