(ns tool.map
  (:require ["./generateMap.js" :as _generateMap])
  (:require [tool.astar]))

(def defaultModel {})

(def buildPath tool.astar/buildPath)

(def findPath tool.astar/route)

(def simpleFindPath
  (memoize (fn [start maxCost]
             (map first (findPath (fn [[x y]]
                                    [[[x (inc y)] 1]
                                     [[x (dec y)] 1]
                                     [[(inc x) y] 1]
                                     [[(dec x) y] 1]])
                                  (constantly 0)
                                  start
                                  (fn [{:keys [totalCost]} curr]
                                    [(>= totalCost maxCost) false]))))))

(defn generateMap [w h {:keys [deepsea sea sand grass hill city tree award power offset]}]
  (->> (_generateMap w h deepsea sea sand grass hill city tree award power offset)
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


(defn getMapSize [playmap]
  [(count (first playmap)) (count playmap)])




















(defn buildPath2 [pathTree end]
  (let [path (loop [path []
                    curr end]
               (if (nil? (get pathTree curr))
                 (cons curr path)
                 (recur (cons curr path) (:prev (get pathTree curr)))))]
    path))

(defn findPath2 [start endFn nextFn costFn estCostFn]
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