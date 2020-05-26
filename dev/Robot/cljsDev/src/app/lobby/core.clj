(ns app.lobby.core)

(defmacro buyImpl [getter setter]
  `(let [[~'id {~'key "key"}] ~'args
         ~'key (keyword ~'key)
         ~'item (get-in (~getter app.module/*module ~'lobbyCtx) [~'key])]
     (if ~'item
       (let [~'money (get-in ~'lobbyCtx [:money])
             ~'cost (get-in ~'item [:cost])
             ~'isEnoughMoney (>= ~'money ~'cost)]
         (if ~'isEnoughMoney
           (let [~'lobbyCtx (-> ~'lobbyCtx
                                (update-in [:money] (constantly (- ~'money ~'cost)))
                                (update-in ~setter #(conj % [(keyword (str (cljs.core/random-uuid))) ~'key])))]
             (a/>! ~'outputCh ["ok" [~'id [nil ~'lobbyCtx]]])
             (recur (app.lobby.model/save ~'lobbyCtx)))
           (do
             (a/>! ~'outputCh ["ok" [~'id ["money is not enougth"]]])
             (recur ~'lobbyCtx))))
       (do
         (a/>! ~'outputCh ["ok" [~'id ["key is not found"]]])
         (recur ~'lobbyCtx)))))
