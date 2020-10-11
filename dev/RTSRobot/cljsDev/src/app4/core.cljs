(ns app4.core
  (:require [clojure.spec.alpha :as s]
            ; https://clojure.github.io/test.check/cheatsheet.html
            [clojure.test.check.generators :as g])
  (:require [tool.stock.spec]
            [tool.stock.drawer]
            [tool.stock.tool]
            [tool.stock.formula]
            [tool.stock.formula-drawer :as fd]))

(s/check-asserts true)


(defn main []
  (let [rand-kline (g/let [d (g/return "")
                           v1 g/nat
                           v2 (g/choose 5 20)
                           v3 (g/choose 0 10)
                           v4 (g/choose 0 10)
                           v5 g/nat]
                     [d v1 v2 v3 v4 v5])
        kline (s/assert
               ::tool.stock.spec/kline
               (->> (repeatedly #(g/generate rand-kline))
                    (tool.stock.formula/nkline 3)
                    (take 40)))

        drawers `(~@(fd/data->drawer kline :kline)
                  ~@(fd/data->drawer kline [:uos 5 5 5 5])
                  ;~@(fd/data->drawer kline :clock)
                  )
        ;_ (println drawers)

        canvas (js/document.getElementById "canvas")
        _ (js/console.log canvas)
        canvas-w (.-width canvas)
        canvas-h (.-height canvas)
        _ (println canvas-w canvas-h)
        cavnas-ctx (-> canvas (.getContext "2d"))
        _ (tool.stock.drawer/draw {:drawers drawers} canvas-w canvas-h cavnas-ctx)]))

(main)
