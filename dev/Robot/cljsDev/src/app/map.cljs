(ns app.map)

(def defaultModel {})

(defn findPath [start end nextFn costFn estCostFn]
  (loop [close #{}
         open [start]
         info {}
         i 0]
    (if (= i 5000)
      nil
      (let [curr (first open)]
        (if (= curr end)
          (let [path (loop [path []
                            curr curr]
                       (if (nil? (get info curr))
                         (cons curr path)
                         (recur (cons curr path) (:prev (get info curr)))))]
            (println i)
            path)
          (let [close (conj close curr)
                nexts (->> (nextFn curr)
                           (filter #(not (contains? (into close open) %))))
                info (->> nexts
                          (reduce (fn [info next]
                                    (update info next (fn [origin]
                                                        (let [costToNext (costFn curr next)
                                                              cost (+ (estCostFn next end) costToNext)
                                                              totalCost (+ (get-in info [curr :totalCost]) costToNext)]
                                                          (if (nil? origin)
                                                            {:cost cost
                                                             :totalCost totalCost
                                                             :prev curr}
                                                            (if (>= cost (:cost origin))
                                                              origin
                                                              (merge origin {:cost cost
                                                                             :totalCost totalCost
                                                                             :prev curr})))))))
                                  info))
                open (->> open
                          rest
                          (concat nexts)
                          (sort-by (fn [d]
                                     (->> [:totalCost :cost]
                                          (map (fn [key] (get-in info [d key])))
                                          (apply +)))))]
            (recur close open info (inc i))))))))