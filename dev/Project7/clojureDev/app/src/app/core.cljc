(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.core.async :as a]))

(defn ranged-rand
  "Returns random int in range start <= rand < end"
  [start end]
  (+ start (long (rand (- end start)))))

(s/fdef ranged-rand
  :args (s/and (s/cat :start int? :end int?)
               #(< (:start %) (:end %)))
  :ret int?
  :fn (s/and #(>= (:ret %) (-> % :args :start))
             #(< (:ret %) (-> % :args :end))))

(defn test-spec []
  (ranged-rand 0 20)
  (println (s/exercise (-> `ranged-rand s/get-spec :args)))
  (println (s/exercise-fn `ranged-rand))
  #_(do (stest/instrument `ranged-rand)
        (ranged-rand 8 5))
  #_(do
      (println (stest/check `ranged-rand))
      (println (stest/check `ranged-rand))
      (println "end")))

(defn async-do []
  (a/go
    "OK"))

(defn http-agent []
  (let [in (a/chan)
        out (a/chan)
        _ (a/go-loop [state 0]
            (let [[ch errCh url] (a/<! in)
                  _ (println "call http" url)
                  _ (Thread/sleep 1000)
                  _ (try
                      (throw (Exception. (str "call " url " error")))
                      (a/>! ch (str "resp " url))
                      (catch Throwable e
                        (a/>! errCh e)))])
            (recur (inc state)))]
    [in out]))

(defn test-async []
  (let [[send-http resp-http] (http-agent)
        ch (a/merge [(a/go
                       (println "test-async-start")
                       (println (a/<! (async-do)))
                       (println "test-async-end")
                       "a")
                     (a/go
                       (Thread/sleep 3000)
                       (println "after 3s")
                       "b")
                     (a/go
                       (let [respCh (a/chan)
                             errCh (a/chan)
                             _ (a/>! send-http [respCh errCh "localhost:8080"])
                             [resp ch] (a/alts! [respCh errCh])
                             _ (condp = ch
                                 errCh
                                 (println (ex-message resp))
                                 respCh
                                 (println resp)
                                 (throw (Exception. "impossible")))
                             _ (for [c [respCh errCh]] (a/close! c))])
                       "c")])
        _ (println (a/<!! ch))
        _ (println "=====")
        _ (println (a/<!! ch))
        _ (println "=====")
        _ (println (a/<!! ch))]))


(defmacro waterfall [& exprs]
  "
   (waterfall (get-current-user) (get-user-info {:sort :money}))
   =>
   (fn* ([root-callback resp]
      (abc/get-current-user (fn [err resp]
                              (if err
                                (root-callback err nil)
                                (app.core/get-user-info (fn [err resp]
                                                          (if err
                                                            (root-callback err nil)
                                                            (root-callback nil resp)))
                                                        {:sort :money} resp)))
                            resp)))
   "
  (let [reverse-exprs (reverse exprs)
        [[first-expr-fn & first-expr-args] & rest-exprs] reverse-exprs
        callback-hell (reduce
                       (fn [prev-else [fn & args]]
                         (cons fn (cons (list 'fn '[err resp]
                                              (list 'if 'err
                                                    (list 'root-callback 'err 'nil)
                                                    prev-else))
                                        (seq (conj (vec args) 'resp)))))
                       (cons first-expr-fn (cons '(fn [err resp]
                                                    (if err
                                                      (root-callback err nil)
                                                      (root-callback nil resp)))
                                                 (seq (conj (vec first-expr-args) 'resp))))
                       rest-exprs)
        final-expr (list 'fn '[root-callback resp] callback-hell)]
    final-expr))



; https://brianmckenna.org/blog/cps_transform_js
(defn get-current-user [callback url]
  (callback nil url))

(defn get-user-info [callback option user-id]
  (callback nil (merge option {:user-id user-id :name "john"})))

(defn test-macro []
  (println (macroexpand `(waterfall (abc/get-current-user)
                                    (get-user-info {:sort :money}))))
  (let [waterfall-fn (waterfall (get-current-user)
                                ((fn [callback resp]
                                   (callback "err!!!" nil)))
                                (get-user-info {:sort :money}))
        _ (waterfall-fn (fn [err resp]
                          (println err resp))
                        "wow")]))

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

#_(defn callback-mapn [mapfs]
  (fn [callback]
    (let [counter (atom 0)
          mediator (fn [err [f resp]]
                     )
          _ (for [mapf mapfs]
              (mapf (fn [err resp]
                      (mediator err [mapf resp]))))])))

(defn test-callback-map []
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

(defn option-flatmap [mapf option]
  (if (nil? option)
    nil
    (mapf option)))

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


(defn test-either []
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


(def game-context {:animations []})

(defn query-command [ctx]
  [[:click-map-position]
   [:click-system-menu [:save :load :level-info]]
   [:system-command :process-ai-next-unit]
   [:system-command :wait-user-response {}]
   [:system-command :process-ai-final-step]
   [:load-animation]])

(defn handle-command [ctx cmd]
  (match cmd
    [:click-map-position]
    ctx
    
    [:system-command :process-ai-next-unit] 
    ctx))



(defn -main [args]
   
  (println "end"))