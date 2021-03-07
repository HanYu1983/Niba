(ns app.model)

(def model {:stock nil :money 0})

(defn buy [ctx price]
  (println "buy:" price)
  (if (:stock ctx)
    (throw (js/Error. "you can not buy"))
    (assoc ctx :stock price)))

(defn sell [ctx price]
  (println "sell:" (:stock ctx) "->" price "(" (/ (- price (:stock ctx)) (:stock ctx)) "%)")
  (if (nil? (:stock ctx))
    (throw (js/Error. "you can not sell"))
    (let [earn (- price (:stock ctx))]
      (merge ctx {:stock nil
                  :money (+ (:money ctx) earn)}))))