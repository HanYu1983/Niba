(ns tool.quadtree
  (:require [clojure.set]))

(defn rect-contains-rect? [r1 r2]
  (let [[ltx1 lty1 rbx1 rby1] r1
        [ltx2 lty2 rbx2 rby2] r2]
    (and (<= ltx1 ltx2)
         (>= rbx1 rbx2)
         (<= lty1 lty2)
         (>= rby1 rby2))))

(defn rect-overlap-rect? [r1 r2]
  (let [[ltx1 lty1 rbx1 rby1] r1
        [ltx2 lty2 rbx2 rby2] r2]
    (and (< ltx1 rbx2)
         (> rbx1 ltx2)
         (< lty1 rby2)
         (> rby1 lty2))))

(defn make-qdtree [rect depth]
  (if (= depth 0)
    [rect #{} nil nil nil nil {:height 0}]
    (let [[x1 y1 x2 y2] rect
          [xa xb xc] [x1 (/ (+ x1 x2) 2) x2]
          [ya yb yc] [y1 (/ (+ y1 y2) 2) y2]
          s1 [xa ya xb yb]
          s2 [xb ya xc yb]
          s3 [xa yb xb yc]
          s4 [xb yb xc yc]]
      [rect #{}
       (make-qdtree s1 (dec depth))
       (make-qdtree s2 (dec depth))
       (make-qdtree s3 (dec depth))
       (make-qdtree s4 (dec depth))
       {:height depth}])))

(defn balance [tree]
  (when tree
    (let [[rect objs r1 r2 r3 r4 info] tree
          [r1 r2 r3 r4] (map balance [r1 r2 r3 r4])
          cnt (->> [r1 r2 r3 r4]
                   (map #(let [[_ _ _ _ _ _ {cnt :totalCount}] %]
                           cnt))
                   (cons (count objs))
                   (apply +))]
      [rect objs r1 r2 r3 r4 (merge info {:totalCount cnt :count (count objs)})])))

(defn add [tree rectFn v]
  (let [[rect objs r1 r2 r3 r4 info] tree
        t (reduce (fn [acc [subRect :as tree]]
                    (if acc
                      acc
                      (if tree
                        (if (rect-contains-rect? subRect (rectFn v))
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

      tree
      [rect (conj objs v) r1 r2 r3 r4 info]
      
      (throw (js/Error. "add error")))))

(defn delete [tree rectFn v]
  (let [[rect objs r1 r2 r3 r4 info] tree
        t (reduce (fn [acc [rect _ _ _ _ _ {cnt :totalCount} :as tree]]
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

      tree
      [rect (disj objs v) r1 r2 r3 r4 info]
      
      (throw (js/Error. "delete error")))))

(defn values [tree]
  (when tree
    (let [[_ objs r1 r2 r3 r4] tree]
      (->> [r1 r2 r3 r4]
           (map values)
           (apply clojure.set/union objs)))))

(defn search [tree rectFn searchRect]
  (when tree
    (let [[rect objs r1 r2 r3 r4 {cnt :totalCount}] tree]
      (when (> cnt 0)
        (if (rect-contains-rect? searchRect rect)
          (values tree)
          (when (rect-overlap-rect? searchRect rect)
            (->> [r1 r2 r3 r4]
                 (map #(search % rectFn searchRect))
                 (apply clojure.set/union (->> objs
                                               (filter #(rect-overlap-rect? searchRect (rectFn %)))
                                               (into #{}))))))))))

(defn search3 [tree rectFn searchRect]
  (when tree
    (let [[rect objs r1 r2 r3 r4 {cnt :totalCount}] tree]
      (when (and (> cnt 0)
                 (rect-overlap-rect? searchRect rect))
        (->> [r1 r2 r3 r4]
             (map (fn [[subRect :as tree]]
                    (if (rect-contains-rect? searchRect subRect)
                      (values tree)
                      (search tree rectFn searchRect))))
             (apply clojure.set/union (if (rect-contains-rect? searchRect rect)
                                        objs
                                        (->> objs
                                             (filter #(rect-overlap-rect? searchRect (rectFn %)))
                                             (into #{})))))))))
  
(defn search2 [tree rectFn searchRect]
  (let [[rect objs r1 r2 r3 r4 info] tree
        objs (if (rect-contains-rect? searchRect rect)
               objs
               (->> objs
                    (filter #(rect-overlap-rect? searchRect (rectFn %)))
                    (into #{})))
        objs (reduce (fn [objs [subRect _ _ _ _ _ {cnt :totalCount} :as tree]]
                       (if tree
                         (if (and (> cnt 0)
                                  (rect-overlap-rect? searchRect subRect))
                           (clojure.set/union objs (search tree rectFn searchRect))
                           objs)
                         objs))
                     objs
                     [r1 r2 r3 r4])]
    objs))

(defn makeRectFromPoint [[x y] [w h]]
  [(- x w) (- y h) (+ x w) (+ y h)])