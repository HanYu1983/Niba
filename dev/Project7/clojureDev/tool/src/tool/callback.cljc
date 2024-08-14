(ns tool.callback)

(defn callback-map [mapf callback]
  (let [next-callback  (fn [cb]
                         (callback (fn [err resp]
                                     (if err
                                       (cb err nil)
                                       (cb nil (mapf resp))))))]
    next-callback))

(defn callback-flatmap [mapf callback]
  (let [next-callback  (fn [cb]
                         (callback (fn [err resp]
                                     (if err
                                       (cb err nil)
                                       ((mapf resp) cb)))))]
    next-callback))

(defn test-all []
  (let [call1 (fn [cb]
                (cb nil "call1"))
        call2 (callback-map #(str % "OK") call1)
        call3 (callback-flatmap (fn [resp]
                                  (fn [cb]
                                    (cb nil (str resp "OK"))))
                                call2)
        call4 (->> call1
                   (callback-map #(str % "call2"))
                   (callback-flatmap (fn [resp]
                                       (fn [cb]
                                         (cb nil (str resp "call3")))))
                   #_(callback-flatmap (fn [resp]
                                         (fn [cb]
                                           (cb "err!" nil))))
                   (callback-map #(str % "call4")))
        _ (call2 (fn [err resp] (println err resp)))
        _ (call3 (fn [err resp] (println err resp)))
        _ (call4 (fn [err resp] (println err resp)))]))