(ns tool.basic
  (:require [clojure.core.async :refer [go <! chan >! close! timeout <!!]]))


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

(defmacro option-> [ctx & expr]
  `(let ~(into ['ctx ctx] (mapcat (fn [[f & args]]
                                    `(~'ctx (when ~'ctx (~f ~'ctx ~@args))))
                                  expr))
     ~'ctx))

(defn do-script [ctx script]
  (eval (list 'let ['ctx ctx
                    'local-fn (fn [damage] (println "local-fn " damage) (str "from local-fn " damage))]
              '(println "script" (local-fn 10))
              '(tool.basic/do-something)
              script)))


(defn test-async-> []
  (go (let [ctx 100
            ctx (<! (async-> ctx
                             ((fn [ctx n] (go (+ n ctx))) 10)
                             (#(inc %))
                             ((fn [ctx] (go (inc ctx))))))
            abc 30
            cde (<! (async-> 100))
            ctx (+ ctx cde abc)
            _ (println ctx)]
        ctx)))


(defn test-option-> []
  (let [_ (println (str (macroexpand '(simple-str [1 2 3]))))
        _ (println (macroexpand '(-> c (+ 3) (* 2))))
        _ (println (macroexpand '(option-> 30 ((fn [ctx] nil)))))]))

(defn do-something [] (println "do-something") 1000)

(defn test-do-script []
  (let [script-str (str '(let [_a (local-fn "a")
                               _b (local-fn "b")
                               _ (tool.basic/do-something)
                               _ (println ctx)]
                           (update ctx :damage #(+ % 20))))
        _ (println script-str)
        script (read-string script-str)
        ctx {:damage 20}]
    (println (do-script ctx script))))

#_(defn show-macroexpand []
    (macroexpand-1 '(async-> 0 ((fn [ctx] (go (inc ctx)))))))

(defn tests []
  (<!! (test-async->))
  (test-option->)
  (test-do-script))