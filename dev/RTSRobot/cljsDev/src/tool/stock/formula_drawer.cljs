(ns tool.stock.formula-drawer
  (:require [clojure.spec.alpha :as s])
  (:require [tool.stock.spec]
            [tool.stock.drawer]
            [tool.stock.tool :as stl]
            [tool.stock.formula :as stf]))

(s/def ::volume #{:volume})
(s/def ::clock #{:clock})
(s/def ::kline #{:kline})

(s/def ::ma (s/cat :type #{:ma}
                   :args (s/* pos-int?)))

(s/def ::ema (s/cat :type #{:ema}
                    :args (s/* pos-int?)))

(s/def ::formula-drawer-data (s/or :kline ::kline
                                   :clock ::clock
                                   :volume ::volume
                                   :ma ::ma
                                   :ema ::ema))

(defn data->drawer [kline data]
  (s/assert ::tool.stock.spec/multi-kline kline)
  (s/assert
   ::tool.stock.drawer/drawers
   (when (s/valid? ::formula-drawer-data data)
     (let [[t data] (s/conform ::formula-drawer-data data)]
       (condp = t
         :ma
         (let [args (:args data)
               vs (stl/close kline)
               _ (println vs)]
           (map (fn [n]
                  {:type :line :line (reverse (stf/sma-seq n (reverse vs))) :color "#FF00FF"})
                args))

         :volume
         [{:type :line :line (stl/volume kline) :color "red"}
          {:type :grid :line (stl/volume kline) :color "#555" :hideY true}]


         :clock
         (let [{cs :sma z :z v-z :v-z} (stf/clock 10 kline)]
           [{:type :clock :cz z :vz v-z}])


         :kline
         [{:type :grid :kline kline :color "#555"}
          {:type :kline :kline kline}])))))

(defn jsobj->drawer-info [type sub kline]
  (s/assert #{:volume nil} type)
  (s/assert ::tool.stock.spec/multi-kline kline)
  (-> (map (fn [data]
             (let [subt (get data "t")
                   subd (get data "d")
                   vs
                   (condp = type
                     "volume" (stl/volume kline)
                     (stl/close kline))
                   gridColor "#555"
                   c4 "#FF00FF"
                   c3 "#0000FF"
                   c2 "#00FFFF"
                   c1 "#FFFF00"]
               (condp = subt
                 "ma"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       p (get subd "p")]
                   (cond->> '()
                     (> n 0) (cons {:type :line :line (reverse (stf/sma-seq n (reverse vs))) :color c1})
                     (> m 0) (cons {:type :line :line (reverse (stf/sma-seq m (reverse vs))) :color c2})
                     (> o 0) (cons {:type :line :line (reverse (stf/sma-seq o (reverse vs))) :color c3})
                     (> p 0) (cons {:type :line :line (reverse (stf/sma-seq p (reverse vs))) :color c4})))

                 "ema"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       p (get subd "p")]
                   (cond->> '()
                     (> n 0) (cons {:type :line :line (reverse (stf/ema-seq n (reverse vs))) :color c1})
                     (> m 0) (cons {:type :line :line (reverse (stf/ema-seq m (reverse vs))) :color c2})
                     (> o 0) (cons {:type :line :line (reverse (stf/ema-seq o (reverse vs))) :color c3})
                     (> p 0) (cons {:type :line :line (reverse (stf/ema-seq p (reverse vs))) :color c4})))

                 "bbi"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       p (get subd "p")]
                   [{:type :line :line (stf/BBI n m o p vs) :color c3}])


                 "ebbi"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       p (get subd "p")]
                   [{:type :line :line (stf/EBBI n m o p vs) :color c4}])


                 "yu-car"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       [dirs ranges] (reverse (stf/yu-car n m o (reverse kline)))
                       avg (stf/average (stl/mid kline))]
                   [{:type :line :line (map + (stl/mid kline) (reverse ranges)) :color c1 :offset -1}
                    {:type :line :line (map - (stl/mid kline) (reverse ranges)) :color c1 :offset -1}])


                 "yu-macd"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       ema (reverse (stf/ema-seq n (reverse vs)))
                       ebbi (stf/EBBI m (* m 2) (* m 4) (* m 8) vs)
                       dif (map - ema ebbi)]
                   [{:type :line :line dif :color c1}
                    {:type :line :line (reverse (stf/sma-seq o (reverse dif))) :color c2}
                    {:type :grid :line dif :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "yu-clock"
                 (let [n (get subd "n")
                       m (get subd "m")
                       vs (stf/sma-seq m (stf/yu-clock n (reverse kline)))]
                   [{:type :line :line (reverse vs) :color c1}
                    {:type :grid :line (reverse vs) :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "yu-sd"
                 (let [n (get subd "n")

                       group (take n kline)

                       vs
                       (stl/open group)

                  ; 每天和隔天的價差
                       offsets
                       (stf/offset-seq (reverse vs))

                  ; 價差的平均數
                       offsets-avg
                       (stf/average offsets)

                  ; 價差的標準差
                       sd
                       (stf/StandardDeviation offsets-avg offsets)

                       sd2
                       (* sd 2)]
                   [{:type :line :line (map (partial + offsets-avg) vs) :color c2 :offset -1}
                    {:type :line :line (map (partial + (+ sd2) offsets-avg) vs) :color c2 :offset -1}
                    {:type :line :line (map (partial + (- sd2) offsets-avg) vs) :color c2 :offset -1}])


                 "macd"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       dif (stf/macd-dif n m kline)]
                   [{:type :line :line dif :color c1}
                    {:type :line :line (reverse (stf/sma-seq o (reverse dif))) :color c2}
                    {:type :line :line (repeat (count kline) 0) :color "white"}
                    {:type :grid :line dif :centerY 0 :color gridColor}])


                 "kd"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       rsv (stf/rsv-seq n kline)
                       k (reverse (stf/sma-seq m (reverse rsv)))
                       d (reverse (stf/sma-seq o (reverse k)))]
                   [{:type :line :line k :color c1}
                    {:type :line :line d :color c2}
                    {:type :grid :line rsv :center 0.5 :color gridColor}
                    {:type :line :line (repeat (count kline) 0.5) :color "white"}])


                 "yu-kd"
                 (let [n (get subd "n")
                       h9 (stf/maxN-seq n #(apply max %) (stl/high kline))
                       l9 (stf/maxN-seq n #(apply min %) (stl/low kline))
                       c (stl/close kline)]
                   [{:type :line :line h9 :color c1}
                    {:type :line :line l9 :color c1}
                    {:type :line :line c :color c2}])


                 "Chaikin"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       vs
                       (stf/Chaikin n m kline)]
                   [{:type :line :line vs :color c1}
                    {:type :line :line (reverse (stf/sma-seq o (reverse vs))) :color c2}
                    {:type :grid :line vs :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "cv"
                 (let [n (get subd "n")
                       m (get subd "m")
                       rema
                       (->>
                        (map
                         -
                         (stf/maxN-seq n #(apply max %) (stl/high kline))
                         (stf/maxN-seq n #(apply min %) (stl/low kline)))
                        reverse
                        (stf/ema-seq 1)
                        reverse)
                       vs
                       (stf/volatility-seq m rema)]
                   [{:type :line :line vs :color c1}
                    {:type :grid :line vs :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "eom"
                 (let [n (get subd "n")
                       m (get subd "m")
                       vs (stf/EOM n kline)]
                   [{:type :line :line vs :color c1}
                    {:type :line :line (reverse (stf/sma-seq m (reverse vs))) :color c2}
                    {:type :grid :line vs :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "sar"
                 (let [n (get subd "n")
                       sar (reverse (stf/sar-seq n (reverse kline)))]
                   [{:type :line :line sar :color c1 :style :dot}])


                 "osc"
                 (let [n (get subd "n")
                       m (get subd "m")
                       line (stf/osc-seq n (stl/close kline))]
                   [{:type :line :line line :color c1}
                    {:type :line :line (reverse (stf/sma-seq m (reverse line))) :color c2}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "rsi"
                 (let [n (get subd "n")
                       m (get subd "m")
                       line (stf/rsi-seq n (stl/close (reverse kline)))]
                   [{:type :line :line (reverse line) :color c1}
                    {:type :line :line (reverse (stf/sma-seq m line)) :color c2}
                    {:type :grid :line (reverse line) :centerY 0.5 :color gridColor}
                    {:type :line :line (repeat (count kline) 0.5) :color "white"}])


                 "atr"
                 (let [n (get subd "n")
                       m (get subd "m")
                       line (stf/atr-seq n (reverse kline))
                       line2 (stf/sma-seq m line)
                       avg (stf/average line)]
                   [{:type :line :line (reverse line) :color c1}
                    {:type :line :line (reverse line2) :color c2}
                    {:type :grid :line (reverse line) :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "dmi"
                 (let [n (get subd "n")
                       m (get subd "m")
                       atr (stf/tr-seq (reverse kline))
                       dm (stf/dm-seq (reverse kline))
                       dip (map (fn [v v2] (if (pos? v) (/ v v2) 0)) dm atr)
                       did (map (fn [v v2] (if (neg? v) (/ (.abs js/Math v) v2) 0)) dm atr)
                       adip (stf/sma-seq n dip)
                       adid (stf/sma-seq n did)
                       dx
                       (map
                        (fn [v1 v2]
                          (if (zero? (+ v1 v2))
                            0
                            (/ (.abs js/Math (- v1 v2)) (+ v1 v2))))
                        adip
                        adid)]
                   [{:type :line :line (reverse adip) :color "red"}
                    {:type :line :line (reverse adid) :color "green"}
                    {:type :line :line (reverse (stf/sma-seq m dx)) :color c1}
                    {:type :grid :line (reverse (stf/sma-seq m dx)) :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "AccDist"
                 (let [n (get subd "n")
                       line (stf/AccDist (reverse kline))]
                   [{:type :line :line (reverse line) :color c1}
                    {:type :line :line (reverse (stf/sma-seq n line)) :color c2}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "cci"
                 (let [n (get subd "n")
                       line (stf/cci-seq n (reverse kline))]
                   [{:type :line :line (reverse line) :color c1}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "dpo"
                 (let [n (get subd "n")
                       line (stf/dpo-seq n kline)]
                   [{:type :line :line line :color c1}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "trix"
                 (let [n (get subd "n")
                       m (get subd "m")
                       line (stf/trix-seq n (stl/close kline))]
                   [{:type :line :line line :color c1}
                    {:type :line :line (reverse (stf/sma-seq m (reverse line))) :color c2}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 "uos"
                 (let [n (get subd "n")
                       m (get subd "m")
                       o (get subd "o")
                       p (get subd "p")
                       line (stf/uos-seq n m o (reverse kline))
                       ma (reverse (stf/sma-seq p line))
                       ma2 (reverse (stf/sma-seq p (reverse ma)))]
                   [{:type :line :line (reverse line) :color c1}
                    {:type :line :line ma :color c2}
                    {:type :line :line ma2 :color c3}
                    {:type :grid :line line :centerY 50 :color gridColor}
                    {:type :line :line (repeat (count kline) 50) :color "white"}])


                 "nkline"
                 (let [n (get subd "n")
                       kline
                       (->>
                        (stf/nkline n kline)
                        (take (int (/ (count kline) n))))]
                   [{:type :grid :kline kline :color gridColor}
                    {:type :kline :kline kline}])


                 "yu-money"
                 (let [n (get subd "n")
                       m (get subd "m")
                       line (stf/money-line n (stl/close kline))]
                   [{:type :line :line line :color c1}
                    {:type :line :line (reverse (stf/sma-seq m (reverse line))) :color c2}
                    {:type :grid :line line :centerY 0 :color gridColor}
                    {:type :line :line (repeat (count kline) 0) :color "white"}])


                 {:type nil})))
           sub)
      (flatten)))