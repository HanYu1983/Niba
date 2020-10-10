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
               (repeat 10 ["" 0 0 0 0 0]))
        drawer (fd/data->drawer kline [:ma 2 4])
        _ (println drawer)

        drawer (fd/data->drawer kline :kline)
        _ (println drawer)

        drawer (fd/data->drawer kline :volume)
        _ (println drawer)

        drawer (fd/data->drawer kline :clock)
        _ (println drawer)]))

(main)
