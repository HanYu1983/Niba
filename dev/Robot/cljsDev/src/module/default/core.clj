(ns module.default.core)

(defmacro defUnitGetter [field]
  `(defn  ~(symbol (str "getUnit" (clojure.string/capitalize (str field)))) [~'unit]
     (get-in ~'unit [:state ~(keyword field)])))

(defmacro defUnitSetter [field]
  `(defn ~(symbol (str "setUnit" (clojure.string/capitalize (str field)))) [~'unit ~'args]
     (update-in ~'unit [:state ~(keyword field)] (constantly ~'args))))