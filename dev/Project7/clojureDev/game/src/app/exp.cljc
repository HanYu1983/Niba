(ns app.exp
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.core.async :as a]
            [clojure.core.match :refer [match]]
            [app.dynamic]
            [app.text]))

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


; https://brianmckenna.org/blog/cps_transform_js
(defn get-current-user [callback url]
  (callback nil url))

(defn get-user-info [callback option user-id]
  (callback nil (merge option {:user-id user-id :name "john"})))


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



(def simple-data '(fn [ctx]
                    `(fn [~'args]
                       (println ~(:age ctx) ~'args))))

(defn test-psArmor []
  (let [str (str simple-data)
        psArmor (read-string str)
        _ (println psArmor)
        _ (println "====")
        psArmorEval (eval psArmor)
        _ (println psArmorEval)
        _ (println "====")
        psArmorSub (psArmorEval {:age 30})
        _ (println psArmorSub)
        _ (println "====")
        psArmorSubEval (eval psArmorSub)
        _ (println psArmorSubEval)
        _ (println "====")
        _ (psArmorSubEval "gan")]))
