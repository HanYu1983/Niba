(ns app2.phase.core)

(defmacro simple-impl [& body]
  `(loop [~'ctx ~'ctx]
     (let [~'evt (clojure.core.async/<! ~'input-ch)
           ~'_ (when (nil? ~'evt)
                 (throw (js/Error. "close")))
           ~'ctx (app2.tool.macros/async-> ~'ctx ~@body)
           ~'ctx (if (fn? ~'evt)
                   (~'evt ~'ctx)
                   ~'ctx)]
       (recur ~'ctx))))