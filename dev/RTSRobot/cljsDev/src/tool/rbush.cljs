(ns tool.rbush
  (:require ["rbush" :as RBush]
            [clojure.spec.alpha :as s]
            [clojure.set]))

(s/def ::rbush #(instance? RBush %))

(defn create [{toBBox :toBBox compareMinX :compareMinX compareMinY :compareMinY}]
  (s/assert
   ::rbush
   (let [rbush (RBush.)
         _ (when toBBox
             (set! (.-toBBox rbush) (fn [item]
                                      (let [[p1x p1y p2x p2y] (s/assert
                                                               (s/tuple number? number? number? number?)
                                                               (toBBox item))]
                                        (js-obj "minX" p1x
                                                "minY" p1y
                                                "maxX" p2x
                                                "maxY" p2y)))))
         _ (when compareMinX
             (set! (.-compareMinX rbush) (fn [a, b]
                                           (s/assert number? (compareMinX a b)))))
         _ (when compareMinY
             (set! (.-compareMinY rbush) (fn [a, b]
                                           (s/assert number? (compareMinY a b)))))]
     rbush)))

(defn update! [rbush old-entites now-entites]
  (s/assert ::rbush rbush)
  (s/assert (s/map-of any? any?) old-entites)
  (s/assert (s/map-of any? any?) now-entites)
  (let [remove-fn (fn [a b]
                    (= a b))
        old-ids (->> (keys old-entites) (into #{}))
        now-ids (->> (keys now-entites) (into #{}))
        removed-ids (clojure.set/difference old-ids now-ids)
        _ (doseq [id removed-ids]
            (.remove rbush (old-entites id) remove-fn))

        new-ids (clojure.set/difference now-ids old-ids)
        _ (.load rbush (-> (map #(now-entites %) new-ids) to-array))

        hold-ids (clojure.set/intersection old-ids now-ids)
        _ (doseq [id hold-ids]
            (let [old (old-entites id)
                  now (now-entites id)]
              (when (not= old now)
                (.remove rbush old remove-fn)
                (.insert rbush now))))]))

(defn search [rbush [p1x p1y p2x p2y :as args]]
  (s/assert ::rbush rbush)
  (s/assert (s/tuple number? number? number? number?) args)
  (into [] (.search rbush (js-obj "minX" p1x
                                  "minY" p1y
                                  "maxX" p2x
                                  "maxY" p2y))))

(defn all [rbush]
  (s/assert ::rbush rbush)
  (into [] (.all rbush)))

(defn test1 []
  (let [rbush (create {:compareMinX (fn [a b]
                                      (- (- (:x a) (:radius a))
                                         (- (:x b) (:radius b))))
                       :compareMinY (fn [a b]
                                      (- (- (:y a) (:radius a))
                                         (- (:y b) (:radius b))))
                       :toBBox (fn [item]
                                 [(- (:x item) (:radius item))
                                  (- (:y item) (:radius item))
                                  (+ (:x item) (:radius item))
                                  (+ (:y item) (:radius item))])})

        entities {}
        next-entities (merge entities {:a {:x 0 :y 0 :radius 10}
                                       :b {:x 50 :y 50 :radius 10}})
        _ (update! rbush entities next-entities)
        _ (println (search rbush [0 0 50 50]))
        _ (println "all" (all rbush))

        entities next-entities
        next-entities (dissoc entities :a)
        _ (update! rbush entities next-entities)
        _ (println (search rbush [0 0 50 50]))
        _ (println "all" (all rbush))

        entities next-entities
        next-entities (update-in entities [:b :x] #(+ % 50))
        _ (update! rbush entities next-entities)
        _ (println (search rbush [0 0 50 50]))
        _ (println "all" (all rbush))
        
        _ (js/console.log rbush)]))