(ns app2.alg
  (:require [clojure.spec.alpha :as s]
            [cljs.reader]
            ["async" :as async]
            [app2.spec.app :as spec-app]
            [app2.spec.gameplay :as spec-gameplay]
            [app2.spec.cmd :as spec-cmd]
            [app2.spec.card :as spec-card]
            [app2.spec.protocol :as protocol]
            [app2.impl.ver1]))

(defn equal-card-stack-id [target-card-stack-id [_ {card-stack-id :card-stack-id}]]
  (= target-card-stack-id card-stack-id))

(defn move-card [app [card-id {from-card-stack-id :card-stack-id} :as card] card-stack-id next-card cb]
  (s/assert (s/tuple ::spec-app/app ::spec-card/card ::spec-card/card-stack-id fn? fn?)
            [app card card-stack-id next-card cb])
  (let [check-card-exist (fn [app cb]
                           (if-not (get-in app `[~@spec-app/path-cards ~card-id])
                             (cb (js/Error. (str "card not exist " card)))
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
  (s/assert (s/tuple ::spec-app/app ::spec-cmd/cmd fn?)
            [app cmd cb])
  (async/waterfall (array (async/constant app)
                          (fn [app cb]
                            (protocol/on-process-cmd app plyr-id cmd cb)))
                   cb))