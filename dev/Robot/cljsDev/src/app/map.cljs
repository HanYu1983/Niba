(ns app.map)

(def defaultModel {})

(defn buildPath [pathTree end]
  (let [path (loop [path []
                    curr end]
               (if (nil? (get pathTree curr))
                 (cons curr path)
                 (recur (cons curr path) (:prev (get pathTree curr)))))]
    path))

(defn findPath [start endFn nextFn costFn estCostFn]
  (loop [close #{}
         open [start]
         info {}
         i 0]
    (if (or (= i 5000) (= 0 (count open)))
      info
      (let [curr (first open)
            open (rest open)
            close (conj close curr)
            [isFind isInterrupt] (endFn (get info curr) curr i)]
        (if isFind
          (let [info (update info curr (fn [origin]
                                         (merge origin {:tail true})))]
            (if isInterrupt
              info
              (recur close open info (inc i))))
          (let [nexts (->> (nextFn curr)
                           (filter #(not (contains? (into close open) %))))
                info (->> nexts
                          (reduce (fn [info next]
                                    (update info next (fn [origin]
                                                        (let [costToNext (costFn curr next)
                                                              cost (+ (estCostFn next) costToNext)
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
                          (concat nexts)
                          (sort-by (fn [d]
                                     (->> [:totalCost :cost]
                                          (map (fn [key] (get-in info [d key])))
                                          (apply +)))))]
            (recur close open info (inc i))))))))



(defn generateMap [w h {:keys [deepsea sea sand grass city tree award]}]
  (->> (let [scale 0.1]
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
               0))))
       (partition w)
       (map (partial into []))
       (into [])))

(defn subMap [[cx cy] [cw ch] playmap]
  (let [[mw mh] [(count (first playmap)) (count playmap)]]
    (->> playmap
         (mapv (fn [row]
                 (subvec row 
                         (max 0 (min cx (- mw cw))) 
                         (max 0 (min mw (+ cx cw))))))
         ((fn [data]
            (subvec data 
                    (max 0 (min cy (- mh ch))) 
                    (max 0 (min mh (+ cy ch)))))))))