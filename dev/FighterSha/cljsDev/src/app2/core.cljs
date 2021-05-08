(ns app2.core
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            [app2.spec.gameplay :as gameplay]
            [app2.spec.cmd :as spec-cmd]
            ["async" :as async]))


(s/def ::app (s/keys :opt-un [::gameplay/gameplay ::lobby]))


(defmulti on-move-card (fn [app] (:ver app)))

(defn move-card [app card from to next-card cb]
  (let [check-card-exist (fn [app cb]
                           (if-not (some #(= card %) (get-in app [:gameplay :desktop :card-stacks from]))
                             (cb (js/Error. "card not exist"))
                             (cb nil app)))
        process (fn [app cb]
                  (async/waterfall (array #(next-card card %)
                                          (fn [card2 cb]
                                            (cb nil (update-in app [:gameplay :desktop :card-stacks] (fn [origin]
                                                                                                       (-> origin
                                                                                                           (update from (fn [cards]
                                                                                                                          (filter #(not= card %) cards)))
                                                                                                           (update to (fn [cards]
                                                                                                                        (conj cards card2)))))))))
                                   cb))
        exec (async/compose #(on-move-card %1 card from to %2) process check-card-exist)
        _ (exec app cb)]))


(defmethod on-move-card :default [app card from to cb]
  (println "on-move-card " card from to)
  (cb nil app))

(defn move-card-2 [app [card-id _ :as card] card-stack-id next-card cb]
  (let [check-card-exist (fn [app cb]
                           (if-not (get-in app [:gameplay :desktop :cards card-id])
                             (cb (js/Error. "card not exist"))
                             (cb nil app)))
        update-card-stack-id (fn [[[_ id] card-info] cb]
                               (cb nil [[card-stack-id id] card-info]))
        remove-and-append (fn [app card2 cb]
                            (cb nil (update-in app [:gameplay :desktop :cards] (fn [origin]
                                                                                 (-> origin
                                                                                     (dissoc card-id)
                                                                                     (conj card2))))))
        _ (async/waterfall (array (async/constant app)
                                  check-card-exist
                                  (fn [app cb]
                                    (async/waterfall (array #(next-card card %)
                                                            update-card-stack-id
                                                            #(remove-and-append app %1 %2))
                                                     cb)))
                           cb)]))



(defn invoke-command [app cmd cb]
  (let [assert-cmd (fn [app cb]
                     (if (s/valid? ::spec-cmd/cmd cmd)
                       (cb nil app)
                       (cb (js/Error. (s/explain-str ::spec-cmd/cmd cmd)))))
        assert-phase (fn [app phase-step cb]
                       (if (not= phase-step (get-in app [:gameplay :phase-step]))
                         (cb (js/Error. (str "phase must be " phase-step)))
                         (cb nil app)))
        process-play-card (fn [app {costs :costs card-id :card-id player-id :player-id} cb]
                            (async/waterfall (array (async/constant app)
                                                    #(assert-phase %1 [:setting :body] %2)
                                                    (fn [app cb]
                                                      (cb nil app)))
                                             cb))
        process (fn [app cb]
                  (let [[conform-type] (s/conform ::spec-cmd/cmd cmd)
                        _ (println conform-type)
                        _ (condp = conform-type
                            :play-card
                            (process-play-card app cmd cb)
                            (cb nil app))]))

        _ (async/waterfall (array (async/constant app)
                                  assert-cmd
                                  process)
                           cb)]))

(defn main []
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
        card1 [[[:a :home] 0] {:face :down :proto-id 0}]
        app {:gameplay {:desktop {:cards (into {}
                                               [card1
                                                [[[:b :home] 1] {:face :down :proto-id 0}]])}
                        :phase-step [:setting :body]}}
        _ (println app)
        _ (s/assert ::app app)
        _ (js/console.log (clj->js app))
        _ (move-card-2 app card1 [:b :home]
                       (fn [[card-id card-info] cb]
                         (cb nil [card-id (assoc card-info :face :up)]))
                       (fn [err app]
                         (println err (s/assert ::app app))))
        equal-card-stack-id (fn [target-card-stack-id [[card-stack-id _] _]]
                              (= target-card-stack-id card-stack-id))
        _ (println (filter (partial equal-card-stack-id [:b :home])
                           (get-in app [:gameplay :desktop :cards])))
        #__ #_(invoke-command app
                              {:costs [[:color 0] [:tap 2]]
                               :card-id 0
                               :player-id :a}
                              (fn [err app]
                                (println err app)))]))

(main)

