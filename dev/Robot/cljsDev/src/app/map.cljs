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



(defn generateMap [w h {:keys [deepsea sea sand grass city tree award]}]
  (let [scale 0.1]
    (for [i (range w)
          j (range h)]
      (let [f (js/noise.perlin2 (* i scale) (* j scale))]
        (cond
          ; 山脈
          (> f (+ -1 deepsea sea sand grass))
          5

          (> f (+ -1 deepsea sea sand))
          (let [cityPosX (->> (* i 0.4)
                              int
                              (* scale 3)
                              (+ 123))
                cityPosY (->> (* j 0.4)
                              int
                              (* scale 3)
                              (+ 245))
                f3 (js/noise.perlin2 cityPosX cityPosY)]
            (cond
              (> f3 (+ -1 city))
              (let [treePosX (->> (* i scale 3)
                                  (+ 300))
                    treePosY (->> (* i scale 3)
                                  (+ 20))
                    f2 (js/noise.perlin2 treePosX treePosY)]
                (cond
                  ; 平原
                  (> f2 (+ -1 tree))
                  (if (< (rand) award)
                    7
                    3)

                  ; 樹林
                  :else
                  (if (< (rand) award)
                    7
                    4)))

              ; 路
              (or (some #(= i %) [4 8 12 16])
                  (some #(= j %) [4 8 12 16]))
              8

              ; 城市
              :else
              (if (< (rand) award)
                7
                4)))

          ; 沙灘          
          (> f (+ -1 deepsea sea))
          (if (< (rand) award)
            7
            2)

          ; 淺海       
          (> f (+ -1 deepsea))
          (if (< (rand) award)
            7
            1)
          
          :else
          0)))))