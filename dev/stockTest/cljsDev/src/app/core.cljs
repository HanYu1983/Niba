(ns app.core
  (:require [clojure.test.check.generators :as g]
            [app.model :refer [model sell buy]]))

(defn if-fn [ifn body else ctx]
  (if (ifn ctx)
    (body ctx)
    (else ctx)))

(defn make-ma [n line]
  (->> (partition n 1 line)
       (map (comp #(/ % n) (partial apply +)))))

(defn make-offset [n line]
  (map - (drop n line) line))

(defn make-slope [line]
  (let [offset (make-offset 1 line)
        slope (map / offset line)]
    slope))

(defn make-bias [n line]
  (let [ma-n-line (make-ma n line)
        sub-line (->> (apply map vector (map reverse [line ma-n-line]))
                      reverse
                      (map #(apply - %)))
        final-line (map / sub-line ma-n-line)]
    final-line))

(defn make-rsv [n line]
  (let [n-line (partition n 1 line)
        min-line (map #(apply min %) n-line)
        max-line (map #(apply max %) n-line)
        today-line (map first n-line)
        a (map - today-line min-line)
        b (map - max-line min-line)
        rsv (map (comp #(* % 100) /) a b)]
    rsv))

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

(defn draw-chart-test []
  (let [updown (->> (g/sample (g/choose -7 7) 200)
                    (map #(/ % 100)))
        line (reductions #(+ %1 (* %1 %2)) 10 updown)

        table (map vector (range) line)

        _ (js/drawChart (clj->js ["x" "y"]) (clj->js table))]))

(let [updown (->> (g/sample (g/choose -7 7) 100)
                  (map #(/ % 100)))
      line (reductions #(+ %1 (* %1 %2)) 1 updown)
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

      info (->> (apply map vector (map reverse [line ma5-line ma10-line ma5-slope-line ma10-slope-line bias-line]))
                reverse
                (map #(cons %1 %2) (range)))
      ;_ (println info)

      _ (js/drawChart (clj->js ["n" "price" "ma5" "ma10" "ma5sl" "ma10sl" "bias"])
                      (clj->js info))

      _ (println (reduce action2 model info))
      _ (println "===========")
      _ (println (reduce action model info))])