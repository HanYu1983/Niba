(ns tool.waterfall)

(defmacro waterfall [& exprs]
  "
(waterfall (get-current-user) (get-user-info {:sort :money}))
=>
(fn* ([root-callback resp]
      (abc/get-current-user (fn [err resp]
                              (if err
                                (root-callback err nil)
                                (app.core/get-user-info (fn [err resp]
                                                          (if err
                                                            (root-callback err nil)
                                                            (root-callback nil resp)))
                                                        {:sort :money} resp)))
                            resp)))
"
  (let [reverse-exprs (reverse exprs)
        [[first-expr-fn & first-expr-args] & rest-exprs] reverse-exprs
        callback-hell (reduce
                       (fn [prev-else [fn & args]]
                         (cons fn (cons (list 'fn '[err resp]
                                              (list 'if 'err
                                                    (list 'root-callback 'err 'nil)
                                                    prev-else))
                                        (seq (conj (vec args) 'resp)))))
                       (cons first-expr-fn (cons '(fn [err resp]
                                                    (if err
                                                      (root-callback err nil)
                                                      (root-callback nil resp)))
                                                 (seq (conj (vec first-expr-args) 'resp))))
                       rest-exprs)
        final-expr (list 'fn '[root-callback resp] callback-hell)]
    final-expr))

(defn test-all []
  (println (macroexpand `(waterfall (abc/get-current-user)
                                    (get-user-info {:sort :money})))))