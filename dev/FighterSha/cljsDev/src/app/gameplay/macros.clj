(ns app.gameplay.macros)

(defmacro defasync [name ret-type typed-args err-body & body]
  (let [vars (->> (partition 2 typed-args) (mapv first))
        types (->> (partition 2 typed-args) (mapv second))]
    `(defn ~name ~vars
       ~@(map (fn [var type]
                `(clojure.spec.alpha/assert ~type ~var))
              vars
              types)
       (clojure.core.async/go
         (clojure.spec.alpha/assert
          ~ret-type
          (try
            ~@body
            (catch js/Error ~'err
              ~err-body)))))))

(defmacro async-> [ctx & expr]
  `(let ~(into [] (mapcat (fn [[f & args]]
                            `([~ctx ~'err]
                              (clojure.core.async/<! (~f ~ctx ~@args))
                              
                              ~'_ 
                              (when ~'err (throw ~'err))))
                          expr))
     ~ctx))