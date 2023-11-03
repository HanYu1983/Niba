(ns lib.util)

(defn return->impl [ctx-var & exprs]
  (let [[first-pair & rest-pair] (->> exprs (partition 2) reverse)
        [first-cond [first-fn & first-args]] first-pair
        expend-expr (reduce (fn [expr [condition [f & args]]]
                              `(if (not ~condition)
                                 ~ctx-var
                                 (let [~ctx-var (apply ~f (cons ~ctx-var (list ~@args)))]
                                   ~expr)))
                            `(if (not ~first-cond)
                               ~ctx-var
                               (apply ~first-fn (cons ~ctx-var (list ~@first-args))))
                            rest-pair)]
    expend-expr))

(defmacro return-> [ctx-var & exprs]
  (apply return->impl (cons ctx-var exprs))
  #_(let [[first-pair & rest-pair] (->> exprs (partition 2) reverse)
          [first-cond [first-fn & first-args]] first-pair
          expend-expr (reduce (fn [expr [condition [f & args]]]
                                `(if (not ~condition)
                                   ~ctx-var
                                   (let [~ctx-var (apply ~f (cons ~ctx-var (list ~@args)))]
                                     ~expr)))
                              `(if (not ~first-cond)
                                 ~ctx-var
                                 (apply ~first-fn (cons ~ctx-var (list ~@first-args))))
                              rest-pair)]
      expend-expr))


(defn test-all []
  (println (macroexpand (return->impl 'ctx
                                      'true
                                      '((fn [& args] (println args)) 30 40)

                                      'true
                                      '((fn [& args] (println args)) 30))))
  (println (macroexpand `(return-> ctx
                                   false
                                   ((fn [ctx args] (assoc ctx :age args)) 30)

                                   (-> ctx :age (= 130))
                                   ((fn [ctx] (assoc ctx :weapon 1))))))
  (let [ctx {:state :origin}
        _ (println (return-> ctx
                             true
                             ((fn [ctx args] (assoc ctx :age args)) 30)

                             (-> ctx :age (= 30))
                             ((fn [ctx] (assoc ctx :weapon 1)))))]))