(ns app.core
  (:require [clojure.test.check.generators :as g]
            [app.model :refer [model sell buy]]))

(defn if-fn [ifn body else ctx]
  (if (ifn ctx)
    (body ctx)
    (else ctx)))

(defn make-ma [n line]
  (->> (partition n 1 line)
       (map (comp #(/ % n) #(apply + %)))))

(defn make-offset [n line]
  (map - line (drop n line)))

(defn make-slope [line]
  (let [offset (make-offset 1 line)
        slope (map / offset line)]
    slope))

(defn make-bias [n line]
  (let [ma-n-line (make-ma n line)
        sub-line (map - line ma-n-line)
        final-line (map / sub-line ma-n-line)]
    final-line))

(defn make-rsv [n line]
  (let [n-line (partition n 1 line)
        min-line (map #(apply min %) n-line)
        max-line (map #(apply max %) n-line)
        today-line (map first n-line)
        a (map - today-line min-line)
        b (map - max-line min-line)
        rsv (map / a b)]
    rsv))

(defn make-kd [n line]
  (let [rsv (make-rsv n line)
        k (->> rsv reverse
               (reductions #(+ (* %1 (/ 2 3)) (* %2 (/ 1 3))) 0)
               rest)
        d (->> k
               (reductions #(+ (* %1 (/ 2 3)) (* %2 (/ 1 3))) 0)
               rest)]
    (map reverse [k d])))






(defn action [ctx [label price ma5 ma10 ma5-slope ma10-slope bias]]
  (let [map-offset (fn [ctx]
                     (let [old-price (:stock ctx)
                           offset (-> (- price old-price)
                                      (/ old-price))]
                       offset))
        doSell (partial if-fn (comp #(or (< % -0.07)
                                         (> % 0.14))
                                    map-offset)
                        #(sell % price)
                        identity)
        doBuy (partial if-fn (constantly true)
                       #(buy % price)
                       identity)
        doIt (partial if-fn :stock doSell doBuy)
        ctx (doIt ctx)]
    ctx))

(defn action2 [ctx [label price ma5 ma10 ma5-slope ma10-slope bias]]
  (let [map-offset (fn [ctx]
                     (let [old-price (:stock ctx)
                           offset (-> (- price old-price)
                                      (/ old-price))]
                       offset))
        doSell (partial if-fn (comp #(or (< % -0.07)
                                         (> % 0.14))
                                    map-offset)
                        #(do
                           (println label ")")
                           (sell % price))
                        identity)
        doBuy (partial if-fn (constantly true)
                       #(do
                          (println label ")")
                          (buy % price))
                       identity)
        doBuy (partial if-fn #(and
                               (> price ma5 ma10)
                               (< (js/Math.abs bias) 0.1)
                               (every? pos? [ma5-slope ma10-slope]))
                       doBuy identity)
        doIt (partial if-fn :stock doSell doBuy)

        ctx (doIt ctx)]
    ctx))

(defn action3 [ctx [label price k d k-slope d-slope]]
  (let [map-offset (fn [ctx]
                     (let [old-price (:stock ctx)
                           offset (-> (- price old-price)
                                      (/ old-price))]
                       offset))
        doSell (partial if-fn (comp #(or (< % -0.07)
                                         (> % 0.07))
                                    map-offset)
                        #(do
                           (println label ")")
                           (sell % price))
                        identity)
        doBuy (partial if-fn (constantly true)
                       #(do
                          (println label ")")
                          (buy % price))
                       identity)
        doBuy (partial if-fn #(and
                               (> k d)
                               (< k 0.8)
                               (every? pos? [k-slope d-slope]))
                       doBuy identity)
        doIt (partial if-fn :stock doSell doBuy)

        ctx (doIt ctx)]
    ctx))

(defn draw-chart-test []
  (let [updown (->> (g/sample (g/choose -7 7) 200)
                    (map #(/ % 100)))
        line (reductions #(+ %1 (* %1 %2)) 10 updown)

        table (map vector (range) line)

        _ (js/drawChart (clj->js ["x" "y"]) (clj->js table))]))




#_(let [updown (->> (g/sample (g/choose -7 7) 100)
                    (map #(/ % 100)))
        line (->> (reductions #(+ %1 (* %1 %2)) 1 updown)
                  reverse)
      ;_ (println line)

        n 5

        ma5-line (make-ma n line)
      ;_ (println ma5-line)

        ma5-slope-line (make-slope ma5-line)
      ;_ (println ma5-slope-line)

        ma10-line (make-ma 10 line)
      ;_ (println ma10-line)

        ma10-slope-line (make-slope ma10-line)
      ;_ (println ma10-slope-line)

        bias-line (make-bias n line)

        info (->> (map vector line ma5-line ma10-line ma5-slope-line ma10-slope-line bias-line)
                  reverse
                  (map #(cons %1 %2) (range)))
      ;_ (println info)

        _ (js/drawChart (clj->js ["n" "price" "ma5" "ma10" "ma5sl" "ma10sl" "bias"])
                        (clj->js info))

        _ (println (reduce action2 model info))
        _ (println "===========")
        _ (println (reduce action model info))])

(let [updown (->> (g/sample (g/choose -7 7) 100)
                  (map #(/ % 100)))
      line (->> (reductions #(+ %1 (* %1 %2)) 1 updown)
                reverse)
      [k-line d-line] (make-kd 9 line)
      [k-slope-line d-slope-line] (map make-slope [k-line d-line])
      info (map vector (range) line k-line d-line k-slope-line d-slope-line)
      _ (js/drawChart "curve_chart_1"
                      (clj->js ["n" "line" "k" "d" "k-slope" "d-slope"])
                      (clj->js info))
      _ (println (reduce action3 model (reverse info)))
      _ (println "===========")
      _ (println (reduce action model (reverse info)))])