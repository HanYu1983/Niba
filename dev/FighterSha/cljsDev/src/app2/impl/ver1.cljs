
(ns app2.impl.ver1
  (:require [clojure.spec.alpha :as s]
            ["async" :as async]
            [app2.spec.protocol :as protocol]
            [app2.spec.app :as spec-app]
            [app2.spec.card :as spec-card]))

(defn assert-phase [app phase-step cb]
  (if (not= phase-step (get-in app spec-app/path-phase-step))
    (cb (js/Error. (str "phase must be " phase-step)))
    (cb nil app)))

(defmethod protocol/on-process-cmd :default [app plyr-id cmd cb]
  (cb (js/Error. (str "unknown cmd " cmd))))

(defmethod protocol/on-process-cmd :cmd-play-card [app plyr-id {costs :costs card-id :card-id} cb]
  (async/waterfall (array (async/constant app)
                          (fn [app cb]
                            (assert-phase app [:setting :body] cb))
                          (fn [app cb]
                            (cb nil app)))
                   cb))

(defmethod protocol/on-process-cmd :cmd-next-step [app plyr-id cmd cb]
  (cb nil (update-in app spec-app/path-tags (fn [origin]
                                              (conj origin [:tag-pass-step plyr-id])))))

(defmethod protocol/on-move-card :default [app card from to cb]
  (s/assert (s/tuple ::spec-app/app ::spec-card/card ::spec-card/card-stack-id ::spec-card/card-stack-id fn?)
            [app card from to cb])
  (println "on-move-card " card from to)
  (cb nil app))