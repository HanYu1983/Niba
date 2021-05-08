(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            [app2.spec.gameplay :as spec-gameplay]
            [app2.spec.cmd :as spec-cmd]
            [app2.spec.card :as spec-card]
            ["async" :as async])
  (:require-macros [app2.core :refer [defnx]]))


(s/def ::app (s/keys :opt-un [::spec-gameplay/gameplay ::lobby]))
(def path-cards [:gameplay :desktop :cards])
(def path-phase-step [:gameplay :phase-step])
(def path-tags [:gameplay :tags])

(defmulti on-move-card (fn [app] (:ver app)))


(defnx move-card-2 [app ::app
                    card ::spec-card/card
                    card-stack-id ::spec-card/card-stack-id
                    next-card fn?
                    cb fn?]
  (let [[[from-card-stack-id _ :as card-id] _] card
        check-card-exist (fn [app cb]
                           (if-not (get-in app `[~@path-cards ~card-id])
                             (cb (js/Error. "card not exist"))
                             (cb nil app)))
        update-card-stack-id (fn [[[_ id] card-info] cb]
                               (cb nil [[card-stack-id id] card-info]))
        remove-and-append (fn [app card2 cb]
                            (cb nil (update-in app path-cards (fn [origin]
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
                                                              (on-move-card app card from-card-stack-id card-stack-id cb)))
                                                     cb)))
                           cb)]))

(defn move-card [app [card-id {from-card-stack-id :card-stack-id} :as card] card-stack-id next-card cb]
  (s/assert (s/tuple ::app ::spec-card/card ::spec-card/card-stack-id fn? fn?)
            [app card card-stack-id next-card cb])
  (let [check-card-exist (fn [app cb]
                           (if-not (get-in app `[~@path-cards ~card-id])
                             (cb (js/Error. "card not exist"))
                             (cb nil app)))
        update-card-stack-id (fn [[id card-info] cb]
                               (cb nil [id (assoc card-info :card-stack-id card-stack-id)]))
        remove-and-append (fn [app card2 cb]
                            (cb nil (update-in app path-cards (fn [origin]
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
                                                              (on-move-card app card from-card-stack-id card-stack-id cb)))
                                                     cb)))
                           cb)]))



(defn invoke-command [app plyr-id cmd cb]
  (s/assert (s/tuple ::app any? fn?)
            [app cmd cb])
  (let [assert-phase (fn [app phase-step cb]
                       (if (not= phase-step (get-in app path-phase-step))
                         (cb (js/Error. (str "phase must be " phase-step)))
                         (cb nil app)))
        process-play-card (fn [app {costs :costs card-id :card-id} cb]
                            (async/waterfall (array (async/constant app)
                                                    (fn [app cb]
                                                      (assert-phase app [:setting :body] cb))
                                                    (fn [app cb]
                                                      (cb nil app)))
                                             cb))
        process-next-step (fn [app cmd cb]
                            (cb nil (update-in app path-tags (fn [origin]
                                                               (conj origin [:tag-pass-step plyr-id])))))
        _ (async/waterfall (array (async/constant app)
                                  (fn [app cb]
                                    (cond
                                      (s/valid? ::spec-cmd/cmd-play-card cmd)
                                      (process-play-card app cmd cb)

                                      (s/valid? ::spec-cmd/cmd-next-step cmd)
                                      (process-next-step app cmd cb)

                                      :else
                                      (cb (js/Error. (str "unknown cmd:" cmd))))))
                           cb)]))

(defmethod on-move-card :default [app card from to cb]
  (s/assert (s/tuple ::app ::spec-card/card ::spec-card/card-stack-id ::spec-card/card-stack-id fn?)
            [app card from to cb])
  (println "on-move-card " card from to)
  (cb nil app))

(defn test-it []
  (let [_ (println (macroexpand '(defnx xxx [app ::app, x int?] (println x))))])

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
        _ (s/assert ::app app)
        _ (js/console.log (clj->js app))
        _ (move-card app card1 [:b :home]
                     (fn [[card-id card-info] cb]
                       (cb nil [card-id (assoc card-info :face :up)]))
                     (fn [err app]
                       (println err (s/assert ::app app))))
        equal-card-stack-id (fn [target-card-stack-id [_ {card-stack-id :card-stack-id}]]
                              (= target-card-stack-id card-stack-id))
        _ (println (filter (partial equal-card-stack-id [:b :home])
                           (get-in app path-cards)))
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

