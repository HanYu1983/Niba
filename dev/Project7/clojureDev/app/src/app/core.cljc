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

(defn -main [args]
  (test-macro)
  (println "end"))