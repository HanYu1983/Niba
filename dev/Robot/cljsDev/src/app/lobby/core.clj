(ns app.lobby.core
  (:require [clojure.string]))

(defmacro buyImpl [getter setter]
  `(recur
    (tool.core/assertSpec
     app.lobby.model/modelType
     (let [[~'id {~'key "key"}] ~'args]
       (try
         (let [~'_ (tool.core/assertSpec string? ~'key)
               ~'key (keyword ~'key)
               ~'item (tool.core/assertSpec
                       map?
                       (get-in ~getter [~'key]))
               ~'money (get-in ~'lobbyCtx [:money])
               ~'cost (get-in ~'item [:cost])
               ~'_ (tool.core/assertSpec #(>= % ~'cost) ~'money "money not enough")
               ~'lobbyCtx (tool.core/assertSpec
                           app.lobby.model/modelType
                           (-> ~'lobbyCtx
                               (update-in [:money] (constantly (- ~'money ~'cost)))
                               (update-in ~setter #(conj % [(keyword (str (cljs.core/random-uuid))) ~'key]))))
               ~'_ (a/>! ~'outputCh ["ok" [~'id [nil ~'lobbyCtx]]])]
           (app.lobby.model/save ~'lobbyCtx))
         (catch js/Error ~'e
           (js/console.log ~'e)
           (a/>! ~'outputCh ["ok" [~'id [~'e ~'lobbyCtx]]])
           ~'lobbyCtx))))))

(defmacro setKey1ByKey2Impl [k1 k2]
  (let [lobbyKey1 (keyword (str k1 "s"))
        lobbyKey2 (keyword (str k2 "s"))
        inputKey1 (str k1 "Key")
        inputKey2 (str k2 "Key")
        lobbyKey3 (keyword (str k1 "By" (clojure.string/capitalize (str k2))))]
    `(recur
      (tool.core/assertSpec
       app.lobby.model/modelType
       (let [[~'id {~'key1 ~inputKey1 ~'key2 ~inputKey2}] ~'args]
         (try
           (let [~'_ (tool.core/assertSpec string? ~'key1)
                 ~'_ (tool.core/assertSpec string? ~'key2)
                 ~'_ (tool.core/assertSpec #(-> ~'lobbyCtx ~lobbyKey1 %) (keyword ~'key1) (str ~'key1 " not found in " ~lobbyKey1))
                 ~'_ (tool.core/assertSpec #(-> ~'lobbyCtx ~lobbyKey2 %) (keyword ~'key2) (str ~'key2 " not found in " ~lobbyKey2))
                 ~'key1 (keyword ~'key1)
                 ~'key2 (keyword ~'key2)
                 ~'lobbyCtx (s/assert
                             app.lobby.model/modelType
                             (-> ~'lobbyCtx
                                 (update-in [~lobbyKey3] #(conj % [~'key2 ~'key1]))))]
             (a/>! ~'outputCh ["ok" [~'id [nil ~'lobbyCtx]]])
             (app.lobby.model/save ~'lobbyCtx))
           (catch js/Error ~'e
             (js/console.log ~'e)
             (a/>! ~'outputCh ["ok" [~'id [~'e ~'lobbyCtx]]])
             ~'lobbyCtx)))))))

(defmacro removeKey2Impl [k1 k2]
  (let [_ (keyword (str k1 "s"))
        lobbyKey2 (keyword (str k2 "s"))
        _ (str k1 "Key")
        inputKey2 (str k2 "Key")
        lobbyKey3 (keyword (str k1 "By" (clojure.string/capitalize (str k2))))]
    `(recur
      (tool.core/assertSpec
       app.lobby.model/modelType
       (let [[~'id {~'key2 ~inputKey2}] ~'args]
         (try
           (let [~'_ (tool.core/assertSpec #(-> ~'lobbyCtx ~lobbyKey2 %) (keyword ~'key2) (str ~'key2 " not found in " ~lobbyKey2))
                 ~'key2 (keyword ~'key2)
                 ~'lobbyCtx (s/assert
                             app.lobby.model/modelType
                             (-> ~'lobbyCtx
                                 (update-in [~lobbyKey3] #(dissoc % ~'key2))))]
             (a/>! ~'outputCh ["ok" [~'id [nil ~'lobbyCtx]]])
             (app.lobby.model/save ~'lobbyCtx))
           (catch js/Error ~'e
             (js/console.log ~'e)
             (a/>! ~'outputCh ["ok" [~'id [~'e ~'lobbyCtx]]])
             ~'lobbyCtx)))))))