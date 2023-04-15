(ns game.core
  (:require [clojure.core.async :refer [go <! chan >! close! timeout <!!]]
            [clojure.spec.alpha :as s]
            [game.tool :refer [async->]]
            [game.define.event :refer :all]
            [game.define.basyou]
            [game.define.card-text]
            [game.define.game-effect]
            [game.define.card-proto]
            [game.define.require]
            [game.define.runtime]
            [game.define.effect]
            [game.component.cuts]
            [game.component.effect]
            [game.component.card-proto]
            [game.entity.model]
            [data.CardProto_179030_11E_U_VT186R_purple]))



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
  []
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
  (let [_ (println (str (macroexpand '(simple-str [1 2 3]))))
        _ (println (macroexpand '(-> c (+ 3) (* 2))))
        _ (println (macroexpand '(option-> 30 ((fn [ctx] nil)))))]))


(defn show-macroexpand []
  (macroexpand-1 '(async-> 0 ((fn [ctx] (go (inc ctx)))))))

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

(defn test-local []
  (let [_ (println "start")
        _ (test-do-script)
        _ (test-option->)
        _ (<!! (test-async->))
        _ (println "return")]))

(defn tests []
  (s/check-asserts true)
  (game.define.card-text/tests)
  (game.define.basyou/tests)
  (game.define.game-effect/tests)
  (game.define.card-proto/tests)
  (game.define.require/tests)
  (game.define.runtime/tests)
  (game.define.effect/tests)
  (game.component.cuts/tests)
  (game.component.effect/tests)
  (game.component.card-proto/tests)
  (game.entity.model/tests)
  (data.CardProto_179030_11E_U_VT186R_purple/tests))

(defn -main []
  (let [_ (tests)]))