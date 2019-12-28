(ns app.quadtree)

(defn rect-contains-rect? [r1 r2]
  (let [[ltx1 lty1 rbx1 rby1] r1
        [ltx2 lty2 rbx2 rby2] r2]
    (and (<= ltx1 ltx2)
         (> rbx1 rbx2)
         (<= lty1 lty2)
         (> rby1 rby2))))

(defn rect-overlap-rect? [r1 r2]
  (println r1 r2)
  (let [[ltx1 lty1 rbx1 rby1] r1
        [ltx2 lty2 rbx2 rby2] r2]
    (and (<= ltx1 rbx2)
         (> rbx1 ltx2)
         (<= lty1 rby2)
         (> rby1 lty2))))

(defn make-qdtree [rect depth]
  (if (= depth 0)
    [rect #{} nil nil nil nil {:depth 0}]
    (let [[cx cy cw ch] rect
          s1 [cx cy (/ cw 2) (/ ch 2)]
          s2 [(+ cx (/ cw 2)) cy cw (/ ch 2)]
          s3 [cx (+ cy (/ ch 2)) (/ cw 2) ch]
          s4 [(+ cx (/ cw 2)) (+ cy (/ ch 2)) cw ch]]
      [rect #{}
       (make-qdtree s1 (dec depth))
       (make-qdtree s2 (dec depth))
       (make-qdtree s3 (dec depth))
       (make-qdtree s4 (dec depth))
       {:depth depth}])))

(defn balance [tree]
  (when tree
    (let [[rect objs r1 r2 r3 r4 info] tree
          [r1 r2 r3 r4] (map balance [r1 r2 r3 r4])
          cnt (->> [r1 r2 r3 r4]
                   (map #(let [[_ _ _ _ _ _ {cnt :count}] %]
                           cnt))
                   (cons (count objs))
                   (apply +))]
      [rect objs r1 r2 r3 r4 (merge info {:count cnt})])))

(defn add [tree rectFn v]
  (let [[rect objs r1 r2 r3 r4 info] tree
        t (reduce (fn [acc [rect :as tree]]
                    (if acc
                      acc
                      (if tree
                        (if (rect-contains-rect? rect (rectFn v))
                          tree
                          acc)
                        acc)))
                  nil
                  [r1 r2 r3 r4])
        t (or t tree)]
    (condp = t
      r1
      [rect objs (add r1 rectFn v) r2 r3 r4 info]

      r2
      [rect objs r1 (add r2 rectFn v) r3 r4 info]

      r3
      [rect objs r1 r2 (add r3 rectFn v) r4 info]

      r4
      [rect objs r1 r2 r3 (add r4 rectFn v) info]

      [rect (conj objs v) r1 r2 r3 r4 info])))

(defn delete [tree rectFn v]
  (let [[rect objs r1 r2 r3 r4 info] tree
        t (reduce (fn [acc [rect _ _ _ _ _ {cnt :count} :as tree]]
                    (if acc
                      acc
                      (if tree
                        (if (and (> cnt 0) 
                                 (rect-contains-rect? rect (rectFn v)))
                          tree
                          acc)
                        acc)))
                  nil
                  [r1 r2 r3 r4])
        t (or t tree)]
    (condp = t
      r1
      [rect objs (delete r1 rectFn v) r2 r3 r4 info]

      r2
      [rect objs r1 (delete r2 rectFn v) r3 r4 info]

      r3
      [rect objs r1 r2 (delete r3 rectFn v) r4 info]

      r4
      [rect objs r1 r2 r3 (delete r4 rectFn v) info]

      [rect (disj objs v) r1 r2 r3 r4 info])))

(defn search [tree rectFn searchRect]
  (let [[_ objs r1 r2 r3 r4] tree
        objs (->> objs
                  (filter #(rect-overlap-rect? searchRect (rectFn %)))
                  (into #{}))
        objs (reduce (fn [objs [subRect _ _ _ _ _ {cnt :count} :as tree]]
                       (if tree
                         (if (and (> cnt 0)
                                  (rect-overlap-rect? searchRect subRect))
                           (clojure.set/union objs (search tree rectFn searchRect))
                           objs)
                         objs))
                     objs
                     [r1 r2 r3 r4])]
    objs))

