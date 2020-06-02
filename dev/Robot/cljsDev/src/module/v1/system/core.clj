(ns module.v1.system.core)

(defmacro return-let [[nameReturn nameReturnCtx] & body]
  `(let [~'conform (s/conform ~'type/returnCtx ~nameReturnCtx)]
     (if (= ~'common/invalid ~'conform)
       (throw (js/Error. (s/explain-str ~'type/returnCtx ~nameReturnCtx)))
       (let [[~'returnType] ~'conform]
         (condp = ~'returnType
           :return
           (let [~nameReturn ~nameReturnCtx]
             ~@body)
           (recur ~nameReturnCtx))))))

(defmacro return [nameReturnCtx]
  `(return-let [~nameReturnCtx ~nameReturnCtx] ~nameReturnCtx))