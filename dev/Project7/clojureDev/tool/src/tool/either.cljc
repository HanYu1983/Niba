(ns tool.either)


(defn either-map [mapf either]
  (let [[left right] either
        ret (cond
              left
              [left right]

              right
              [left (mapf right)]

              :else
              (throw (Exception. "must has one value")))]
    ret))

(defn either-flatmap [mapf either]
  (let [[left right] either
        ret (cond
              left
              [left right]

              right
              (mapf right)

              :else
              (throw (Exception. "must has one value")))]
    ret))


(defn test-all []
  (let [get-user-id-response [nil "john"]
        get-user-info-response (->> get-user-id-response
                                    (either-map (fn [resp] {:name resp}))
                                    (either-flatmap (fn [resp]
                                                      @(future
                                                         (Thread/sleep 1000)
                                                         [nil (merge resp {:http true})])))
                                    #_(either-flatmap (fn [resp] ["err!" nil]))
                                    (either-flatmap (fn [resp] [nil (merge resp {:age 18})])))
        _ (println get-user-info-response)
        ; shutdown future agent
        _ (shutdown-agents)]))