(ns app.tool.event
  (:require ["rxjs" :as rxjs]
            ["rxjs/operators" :as rxop]
            [clojure.spec.alpha :as s]))

(s/def ::id string?)

(s/def :player/type #{:player})
(s/def :player/args (s/keys :req-un []))

(s/def :enemy/type #{:enemy})
(s/def :enemy/args any?)

(s/def ::on-create-args (s/or :player (s/keys :req-un [::id :player/type :player/args])
                              :enemy (s/keys :req-un [::id :enemy/type :enemy/args])))

(def on-create
  (let [sub (rxjs/Subject.)
        _ (.subscribe (.pipe sub
                             (rxop/tap (fn [e] (s/assert ::on-create-args e))))
                      (fn [e]
                        (println e))
                      (fn [err]
                        (println err)))]
    sub))

(def on-create-tank (rxjs/Subject.))
(def on-update-tank (rxjs/Subject.))
(def on-update-env (rxjs/Subject.))
(def on-key (rxjs/Subject.))
(def on-tick (rxjs/Subject.))

(s/def ::on-directive-args any?)

(def on-directive
  (let [sub (rxjs/Subject.)
        _ (.subscribe (.pipe sub
                             (rxop/tap (fn [e] (s/assert ::on-directive-args e))))
                      (fn [e]
                        (println e))
                      (fn [err]
                        (println err)))]
    sub))