(ns app2.spec.protocol
  (:require [clojure.spec.alpha :as s]
            [app2.spec.cmd :as spec-cmd]))

(defmulti on-move-card identity)
(defmulti on-phase-step identity)

(defmulti on-process-cmd (fn [app plyr-id cmd]
                           (let [conform (s/conform ::spec-cmd/cmd cmd)]
                             (if (= :s/invalid conform)
                               :default
                               (let [[type] conform]
                                 type)))))