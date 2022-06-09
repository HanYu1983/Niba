(ns app2.ui
  (:require [clojure.spec.alpha :as s]
            ["async" :as a]))


(s/def ::menu-cursor int?)
(s/def ::menu-options (s/coll-of string?))
(s/def ::menu (s/keys :req-un [::menu-id ::menu-cursor ::menu-options]))

(s/def ::focus int?)
(s/def ::component (s/or :menu ::menu))
(s/def ::components (s/coll-of ::component))
(s/def ::page (s/keys :req-un [::components ::focus]))

(s/def ::lobby ::page)
(s/def ::current-page #{"lobby" "gameplay"})

(s/def ::ui (s/keys :req-un [::lobby ::current-page]))

(def ui {:lobby {:focus 0
                 :components []}
         :gameplay {:focus 0
                    :components [{:menu-id (gensym "menu")
                                  :menu-cursor 0
                                  :menu-options ["move"]}]}})


(defn assertx [f o msg]
  (when (not (s/valid? f o))
    (s/explain f o)
    (throw (js/Error. msg))))

(defn mailbox [f ctx]
  (let [atom-ctx (atom ctx)
        atom-queue (atom nil)
        queue (a/queue (fn [evt cb]
                         (f @atom-ctx evt #(.push @atom-queue %) (fn [err ctx]
                                                                   (if err
                                                                     (cb err)
                                                                     (do (reset! atom-ctx ctx)
                                                                         (cb)))))))
        _ (reset! atom-queue queue)]
    queue))

(defn update-ui [ctx evt dispatch cb]
  (println ctx evt)
  (cond
    (= "lobby" (:current-page ctx))
    (let [page (-> ctx :current-page keyword ctx)
          _ (assertx ::page page (str "找不到page:" (:current-page ctx)))
          com (get-in page [:components (:focus page)])
          _ (assertx ::component com (str "找不到component:" page))]
      (cb nil ctx))

    :else
    (cb nil ctx)))

(let [address (mailbox update-ui {:current-page "lobby"
                                  :lobby {:components []
                                          :focus 0}})
      _ (set! js/Model (js-obj "OnKeyDown" (fn [evt]
                                             (.push address (array [:click] [:click])))))])


(defn handle-menu [ui key focus cb]
  (let [atom-ui (atom ui)]
    (a/doUntil (fn [cb]
                 (cb nil false false @atom-ui))
               (fn [ui cancel tab cb]
                 (cb nil (or cancel tab)))
               cb)))

(defn start-page [ui key cb]
  (let [page (key ui)
        _ (assertx ::page page (str "找不到page:" key))
        com (get-in page [:components (:focus page)])
        _ (assertx ::component com (str "找不到component:" page))
        handler (fn [ui cb]
                  (cond
                    (s/valid? ::menu com)
                    (handle-menu ui key (:focus page) cb)
                    :else
                    (cb nil ui)))
        _ (handler ui cb)]))