(ns app.macros)

(defmacro defstate [name notifyEnter & body]
  `(defn ~name [~'ctx ~'inputCh ~'outputCh]
     (a/go
       (a/>! ~'outputCh ~notifyEnter))
     (let [~'worker (a/chan)]
       (a/go-loop [~'ctx ~'ctx]
         (let [[~'cmd ~'args :as ~'evt] (a/<! ~'inputCh)]
           ~@body))
       ~'worker)))