(ns client.macro)

(defmacro abc [ctx & expr]
  `(clojure.core.async/go
     (let ~(into ['ctx ctx] (mapcat (fn [[f & args]]
                                      `(~'ret
                                        (~f ~'ctx ~@args)

                                        ~'ctx
                                        (if (instance? clojure.core.async.impl.channels.ManyToManyChannel ~'ret)
                                          (clojure.core.async/<! ~'ret)
                                          ~'ret)))
                                    expr))
       ~'ctx)))

(defmacro option-> [ctx & expr]
  `(let ~(into ['ctx ctx] (mapcat (fn [[f & args]]
                                    `(~'ctx (when ~'ctx (~f ~'ctx ~@args))))
                                  expr))
     ~'ctx))
