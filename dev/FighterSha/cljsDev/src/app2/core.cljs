(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            ["async" :as async]
            [app2.spec.app :as spec-app]
            [app2.spec.gameplay :as spec-gameplay]
            [app2.spec.cmd :as spec-cmd]
            [app2.spec.card :as spec-card]
            [app2.spec.protocol :as protocol]
            [app2.impl.ver1])
  (:require-macros [app2.core :refer [defnx]]))


(defn move-card [app [card-id {from-card-stack-id :card-stack-id} :as card] card-stack-id next-card cb]
  (s/assert (s/tuple ::spec-app/app ::spec-card/card ::spec-card/card-stack-id fn? fn?)
            [app card card-stack-id next-card cb])
  (let [check-card-exist (fn [app cb]
                           (if-not (get-in app `[~@spec-app/path-cards ~card-id])
                             (cb (js/Error. "card not exist"))
                             (cb nil app)))
        update-card-stack-id (fn [[id card-info] cb]
                               (cb nil [id (assoc card-info :card-stack-id card-stack-id)]))
        remove-and-append (fn [app card2 cb]
                            (cb nil (update-in app spec-app/path-cards (fn [origin]
                                                                         (-> origin
                                                                             (dissoc card-id)
                                                                             (conj card2))))
                                card2))
        _ (async/waterfall (array (async/constant app)
                                  check-card-exist
                                  (fn [app cb]
                                    (async/waterfall (array #(next-card card %)
                                                            update-card-stack-id
                                                            (fn [card cb]
                                                              (remove-and-append app card cb))
                                                            (fn [app card cb]
                                                              (protocol/on-move-card app card from-card-stack-id card-stack-id cb)))
                                                     cb)))
                           cb)]))

(defn invoke-command [app plyr-id cmd cb]
  (s/assert (s/tuple ::spec-app/app any? fn?)
            [app cmd cb])
  (let [_ (async/waterfall (array (async/constant app)
                                  (fn [app cb]
                                    (protocol/on-process-cmd app plyr-id cmd cb)))
                           cb)]))


(defn test-it []
  #_(let [_ (println (macroexpand '(defnx xxx [app ::app, x int?] (println x))))])

  #_(let [step1 {((comp keyword str) [0 "xx"]) "abc"
                 ((comp keyword str) {:id 0 :name 2}) "cc"}
          _ (println step1)
          step2 (clj->js step1)
          step3 (js->clj step2 :keywordize-keys true)
          _ (println step3)
          _ (println (get step3 (keyword (str [0 2]))))])

  #_(let [step1 {[0 "xx"] "abc"
                 {:id 0 :name 2} "cc"}
          _ (println step1)
          step2 (str step1)
          step3 (cljs.reader/read-string step2)
          _ (println step3)
          _ (println (get step3 [0 "xx"]))
          _ (js/console.log (clj->js step3))])

  #_(let [step1 {:b 0 :e 1 :c 1}
          _ (println (into [] (into {} (cons [:x 0] step1))))
          _ (println (into [] (assoc step1 :b 3)))
          _ (println (into [] (conj (dissoc step1 :b) [:b 2])))
          _ (println (into [] (cons [:a 0] (dissoc step1 :b))))
          step2 (str step1)
          _ (println step2)
          step3 (cljs.reader/read-string step2)
          _ (println step3)
          _ (println (into [] (assoc (dissoc step3 :b) :b 2)))])

  (let [_ (s/check-asserts true)
        card1 [0 {:face :down :proto-id 0 :card-stack-id [:a :home]}]
        app {:gameplay {:desktop {:cards (into {}
                                               [card1
                                                [1 {:face :down :proto-id 0 :card-stack-id [:b :home]}]])}
                        :phase-step [:setting :body]
                        :tags #{[:tag-pass-step :a]}}}
        _ (println app)
        _ (s/assert ::spec-app/app app)
        _ (js/console.log (clj->js app))
        _ (move-card app card1 [:b :home]
                     (fn [[card-id card-info] cb]
                       (cb nil [card-id (assoc card-info :face :up)]))
                     (fn [err app]
                       (println err (s/assert ::spec-app/app app))))
        equal-card-stack-id (fn [target-card-stack-id [_ {card-stack-id :card-stack-id}]]
                              (= target-card-stack-id card-stack-id))
        _ (println (filter (partial equal-card-stack-id [:b :home])
                           (get-in app spec-app/path-cards)))
        _ (invoke-command app
                          :a
                          {:costs [[:color 0] [:tap 2]]
                           :card-id 0
                           :player-id :a}
                          (fn [err app]
                            (println err app)))

        _ (invoke-command app
                          :b
                          :cmd-next-step
                          (fn [err app]
                            (println err app)))]))

(test-it)

