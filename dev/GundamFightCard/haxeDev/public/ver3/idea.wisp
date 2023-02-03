(let [{:strs [always zip repeat pipe __ assoc assocPath mergeRight]} R
      module {:value {:tap false :faceUp false}
              :tapPath [:tap]
              :faceUpPath [:faceUp]}
      _ (set! window.tool (or window.tool {}))
      _ (set! window.tool.card module)])

(let [module {:value {:cards [] :cardStacks []}}
      _ (set! window.tool (or window.tool {}))
      _ (set! window.tool.table module)])


(eval "function _fn(){console.log(window.tool.table)}; _fn()")

(let [fn1 (.toString (fn _fn [args]
                       (let [abc {:id "fn2", :ids [1,2,"abc"]}]
                         (print this args abc)
                         abc)))
      _ (print fn1)
      _ (eval fn1)
      _ (print ((_fn.bind {}) "out"))])