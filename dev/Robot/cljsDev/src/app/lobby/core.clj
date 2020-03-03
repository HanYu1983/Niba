(ns app.lobby.core)

(defmacro buyImpl [getter setter]
  `(let [[~'id {~'key "key"}] ~'args
         ~'item (get-in (~getter app.module/*module ~'lobbyCtx) [~'key])]
     (if ~'item
       (let [~'money (get-in ~'lobbyCtx app.lobby.model/money)
             ~'cost (get-in ~'item [:cost])
             ~'isEnoughMoney (>= ~'money ~'cost)]
         (if ~'isEnoughMoney
           (let [~'lobbyCtx (-> ~'lobbyCtx
                                (update-in app.lobby.model/money (constantly (- ~'money ~'cost)))
                                (update-in ~setter #(conj % [(str (cljs.core/random-uuid)) ~'key])))]
             (a/>! ~'outputCh ["ok" [~'id [nil ~'lobbyCtx]]])
             (recur (app.lobby.model/save ~'lobbyCtx)))
           (do
             (a/>! ~'outputCh ["ok" [~'id ["money is not enougth"]]])
             (recur ~'lobbyCtx))))
       (do
         (a/>! ~'outputCh ["ok" [~'id ["key is not found"]]])
         (recur ~'lobbyCtx)))))
