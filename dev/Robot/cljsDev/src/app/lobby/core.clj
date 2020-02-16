(ns app.lobby.core)

(defmacro defbuy [name]
  (let [selectKey (keyword (str "select" (clojure.string/capitalize (str name))))]
    `(defn ~name [~'lobbyCtx ~'args ~'inputCh ~'outputCh]
       (a/go
         (loop [~'lobbyCtx ~'lobbyCtx]
           (let [[~'cmd ~'args] (a/<! ~'inputCh)]
             (cond
               (= "KEY_DOWN" ~'cmd)
               (let [~'action (actions ~'args)]
                 (cond
                   (= ~'action :up)
                   (update-in ~'lobbyCtx [:state ~selectKey] dec)

                   (= ~'action :down)
                   (update-in ~'lobbyCtx [:state ~selectKey] inc)

                   (= ~'action :cancel)
                   [~'lobbyCtx :lobby]

                   :else
                   (recur ~'lobbyCtx)))

               :else
               (recur ~'lobbyCtx))))))))