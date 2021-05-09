(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            ["async" :as async]
            [app2.spec.app :as spec-app]
            [app2.alg :as alg]
            [app2.impl.ver1])
  (:require-macros [app2.core :refer [defnx]]))

(defn assert-spec [spec target cb]
  (if (not (s/valid? spec target))
    (cb (js/Error. (s/explain-str spec target)))
    (cb nil target)))

(defn test-move-card [cb]
  (let [card1 [0 {:face :down :proto-id 0 :card-stack-id [:a :home]}]
        app {:gameplay {:desktop {:cards (into {}
                                               [card1
                                                [1 {:face :down :proto-id 0 :card-stack-id [:b :home]}]])}
                        :phase-step [:setting :body]
                        :tags #{[:tag-pass-step :a]}}}
        equal-card-stack-id (fn [target-card-stack-id [_ {card-stack-id :card-stack-id}]]
                              (= target-card-stack-id card-stack-id))
        _ (async/waterfall (array (async/constant app)
                                  (partial assert-spec ::spec-app/app)
                                  (fn [app cb]
                                    (let [unknown-card [78798 {:face :down :proto-id 0 :card-stack-id [:a :home]}]]
                                      (alg/move-card app unknown-card [:b :home] (fn [card cb] (cb nil card))
                                                     (fn [err]
                                                       (if (not err)
                                                         (cb (js/Error. "移動不存在的卡必須吐出錯誤"))
                                                         (cb nil app))))))
                                  (fn [app cb]
                                    (let [cards-in-a-home (filter (partial equal-card-stack-id [:a :home])
                                                                  (get-in app spec-app/path-cards))
                                          cards-in-b-home (filter (partial equal-card-stack-id [:b :home])
                                                                  (get-in app spec-app/path-cards))]
                                      (cond
                                        (not= 1 (count cards-in-a-home))
                                        (cb (js/Error. "cards-in-a-home len must be 1"))
                                        (not= 1 (count cards-in-b-home))
                                        (cb (js/Error. "cards-in-b-home len must be 1"))
                                        :else
                                        (cb nil app))))
                                  (fn [app cb]
                                    (alg/move-card app card1 [:b :home]
                                                   (fn [[card-id card-info] cb]
                                                     (cb nil [card-id (assoc card-info :face :up)]))
                                                   cb))
                                  (fn [app cb]
                                    (let [cards-in-a-home (filter (partial equal-card-stack-id [:a :home])
                                                                  (get-in app spec-app/path-cards))
                                          cards-in-b-home (filter (partial equal-card-stack-id [:b :home])
                                                                  (get-in app spec-app/path-cards))]
                                      (cond
                                        (not= 0 (count cards-in-a-home))
                                        (cb (js/Error. "cards-in-a-home len must be 0"))
                                        (not= 2 (count cards-in-b-home))
                                        (cb (js/Error. "cards-in-b-home len must be 2"))
                                        :else
                                        (cb nil app))))
                                  (partial assert-spec ::spec-app/app))
                           cb)]))

(defn test-invoke-cmd-next-step [cb]
  (let [card1 [0 {:face :down :proto-id 0 :card-stack-id [:a :home]}]
        app {:gameplay {:desktop {:cards (into {}
                                               [card1
                                                [1 {:face :down :proto-id 0 :card-stack-id [:b :home]}]])}
                        :phase-step [:draw :before]
                        :tags #{[:tag-pass-step :a]}}}
        _ (async/waterfall (array (async/constant app)
                                  (partial assert-spec ::spec-app/app)
                                  (fn [app cb]
                                    (if (not= [:draw :before] (get-in app spec-app/path-phase-step))
                                      (cb (js/Error. "phase not right"))
                                      (cb nil app)))
                                  (fn [app cb]
                                    (alg/invoke-command app
                                                        :b
                                                        :cmd-next-step
                                                        cb))
                                  (fn [app cb]
                                    (if (not= [:draw :body] (get-in app spec-app/path-phase-step))
                                      (cb (js/Error. "step must be body"))
                                      (cb nil app)))
                                  (fn [app cb]
                                    (alg/invoke-command app
                                                        :a
                                                        :cmd-next-step
                                                        cb))
                                  (fn [app cb]
                                    (alg/invoke-command app
                                                        :b
                                                        :cmd-next-step
                                                        cb))
                                  (fn [app cb]
                                    (if (not= [:draw :after] (get-in app spec-app/path-phase-step))
                                      (cb (js/Error. "step must be after"))
                                      (cb nil app)))
                                  (fn [app cb]
                                    (alg/invoke-command app
                                                        :a
                                                        :cmd-next-step
                                                        cb))
                                  (fn [app cb]
                                    (alg/invoke-command app
                                                        :b
                                                        :cmd-next-step
                                                        cb))
                                  (fn [app cb]
                                    (if (not= [:setting :before] (get-in app spec-app/path-phase-step))
                                      (cb (js/Error. "phase-step must be [setting before]"))
                                      (cb nil app)))
                                  (partial assert-spec ::spec-app/app))
                           cb)]))

(defn test-all []
  (s/check-asserts true)
  (async/series (array test-move-card
                       test-invoke-cmd-next-step)
                (fn [err]
                  (when err
                    (throw err)))))

(test-all)

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
        _ (alg/move-card app card1 [:b :home]
                         (fn [[card-id card-info] cb]
                           (cb nil [card-id (assoc card-info :face :up)]))
                         (fn [err app]
                           (println err (s/assert ::spec-app/app app))))
        equal-card-stack-id (fn [target-card-stack-id [_ {card-stack-id :card-stack-id}]]
                              (= target-card-stack-id card-stack-id))
        _ (println (filter (partial equal-card-stack-id [:b :home])
                           (get-in app spec-app/path-cards)))
        _ (alg/invoke-command app
                              :a
                              {:costs [[:color 0] [:tap 2]]
                               :card-id 0
                               :player-id :a}
                              (fn [err app]
                                (println err app)))

        _ (alg/invoke-command app
                              :b
                              :cmd-next-step
                              (fn [err app]
                                (println err app)))]))



