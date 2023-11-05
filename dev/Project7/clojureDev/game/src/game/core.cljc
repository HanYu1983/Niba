(ns game.core
  (:require [clojure.core.match]
            [app.dynamic]
            [app.text]
            [app.card-proto]))

(defn return-let-impl [binding-vars & exprs]
  (let [[vars [[_ return-condition] & rest-vars]] (->> (list take-while drop-while)
                                                       (map (fn [f]
                                                              (f (fn [[var _]] (not (= :return var)))
                                                                 (partition 2 binding-vars)))))]
    (println "===============")
    (println binding-vars)
    (println vars)
    (println return-condition)
    (println rest-vars)
    (list 'let (vec (mapcat (fn [[v b]] (list (symbol (name v)) b)) vars))
          (if (-> return-condition first (= 'when))
            (->> return-condition
                 (replace {'when 'if}) vec reverse
                 (cons (apply (partial return-let-impl (vec (mapcat identity rest-vars))) exprs)) reverse (apply list))
            (if (not rest-vars)
              `(do ~@exprs)
              (apply (partial return-let-impl (vec (mapcat identity rest-vars))) exprs))))))

(defmacro return-let [binding-vars & exprs]
  (apply (partial return-let-impl binding-vars) exprs))

(defn -main [args]
  #_(app.card-proto/test-all)
  #_(println (macroexpand (return-let-impl '[ctx 1
                                           age 29
                                           :return (when (< ctx 2)
                                                     [nil true])
                                           name "john"
                                           :return (when true ["" nil])]
                                         'ctx
                                         'ctx)))
  (println (macroexpand `(return-let [ctx 1
                                      age 29
                                      :return (when (< ctx 2)
                                                [nil true])
                                      name "john"
                                      :return (when true ["" nil])]
                                     ctx
                                     ctx)))



  (println (return-let [ctx 30
                        :return (when true 0)
                        ctx 40]
                       ctx))
  
  #_(println (return-let [ctx 1
                        age 29
                        :return2 (when (< ctx 2)
                                  [nil true])
                        name "john"
                        :return3 (when true ["" nil])]
                       ctx
                       ctx))
  )