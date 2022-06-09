
(ns app2.impl.ver1
  (:require [clojure.spec.alpha :as s]
            ["async" :as async]
            [clojure.set]
            [app2.spec.protocol :as protocol]
            [app2.spec.app :as spec-app]
            [app2.spec.card :as spec-card]
            [app2.spec.gameplay :as spec-gameplay]
            [app2.alg :as alg]))

(defn assert-phase [app phase-step cb]
  (if (not= phase-step (get-in app spec-app/path-phase-step))
    (cb (js/Error. (str "phase must be " phase-step)))
    (cb nil app)))

(defmethod protocol/on-process-cmd :default [app plyr-id cmd cb]
  (cb (js/Error. (str "unknown cmd " cmd))))

(defmethod protocol/on-process-cmd :cmd-play-card [app plyr-id [_ card-id costs] cb]
  (async/waterfall (array (async/constant app)
                          (fn [app cb]
                            (if (not (get-in app `[~@spec-app/path-cards ~card-id]))
                              (cb (js/Error. (str "card not found " card-id)))
                              (cb nil app)))
                          (fn [app cb]
                            (let [card-info (get-in app `[~@spec-app/path-cards ~card-id])]
                              (alg/move-card app [card-id card-info] [plyr-id :unit] (fn [card cb] (cb nil card)) cb))))
                   cb))

(defmethod protocol/on-process-cmd :cmd-next-step [app plyr-id cmd cb]
  (let [app (update-in app spec-app/path-tags (fn [origin]
                                                (conj origin [:tag-pass-step plyr-id])))
        all-pass-tags #{[:tag-pass-step :a] [:tag-pass-step :b]}]
    (cond
      (every? (get-in app spec-app/path-tags) all-pass-tags)
      (let [[phase step] (get-in app spec-app/path-phase-step)]
        (cond
          (= :after step)
          (cb nil (-> app
                      (assoc-in spec-app/path-phase-step [(spec-gameplay/next-phase-mapping phase) (spec-gameplay/next-step-mapping step)])
                      (update-in spec-app/path-tags #(clojure.set/difference % all-pass-tags))))
          :else
          (cb nil (-> app
                      (assoc-in spec-app/path-phase-step [phase (spec-gameplay/next-step-mapping step)])
                      (update-in spec-app/path-tags #(clojure.set/difference % all-pass-tags))))))
      :else
      (cb nil app))))

(defmethod protocol/on-move-card :default [app card from to cb]
  (s/assert (s/tuple ::spec-app/app ::spec-card/card ::spec-card/card-stack-id ::spec-card/card-stack-id fn?)
            [app card from to cb])
  (println "on-move-card " card from to)
  (cb nil app))