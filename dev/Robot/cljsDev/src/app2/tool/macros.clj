(ns app2.tool.macros)

(defmacro defasync [name vars-typed err-body ret-type & body]
  (let [vars (->> (partition 2 vars-typed) (mapv first))
        types (->> (partition 2 vars-typed) (mapv second))]
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

(defmacro defnx [name vars-typed err-body ret-type & body]
  (let [vars (->> (partition 2 vars-typed) (mapv first))
        types (->> (partition 2 vars-typed) (mapv second))]
    `(defn ~name ~vars
       ~@(map (fn [var type]
                `(clojure.spec.alpha/assert ~type ~var))
              vars
              types)
       (clojure.spec.alpha/assert
        ~ret-type
        (try
          ~@body
          (catch js/Error ~'err
            ~err-body))))))

(defmacro defasync2 [name args err-body & body]
  `(defn ~name ~args
     (try
       ~@body
       (catch js/Error ~'err2
         ~err-body))))

(defmacro async-> [ctx & expr]
  `(let ~(into [] (mapcat (fn [[f & args]]
                            `([~ctx ~'err]
                              (clojure.core.async/<! (~f ~ctx ~@args))
                              
                              ~'_ 
                              (when ~'err (throw ~'err))))
                          expr))
     ~ctx))

#_(defmacro simple-impl [& body]
  `(loop [~'ctx ~'ctx]
     (let [~'evt (clojure.core.async/<! ~'input-ch)
           ~'_ (when (nil? ~'evt)
                 (throw (js/Error. "close")))
           ~'ctx (app2.tool.macros/async-> ~'ctx ~@body)
           ~'ctx (if (fn? ~'evt)
                   (~'evt ~'ctx)
                   ~'ctx)]
       (recur ~'ctx))))