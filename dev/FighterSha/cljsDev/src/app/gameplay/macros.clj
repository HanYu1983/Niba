(ns app.gameplay.macros)

(defmacro defasync [name ret-type typed-args err-body & body]
  `(defn ~name ~(into [] (keys typed-args))
     ~@(map (fn [[arg type]]
              `(clojure.spec.alpha/assert ~type ~arg))
            typed-args)
     (clojure.core.async/go
       (clojure.spec.alpha/assert
         ~ret-type
        (try
          ~@body
          (catch js/Error ~'err
            ~err-body))))))

(defmacro async-> [ctx & expr]
  `(let ~(into [] (mapcat (fn [[f & args]]
                            `([~ctx ~'err]
                              (clojure.core.async/<! (~f ~ctx ~@args))
                              
                              ~'_ 
                              (when ~'err (throw ~'err))))
                          expr))
     ~ctx))