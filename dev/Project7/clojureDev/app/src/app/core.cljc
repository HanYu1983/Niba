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


(defn http-call [url]
  (let [respCh (a/chan)
        errCh (a/chan)
        _ (a/go (try
                  (throw (Exception. (str "call " url " error")))
                  (a/>! respCh "OK")
                  (a/close! respCh)
                  (catch Throwable e
                    (a/>! errCh e)
                    (a/close! errCh)
                    (throw e))))]
    [respCh errCh]))

; https://brianmckenna.org/blog/cps_transform_js
(defn http-call2 [url callback]
  (a/go (try
          (throw (Exception. (str "call " url " error")))
          (callback nil "ok")
          (catch Throwable e
            (callback e nil)))))

; 展開要變成這樣
(fn [args callback]
  (http-call2 args
              (fn [err resp]
                (if err
                  (callback err nil)
                  (http-call2 resp (fn [err resp]
                                     (if err
                                       (callback err nil)
                                       (http-call2 resp (fn [err resp]
                                                          (if err
                                                            (callback err nil)
                                                            (callback nil resp)))))))))))

;
'(callback-let [resp (http-call2)])


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

(defn -main [args]
  (test-async)
  (println "end"))