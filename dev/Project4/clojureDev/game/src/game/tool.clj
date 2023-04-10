(ns game.tool
  #_(:import [clojure.core.async.impl.channels ManyToManyChannel])
  (:require [clojure.core.async :refer [go <! chan >! close! timeout]]))

(defn do-something [])

(defmacro async-> [ctx & expr]
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



#_(defn test-async []
  (go (let [ctx 0
            ret (<! (go (inc ctx)))
            ctx (if (instance? clojure.core.async.impl.channels.ManyToManyChannel ret)
                  (<! ret)
                  ret)
            ret (<! (go (inc ctx)))
            ctx (if (instance? clojure.core.async.impl.channels.ManyToManyChannel ret)
                  (<! ret)
                  ret)]
        (println ctx))))

#_(defn show-macroexpand []
  (macroexpand-1 '(async-> 0 ((fn [ctx] (go (inc ctx)))))))