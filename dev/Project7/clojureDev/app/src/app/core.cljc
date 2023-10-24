(ns app.core
  (:require [clojure.spec.alpha :as s]
            [clojure.spec.test.alpha :as stest]
            [clojure.core.async :as a]
            [clojure.core.match :refer [match]]
            [app.dynamic]))

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


;  （戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。
(def test-script-1 [{:id "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
                     :description "（戦闘フェイズ）〔２〕：このセットグループのユニットは、ターン終了時まで「速攻」を得る。"
                     :phase :battle-phase
                     :payment {"〔２〕" ['(fn [ctx] []) 2 {:player :you} '(fn [ctx selection] (rollG ctx selection))]}
                     :condition {"このセットグループのユニットは、"
                                 [[:and ["〔２〕"]]
                                  '(fn [ctx]
                                     (cut-in ctx {:id "effect-id"
                                                  :text {:id "ターン終了時まで「速攻」を得る。"
                                                         :description nil
                                                         :actions ['(fn [ctx]
                                                                      (update-memory ctx (runtime/get-card-id ctx) #(assoc % :activate-speed-attack 1)))
                                                                   '(fn [ctx]
                                                                      (add-text ctx {:id "ターン終了時まで"
                                                                                     :description nil
                                                                                     :events ['(fn [ctx]
                                                                                                 ; dissoc activate-speed-attack
                                                                                                 ctx)]}))]}}))]}
                     :effects ['(fn [ctx]
                                  (when (-> ctx (get-memory (runtime/get-card-id ctx)) :activate-speed-attack)
                                    [:speed-attack (runtime/get-card-id ctx)]))]}])

(def test-script-2 [{:id :ps-armor
                     :description "PS Armor"
                     :phase nil
                     :replace [{:description "出場時直立"
                                :events ['(fn [ctx runtime evt]
                                            (let [this-card-id (-> runtime :card-id option/get)
                                                  ctx (match evt
                                                        [:on-play-to-position (_ :guard #(= % this-card-id))] (reroll ctx this-card-id)
                                                        :else ctx)]
                                              ctx))]}
                               {:description "到戰區時下回合開始時回手, 但如果有和補給或供給組成部隊時不必回手"
                                :events ['(fn [ctx runtime evt]
                                            (let [this-card-id (-> runtime :card-id option/get)
                                                  ctx (match evt
                                                        [:on-enter-battle-area (_ :guard #(= % this-card-id))]
                                                        (update-memory ctx this-card-id #(assoc % :return-to-hand-by-psArmor 1))
                                                        :else ctx)]
                                              ctx))
                                         '(fn [ctx runtime evt]
                                            (match evt
                                              [:on-battle-group group-id]
                                              (let [this-card-id (-> runtime :card-id option/get)
                                                    group (-> ctx (get-group group-id))
                                                    ctx (if (and (-> group (contains? this-card-id))
                                                                 (-> group (contains-supply)))
                                                          (update-memory ctx this-card-id (dissoc % :return-to-hand-by-psArmor))
                                                          ctx)])
                                              :else ctx))
                                         '(fn [ctx runtime evt]
                                            (match evt
                                              [:on-turn-start]
                                              (let [this-card-id (-> runtime :card-id option/get)
                                                    ctx (if (-> ctx (get-memory this-card-id) :return-to-hand-by-psArmor nil? not)
                                                          (return-to-hand ctx this-card-id)
                                                          ctx)])
                                              :else ctx))]}]}])

; 『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。
(def test-script-3 [{:id "『起動』：自軍カードが、「ゲイン」の効果で戦闘修正を得た場合、そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                     :description nil
                     :phase nil
                     :events ['(fn [ctx runtime evt]
                                 (clojure.core.match/match evt
                                   [:on-gain {:battle-point battle-point}]
                                   (let [this-card-id (-> runtime :card-id)
                                         option-ids ["zaku" "gundam"]
                                         ctx (if (-> option-ids count pos?)
                                               (app.dynamic/cut-in ctx {:id "effect-id"
                                                                        :reason [:trigger-by-card-id this-card-id]
                                                                        :is-immediate true
                                                                        :clear-cut-in-status false
                                                                        :text {:id "そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                               :description nil
                                                                               :payments {"そのカードのセットグループ以外の自軍ユニット１枚は、ターン終了時まで、その戦闘修正と同じ値の戦闘修正を得る。"
                                                                                          [option-ids 1 nil `(fn [~'ctx ~'selection]
                                                                                                               (app.dynamic/add-text ~'ctx "text-id" {:events [(read-string (str "(fn [ctx runtime evt] 
                                                                                                                                                                        (match evt
                                                                                                                                                                        [:on-end-turn info]
                                                                                                                                                                        (app.dynamic/delete-text ctx \"text-id\")

                                                                                                                                                                        :else
                                                                                                                                                                        ctx))"))]
                                                                                                                                                      :effects [(read-string (str "(fn [ctx runtime] 
                                                                                                                                                                         (for [card-id " ~'selection "] [:add-battle-point card-id " ~battle-point " '(fn [ctx])]))"))
                                                                                                                                                                `(fn [~~''ctx ~~''runtime]
                                                                                                                                                                   (for [~~''card-id ~~'selection]
                                                                                                                                                                     [:add-battle-point ~~''card-id ~~battle-point `(fn [~~~'''ctx])]))
                                                                                                                                                                (list ~''fn [~''ctx ~''runtime]
                                                                                                                                                                      (list ~''for [~''card-id ~'selection]
                                                                                                                                                                            [:add-battle-point ~''card-id ~battle-point]))]}))]}}})
                                               ctx)]
                                     ctx)
                                   :else
                                   ctx))]}])

(defn test-script-eval []
  (let [effect (atom nil)
        added-text (atom nil)
        _ (binding [app.dynamic/cut-in (fn [ctx eff]
                                         (reset! effect eff)
                                         ctx)
                    app.dynamic/add-text (fn [ctx text-id text]
                                           (reset! added-text text)
                                           ctx)]
            (let [ctx {}
                  runtime {:card-id "gundam"}
                  script (-> test-script-3 str read-string first :events first)
                  _ (println script)
                  eventF (eval script)
                  _ (eventF ctx runtime [:on-gain {:battle-point [1 1 0]}])
                  [option-ids _ _ action-script] (-> @effect :text :payments first second)
                  _ (println "=============================")
                  _ (println (macroexpand action-script))
                  action-fn (eval action-script)
                  _ (action-fn ctx option-ids)
                  [effect-script & _] (-> @added-text :effects)
                  _ (println "=============================")
                  _ (println effect-script)
                  _ (println (macroexpand effect-script))
                  effect-fn (eval effect-script)
                  _ (println (effect-fn ctx runtime))]))]))

(defn -main [args]
  (test-script-eval)
  (.println System/out "結束"))