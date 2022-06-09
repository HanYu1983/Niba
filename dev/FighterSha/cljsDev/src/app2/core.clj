(ns app2.core)

(defmacro defnx [name args & body]
  (let [args-n (->> args (partition 2) (mapv first))
        args-spec (->> args (partition 2) (mapv second))
        spec `(clojure.spec.alpha/assert (clojure.spec.alpha/tuple ~@args-spec) ~args-n)]
    `(defn ~name ~args-n ~@(cons spec body))))