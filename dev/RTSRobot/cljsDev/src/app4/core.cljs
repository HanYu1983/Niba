(ns app4.core
  (:require [clojure.spec.alpha :as s])
  (:require [tool.stock.spec]
            [tool.stock.drawer]
            [tool.stock.tool]
            [tool.stock.formula]
            [tool.stock.formula-drawer :as fd]))

(s/check-asserts true)


(defn main []
  (let [kline (s/assert
               ::tool.stock.spec/kline
               (->> (repeatedly (fn []
                                  ["" (rand-int 5) (rand-int 10) (rand-int 0) (rand-int 5) (rand-int 10)]))
                    (tool.stock.formula/nkline 3)
                    (take 40)))

        drawers `(~@(fd/data->drawer kline :kline)
                  ~@(fd/data->drawer kline [:uos 5 5 5 5])
                  ;~@(fd/data->drawer kline :clock)
                  )
        _ (println drawers)

        canvas (js/document.getElementById "canvas")
        _ (js/console.log canvas)
        canvas-w (.-width canvas)
        canvas-h (.-height canvas)
        _ (println canvas-w canvas-h)
        cavnas-ctx (-> canvas (.getContext "2d"))
        _ (tool.stock.drawer/draw {:drawers drawers} canvas-w canvas-h cavnas-ctx)]))

(main)
