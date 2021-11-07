(defmacro define-fn
  [name & body]
  `(def ~name (fn ~@body)))

(define-fn print
  [message]
  (.log console message))

(print "XX GEN")

(let [{:strs [always zip repeat pipe __ assoc]} R
      spec (get window "js.spec")

      _ (spec.assert types.point {:x 0 :y 0})
      doA (fn []
            (console.log ((pipe (always [0 1 2])
                                (zip ["x" "y" "z"])
                                (reduce (fn [acc [k v]]
                                          (assoc k v acc))
                                        {})
                                (repeat __ 5)))))
      _ (console.log (condp = 0
                       0 100
                       200))

      _ (console.log (cond
                       false 100
                       :else 300))

      _ (console.log (->> [0 1 2]
                          (zip ["x" "y" "z"])
                          (reduce (fn [acc [k v]]
                                    (assoc k v acc))
                                  {})
                          (#(repeat % 5))))

      _ (console.log (assoc :x 20 {}))

      _ (console.log (->> [0 1 2]
                          (map #(* % 2))
                          (filter #(= 0 (mod % 2)))))

      _ (console.log (= #{:a 0} #{:a 0})
                     (conj [] "a")
                     (= #{:a} (conj #{} :a))
                     :ke)

      x 0
      doB (fn []
            (set! x (inc x))
            (console.log x))

      _ (set! window.test1 {:doA doA :doB doB})])


(let [set1 #{:a :b}
      _ (console.log (set1 :c))])