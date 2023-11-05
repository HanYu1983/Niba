(ns game.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [app.card-proto]))

; 用defn支援recur
(defn return-let-impl [binding-vars & exprs]
  (let [[vars [[_ return-condition] & rest-vars]] (->> (list take-while drop-while)
                                                       (map (fn [f]
                                                              (f (fn [[var _]] (not (= :return var)))
                                                                 (partition 2 binding-vars)))))]
    ; 使用name把symbol的namespace去掉
    (list 'let (vec (mapcat (fn [[v b]] (list (symbol (name v)) b)) vars))
          (if (-> return-condition first (= 'if))
            (let [[_ condition true-body] return-condition]
              (list 'if condition 
                    true-body 
                    (apply (partial return-let-impl (vec (mapcat identity rest-vars))) exprs)))
            (if (not rest-vars)
              `(do ~@exprs)
              (apply (partial return-let-impl (vec (mapcat identity rest-vars))) exprs))))))

(defmacro return-let [binding-vars & exprs]
  (apply (partial return-let-impl binding-vars) exprs))

(defn -main [args]
  #_(app.card-proto/test-all)
  (println (macroexpand (return-let-impl '[ctx 1
                                           age 29
                                           :return (if (< ctx 2)
                                                     [nil true])
                                           name "john"
                                           :return (if true ["" nil])]
                                         'ctx
                                         'ctx)))
  (println (macroexpand `(return-let [ctx 1
                                      age 29
                                      :return (if (< ctx 2)
                                                [nil true])
                                      name "john"
                                      :return (if true ["" nil])]
                                     ctx
                                     ctx)))
  (println (return-let [ctx 30
                        :return (if true 0)
                        ctx 40]
                       ctx))

  (println (return-let [ctx 1
                        age 29
                        :return (if (< ctx 0)
                                  [nil age])
                        name "john"
                        :return (if false ["" nil])]
                       [nil name])))