(ns tool.option)

(defn option-flatmap [mapf option]
  (if (nil? option)
    nil
    (mapf option)))

(defn option-get-or-throw [option err]
  (if (nil? option)
    (throw err)
    option))

(defn option-get-or-else [option el]
  (if option option el))