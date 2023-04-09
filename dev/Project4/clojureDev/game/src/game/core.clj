(ns game.core
  (:import [clojure.core.async.impl.channels ManyToManyChannel])
  (:require [game.tool]
            [clojure.core.async :refer [go <! chan >! close! timeout]]))

(defn do-script [ctx script]
  (eval (list 'let ['ctx ctx
                    'local-fn (fn [damage] (println "local-fn " damage) (str "from local-fn " damage))]
              '(println "script" (local-fn 10))
              '(game.tool/do-something)
              script)))

(defn test-do-script []
  (let [script-str (str '(let [_a (local-fn "a")
                               _b (local-fn "b")
                               _ (game.tool/do-something)
                               _ (println ctx)]
                           (update ctx :damage #(+ % 20))))
        _ (println script-str)
        script (read-string script-str)
        ctx {:damage 20}]
    (println (do-script ctx script))))

(def text {:require [{:type [:select []]
                      :text ""
                      :action (list 'let ['bonus [1,0,1]]
                                    '(println bonus))}]})


(defmulti card-id :type)
(defmethod card-id :system
  [args]
  (throw "xxx"))

(defn test-text []
  (println (read-string (str text))))




(defmacro simple-str [a] (str a))

(defmacro option-> [ctx & expr]
  `(let ~(into ['ctx ctx] (mapcat (fn [[f & args]]
                                    `(~'ctx (when ~'ctx (~f ~'ctx ~@args))))
                                  expr))
     ~'ctx))



(defn test-option-> []
  (let [init 30
        _ (println (str (macroexpand '(simple-str [1 2 3]))))
        _ (println (macroexpand '(-> c (+ 3) (* 2))))
        _ (println (macroexpand '(option-> 30 ((fn [ctx] nil)))))]))

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

(defn test-async-> []
  (go (let [ctx (<! (async-> 0
                             ((fn [ctx n] (go (+ n ctx))) 10)
                             (#(inc %))
                             ((fn [ctx] (go (inc ctx))))))
            abc 30
            cde (<! (async-> 100))
            ctx (+ ctx cde abc)
            _ (println ctx)]
        ctx)))

(defn test-async []
  (go (let [ctx 0
            ret (<! (go (inc ctx)))
            ctx (if (instance? ManyToManyChannel ret)
                  (<! ret)
                  ret)
            ret (<! (go (inc ctx)))
            ctx (if (instance? ManyToManyChannel ret)
                  (<! ret)
                  ret)]
        (println ctx))))

(defn show-macroexpand []
  (macroexpand-1 '(async-> 0 ((fn [ctx] (go (inc ctx)))))))

(defn -main []
  (let [wait (chan)
        _ (go (println "-->" (<! (test-async->)))
              (<! (timeout 3000))
              (close! wait))
        _ (go (<! wait) (println "done"))
        _ (println "return")]))